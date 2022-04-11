import { Injectable } from '@nestjs/common';
import { BehaviorSubject } from 'rxjs';
import * as WebSocket from "ws";
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

import { Balance } from '../models/portfolio';
import { Trade, Profit } from '../models/trades';

@Injectable()
export class XtbApiService {

   /**
    * XTB websocket
    */
   private ws: WebSocket;

   /**
    * XTB stream websocket
    */
   private wsStream: WebSocket;

   /**
    * Keep alive watchdog
    */
   private wsKeppAlive;
   private wsStreamKeppAlive;

   /**
    * XTB Stream session id
    */
   private streamSessionId: string;

   /**
    * An observable that stores the login state with the xtb account
    */
   private _logged = new BehaviorSubject<boolean>(false);
   logged = this._logged.asObservable();

   /**
    * An observable that stores the connection state with the
    * websocket server
    */
   private _connected = new BehaviorSubject<boolean>(false);
   connected = this._connected.asObservable();

   /**
    * An observable that stores the connection state with the
    * websocket stream server
    */
   private _streamConnected = new BehaviorSubject<boolean>(false);
   streamConnected = this._streamConnected.asObservable();

   /**
    * An observable that triggers on every balance change
    */
   private _balance = new BehaviorSubject<Balance>(undefined);
   balance = this._balance.asObservable();

   /**
    * An observable that triggers on every trade change
    */
   private _trade = new BehaviorSubject<Trade>(undefined);
   trade = this._trade.asObservable();

   /**
    * An observable that triggers on every trade change
    */
   private _profit = new BehaviorSubject<Profit>(undefined);
   profit = this._profit.asObservable();

   /**
    * Logger
    */
   private readonly logger = new Logger("CoinbaseFeedService");

   constructor(
      private configService: ConfigService
   ) {
      this.connectWs();
      this.connectWsStream();
      this.initWatchdog();
   }

   get loggedStatus(): boolean {
      return this._logged.getValue();
   }

   get streamConnectedStatus(): boolean {
      return this._streamConnected.getValue();
   }

   connectWs() {
      this.ws = new WebSocket(this.configService.get<string>('XTB_WSS_URL'));

      this.ws.on("open", (data) => {
         this._connected.next(true);
         this.wsKeppAlive = undefined;

         this.logger.log("Websocket opened");
      });

      this.ws.on("error", (message) => {
         this.ws.close()
         this._connected.next(false);
         this._logged.next(false);
         this.wsKeppAlive = undefined;

         this.logger.error("Websocket error");
      });

      this.ws.on("close", (message) => {
         this._connected.next(false);
         this.wsKeppAlive = undefined;

         this.logger.warn("Websocket closed");
      });

      this.ws.on("message", (message) => {
         this.message(message);
      });

      this.ws.on("pong", (message) => {
         clearTimeout(this.wsKeppAlive);
         this.wsKeppAlive = undefined;
      })
   }
   connectWsStream() {
      this.wsStream = new WebSocket(this.configService.get<string>('XTB_WSS_STREAM_URL'));

      this.wsStream.on("open", () => {
         this._streamConnected.next(true);
         this.wsStreamKeppAlive = undefined;

         this.logger.log("Websocket stream opened");
      });

      this.wsStream.on("error", (message) => {
         this.wsStream.close()
         this._streamConnected.next(false);
         this.wsStreamKeppAlive = undefined;

         this.logger.error("Websocket stream error");
      });

      this.wsStream.on("close", (message) => {
         this._streamConnected.next(false);
         this.wsStreamKeppAlive = undefined;

         this.logger.warn("Websocket stream closed");
      });

      this.wsStream.on("message", (message) => {
         this.streamMessage(message);
      });

      this.wsStream.on("pong", (message) => {
         clearTimeout(this.wsStreamKeppAlive);
         this.wsStreamKeppAlive = undefined;
      })
   }
   initWatchdog(){ 
      setInterval(() => {
         if ( this._connected.getValue() ) {
            try{
               this.ws.ping(1);
            } catch(e) {}
         }

         if ( this.wsKeppAlive === undefined ) {
            this.wsKeppAlive = setTimeout(() => {
               if ( !this._connected.getValue() ) {
                  this.logger.warn("Websocket pong not received, reconnecting...");
                  this.connectWs();
               }
            }, 5000);
         }
         
      }, 5000)
      
      setInterval(() => {
         if ( this._streamConnected.getValue() ) {
            try{
               this.wsStream.ping(1);
            } catch(e) {}
         }

         if ( this.wsStreamKeppAlive === undefined ) {
            this.wsStreamKeppAlive = setTimeout(() => {
               if ( !this._streamConnected.getValue() ) {
                  this.logger.warn("Websocket stream pong not received, reconnecting...");
                  this.connectWsStream();
               }
            }, 5000);
         }
      }, 5000)
   }

