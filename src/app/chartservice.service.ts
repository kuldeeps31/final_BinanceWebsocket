//import { Injectable } from '@angular/core';
//import { WebSocketSubject } from 'rxjs/webSocket';
//@Injectable({
//  providedIn: 'root'
//})
//export class ChartserviceService {

//  constructor() { }
//}
import { Injectable } from '@angular/core';
import { WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class chartserviceService {
  private ws!: WebSocketSubject<any>;

  connect(symbol: string, interval: string) {
    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol}@kline_${interval}`;
    this.ws = new WebSocketSubject(wsUrl);
  }

  getCandlestickData() {
    return this.ws.asObservable();
  }

  close() {
    if (this.ws) {
      this.ws.unsubscribe();
    }
  }
}
