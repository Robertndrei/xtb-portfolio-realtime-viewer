/**
 * Trades
 */
export class Trades {

   /**
    * Trades array
    */
   private _trades: Trade[] = [];

   constructor() {}

   get trades(): Trade[] {
      return this._trades;
   }

   /**
    * Insert or update a trade in the trades list
    * 
    * @param {Trade} trade Trade to be inserted or updated
    */
   update( trade: Trade ) {
      if ( trade !== undefined ) {
         const found = this._trades.findIndex(c => c.order === trade.order);

         if ( found !== -1 ) {
            this._trades[found].update(trade);
         } else {
            this._trades.push(trade);
         }
      }
   }

   updateProfit( data: Profit ) {
      if ( data !== undefined ) {
         const found = this._trades.findIndex(c => c.order === data.order);

         if ( found !== -1 ) {
            this._trades[found].profit = data.profit;
            this._trades[found].close_price = data.profitCalcPrice;
         }
      }
   }
}

/**
 * Trade
 */
export class Trade {

   private _symbol: string;
   private _profit: number;
   private _volume: number;
   private _order: number;
   private _close_price: number;
   private _close_time: number;
   private _closed: boolean;
   private _cmd: number;
   private _comment: string;
   private _commission: number;
   private _customComment: string;
   private _digits: number;
   private _expiration: number;
   private _margin_rate: number;
   private _offset: number;
   private _open_price: number;
   private _open_time: number;
   private _order2: number;
   private _position: number;
   private _sl: number;
   private _state: string;
   private _storage: number;
   private _tp: number;
   private _type: number;

   constructor(
      symbol: string,
      profit: number,
      volume: number,
      order: number,
      close_price?: number,
      close_time?: number,
      closed?: boolean,
      cmd?: number,
      comment?: string,
      commission?: number,
      customComment?: string,
      digits?: number,
      expiration?: number,
      margin_rate?: number,
      offset?: number,
      open_price?: number,
      open_time?: number,
      order2?: number,
      position?: number,
      sl?: number,
      state?: string,
      storage?: number,
      tp?: number,
      type?: number
   ) {
      this._symbol = symbol;
      this._profit = profit;
      this._volume = volume;
      this._order = order;
      this._close_price = close_price;
      this._close_time = close_time;
      this._closed = closed;
      this._cmd = cmd;
      this._comment = comment;
      this._commission = commission;
      this._customComment = customComment;
      this._digits = digits;
      this._expiration = expiration;
      this._margin_rate = margin_rate;
      this._offset = offset;
      this._open_price = open_price;
      this._open_time = open_time;
      this._order2 = order2;
      this._position = position;
      this._sl = sl;
      this._state = state;
      this._storage = storage;
      this._tp = tp;
      this._type = type;
   }

   get order(): number {
      return this._order;
   }

   get profit(): number {
      return this._profit;
   }
   
   set profit( profit: number ) {
      this._profit = profit;
   }

   set close_price ( close_price: number ) {
      this._close_price = close_price;
   }

   /**
    * Update this trade data
    * 
    * @param {Trade} trade Trade data
    */
   update( trade: Trade ) {
      if ( trade !== undefined ) {
         this._symbol = trade._symbol;
         this._profit = trade._profit;
         this._volume = trade._volume;
         this._order = trade._order;
         this._close_price = trade._close_price;
         this._close_time = trade._close_time;
         this._closed = trade._closed;
         this._cmd = trade._cmd;
         this._comment = trade._comment;
         this._commission = trade._commission;
         this._customComment = trade._customComment;
         this._digits = trade._digits;
         this._expiration = trade._expiration;
         this._margin_rate = trade._margin_rate;
         this._offset = trade._offset;
         this._open_price = trade._open_price;
         this._open_time = trade._open_time;
         this._order2 = trade._order2;
         this._position = trade._position;
         this._sl = trade._sl;
         this._state = trade._state;
         this._storage = trade._storage;
         this._tp = trade._tp;
         this._type = trade._type;
      }
   }
}

/**
 * Profit
 */
export interface Profit {
   order: number;
   order2: number;
   position: number;
   profit: number;
   marketValue: number;
   profitCalcPrice: number;
   profitRecalcPrice: number;
}