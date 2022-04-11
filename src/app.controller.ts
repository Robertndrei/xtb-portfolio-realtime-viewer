import { Controller, Get, Render } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Portfolio } from './models/portfolio';

import { ClientSocketGateway } from './client-socket/client-socket.gateway';
import { XtbApiService } from './xtb-api/xtb-api.service';

import * as WebSocket from "ws";

@Controller()
export class AppController {

   /**
    * Portolio data structure
    */
   private _portfolio: Portfolio;

   constructor(
      private configService: ConfigService,
      private readonly clientSocketGateway: ClientSocketGateway,
      private readonly xtbApiService: XtbApiService
   ) {
      this._portfolio = new Portfolio();

      /**
       * Get client requests
       */
      this.clientSocketGateway.clientRequest.subscribe(data => {
         if ( data === "update" ) {
            this.clientSocketGateway.updateClient(this._portfolio);
         }
      })

      /**
       * On XTB websocket connect
       */
      this.xtbApiService.connected.subscribe(data => {
         if ( data ) {
            this.xtbApiService.login();
         }
      })

      /**
       * On XTB websocket stream connect
       */
      this.xtbApiService.streamConnected.subscribe(data => {
         if ( data && this.xtbApiService.loggedStatus ) {
            this.xtbApiService.subscribeBalance();
            this.xtbApiService.subscribeTrades();
            this.xtbApiService.subscribeProfits();
         }
      })

      /**
       * On XTB websocket logged
       */
      this.xtbApiService.logged.subscribe(data => {
         if ( data ) {
            this.xtbApiService.requestTrades();

            if ( this.xtbApiService.streamConnectedStatus ) {
               this.xtbApiService.subscribeBalance();
               this.xtbApiService.subscribeTrades();
               this.xtbApiService.subscribeProfits();
            }
         }
      })

      /**
       * On XTB balance update
       */
      this.xtbApiService.balance.subscribe(data => {
         this._portfolio.updateBalance(data);
         this.clientSocketGateway.updateClient(this._portfolio);
      })

      /**
       * On XTB trade update
       */
      this.xtbApiService.trade.subscribe(data => {
         this._portfolio.updateTrade(data);
         this.clientSocketGateway.updateClient(this._portfolio);
      })

      /**
       * On XTB profit update
       */
      this.xtbApiService.profit.subscribe(data => {
         this._portfolio.trades.updateProfit(data);
         this._portfolio.calculateProfit();
         this.clientSocketGateway.updateClient(this._portfolio);
      })
   }

   @Get()
   @Render('index')
   root() {}
}