   /**
    * @ignore
    */
   message(data: any) {
      let message

      try {
         message = JSON.parse(data.toString());

         if ( !message.status ) {
            // MESSAGE ERROR
         } else if ( message.streamSessionId !== undefined ) {
            this.streamSessionId = message.streamSessionId;
            this._logged.next(true);
         } else if ( message.returnData !== undefined && message.returnData.length ) {
            message.returnData.forEach(item => {
               this._trade.next(new Trade(
                  item.symbol,
                  item.profit,
                  item.volume,
                  item.order,
                  item.close_price,
                  item.close_time,
                  item.closed,
                  item.cmd,
                  item.comment,
                  item.commission,
                  item.customComment,
                  item.digits,
                  item.expiration,
                  item.margin_rate,
                  item.offset,
                  item.open_price,
                  item.open_time,
                  item.order2,
                  item.position,
                  item.sl,
                  item.state,
                  item.storage,
                  item.tp,
                  item.type
               ));
            })
         }
      } catch ( e ) {}
   }

   /**
    * @ignore
    */
   streamMessage(data: any) {
      let message

      try {
         message = JSON.parse(data.toString());

         switch( message.command ) {
            case "balance": 
               // this.requestTrades();

               this._balance.next(new Balance(
                  message.data.balance,
                  message.data.credit,
                  message.data.equity,
                  message.data.margin,
                  message.data.margin_free,
                  message.data.margin_level
               ));
               break;
            case "trade": 
               this._trade.next(new Trade(
                  message.data.symbol,
                  message.data.profit,
                  message.data.volume,
                  message.data.order,
                  message.data.close_price,
                  message.data.close_time,
                  message.data.closed,
                  message.data.cmd,
                  message.data.comment,
                  message.data.commission,
                  message.data.customComment,
                  message.data.digits,
                  message.data.expiration,
                  message.data.margin_rate,
                  message.data.offset,
                  message.data.open_price,
                  message.data.open_time,
                  message.data.order2,
                  message.data.position,
                  message.data.sl,
                  message.data.state,
                  message.data.storage,
                  message.data.tp,
                  message.data.type
               ));
               break;
            case "profit":
               this._profit.next(message.data);
               break;
         }

      } catch ( e ) {}
   }

   /**
    * Login to XTB account
    */
   login() {
      this.ws.send(JSON.stringify(
         {
            "command": "login",
            "arguments": {
               "userId": this.configService.get<string>('XTB_ACCOUNT_ID'),
               "password": this.configService.get<string>('XTB_ACCOUNT_PASSWORD')
            }
         }
      ));
   }

   /**
    * Request trades from XTB account
    */
   requestTrades() {
      this.ws.send(JSON.stringify(
         {
            "command": "getTrades",
            "arguments": {
               "openedOnly": true
            }
         }
      ));
   }

   /**
    * Subscribe to balance from XTB account
    */
   subscribeBalance() {
      this.wsStream.send(JSON.stringify(
         {
            "command": "getBalance",
            "streamSessionId": this.streamSessionId
         }
      ));
   }

   /**
    * Subscribe to trades from XTB account
    */
   subscribeTrades() {
      this.wsStream.send(JSON.stringify(
         {
            "command": "getTrades",
            "streamSessionId": this.streamSessionId
         }
      ));
   }

   /**
    * Subscribe to trades from XTB account
    */
   subscribeProfits() {
      this.wsStream.send(JSON.stringify(
         {
            "command": "getProfits",
            "streamSessionId": this.streamSessionId
         }
      ));
   }
}
