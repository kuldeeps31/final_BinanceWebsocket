//import { Injectable } from '@angular/core';

//@Injectable({
//  providedIn: 'root'
//})
//export class HistoricalDataService {

//  constructor() { }
//}
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class HistoricalDataService {
  
  // Store data in local storage
  saveData(symbol: string, interval: string, data: any) {
    const key = `${symbol}_${interval}`;
    localStorage.setItem(key, JSON.stringify(data));
  }

  // Retrieve data from local storage
  getData(symbol: string, interval: string): any {
    
    const key = `${symbol}_${interval}`;
    console.log("-->",key);
    const storedData = localStorage.getItem(key);
    return storedData ? JSON.parse(storedData) : null;
  }

  // Clear data for a specific symbol and interval
  clearData(symbol: string, interval: string) {
    const key = `${symbol}_${interval}`;
    localStorage.removeItem(key);
  }

  // Clear all stored data
  clearAllData() {
    localStorage.clear();
  }
}
