import { Trades, Trade } from './trades';
import { terminal as term } from 'terminal-kit';

/**
 * Portfolio
 */
export class Portfolio {

   /**
    * Balance
    */
   private _balance: Balance;

   /**
    * Trades array
    */
   private _trades: Trades;

   constructor() {
      this._balance = new Balance();
      this._trades = new Trades();
   }

   get balance(): Balance {
      return this._balance;
   }

   get trades(): Trades {
      return this._trades;
   }

   /**
    * Update balance
    * 
    * @param {Balance} balance Balance to be updated
    */
   updateBalance( balance: Balance ) {
      this._balance.update(balance);
   }

   /**
    * Insert or update a trade in the trades list
    * 
    * @param {Trade} trade Trade to be inserted or updated
    */
   updateTrade( trade: Trade ) {
      this._trades.update(trade);

      this.calculateProfit();
   }

   /**
    * Calculate portfolio profit
    */
   calculateProfit() {
      let profit = 0;

      this._trades.trades.forEach(trade => profit += trade.profit);

      this._balance.profit = profit;
   }
}

/**
 * Balance
 */

export class Balance {

   /**
    * Balance in account currency
    */
   private _balance: number;

   /**
    * Credit in account currency
    */
   private _credit: number;

   /**
    * Sum of balance and all profits in account currency
    */
   private _equity: number;

   /**
    * Margin requirements
    */
   private _margin: number;

   /**
    * Free margin
    */
   private _margin_free: number;

   /**
    * Margin level percentage
    */
   private _margin_level: number;

   /**
    * Total profit
    */
   private _profit: number;

   constructor(
      balance?: number,
      credit?: number,
      equity?: number,
      margin?: number,
      margin_free?: number,
      margin_level?: number,
      profit?: number
   ) {
      this._balance = balance;
      this._credit = credit;
      this._equity = equity;
      this._margin = margin;
      this._margin_free = margin_free;
      this._margin_level = margin_level;
      this._profit = profit;
   }

   set profit( profit: number ) {
      this._profit = profit;
   }

   /**
    * Update this balance data
    * 
    * @param {Balance} balance Balance data
    */
   update( balance: Balance ) {
      if ( balance !== undefined ) {
         this._balance = balance._balance;
         this._credit = balance._credit;
         this._equity = balance._equity;
         this._margin = balance._margin;
         this._margin_free = balance._margin_free;
         this._margin_level = balance._margin_level;
      }
   }
}
