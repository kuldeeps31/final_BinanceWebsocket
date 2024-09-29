import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { OnDestroy,OnInit } from '@angular/core';  
import { CommonModule } from '@angular/common'; 
import { register } from 'module';
import {  ChartDataset, ChartTypeRegistry, Plugin } from 'chart.js';
import { chartserviceService } from '../chartservice.service';
import {  Chart,registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import 'chartjs-chart-financial';
Chart.register(...registerables);
import { ViewChild,AfterViewInit,ElementRef } from '@angular/core';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { CandlestickController, CandlestickElement } from 'chartjs-chart-financial';
import { HistoricalDataService } from '../services/historical-data.service';
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  CandlestickController,
  CandlestickElement,
  Tooltip,
  Legend
);


@Component({
  selector: 'app-candlestick-line',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './candlestick-line.component.html',
  styleUrl: './candlestick-line.component.css'
})


export class CandlestickLineComponent implements OnInit, OnDestroy {

private chart: Chart | null = null;
  //isLoading: boolean = false;
  public candlestickData: any[] = [];
  public currentSymbol: string = 'ethusdt';
  public currentInterval: string = '1m';
  public isLoading:Boolean=false;
  public hasError: boolean = false; 


  constructor(
    private historicalDataService: HistoricalDataService,
    private chartdata: chartserviceService
  ) {}

  ngAfterViewInit(): void {
    this.loadHistoricalData();
    this.initializeWebSocket();
  }
  ngOnInit(): void {
    console.log("ngOnInit is triggered");
    console.log("loading data.........");
    //this.loadHistoricalData();
    this.initializeWebSocket();
  }

  // Load historical data from local storage
  loadHistoricalData() {
    console.log("****data is loaded");
    this.isLoading=true;
    this.hasError = false;

    const savedData = this.historicalDataService.getData(this.currentSymbol, this.currentInterval);
    if (savedData) {
      console.log("got the parsed data");
      this.candlestickData = savedData;
      console.log("->>", this.candlestickData);
      this.createChart();
      this.isLoading = false;
    } else {
      this.candlestickData = [];
      this.createChart();
      this.isLoading = false;
    }
    this.initializeWebSocket(); 
   

  }

  // Initialize WebSocket connection using the service
  initializeWebSocket() {
    console.log("websocket is initialized.......");

    // Connect to the WebSocket
    this.chartdata.connect(this.currentSymbol, this.currentInterval);

    // Subscribe to incoming candlestick data
    this.chartdata.getCandlestickData().subscribe((message) => {
    
      const candlestick = message.k;
      if (candlestick.x) { // Only push complete candlesticks
        this.candlestickData.push({
          t: new Date(candlestick.t),
          o: candlestick.o,
          h: candlestick.h,
          l: candlestick.l,
          c: candlestick.c,
        });

        // Save data to local storage
        this.historicalDataService.saveData(this.currentSymbol, this.currentInterval, this.candlestickData);
        this.updateChart(); // Update chart with new data
      }
      error: (err:any) => {
        console.error('WebSocket error: ', err);
        this.hasError = true;
        this.isLoading = false; // Stop loader if an error occurs
      }
    });
  }

  // Create the Chart.js chart
  createChart() {
    console.log("started rendering chart.....");
    const ctx = (document.getElementById('candlestickChart') as HTMLCanvasElement).getContext('2d');

    if (this.chart) {
      this.chart.destroy();
    }

    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'candlestick',
        data: {
          datasets: [
            {
              label: `${this.currentSymbol.toUpperCase()} Candlestick Chart`,
              data: this.candlestickData.map((d) => ({
                x: d.t,
                o: d.o,
                h: d.h,
                l: d.l,
                c: d.c,
              })),
             
            },
          ],
        },

        
        options: {
          
          
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'minute',
              },
            },
            y: {
              beginAtZero: false,
            },
          },
          plugins: {
            tooltip: {
                enabled: true, // Ensure tooltips are enabled
                mode: 'index', // Tooltip mode
                intersect: false, // Set to true if you want the tooltip only to show when directly on the data point
               
            },
        },
        },
        
      });
      
    }
  }

  // Update the chart with new data
  updateChart() {
    if (this.chart) {
      this.chart.data.datasets[0].data = this.candlestickData.map((d) => ({
        x: d.t,
        o: d.o,
        h: d.h,
        l: d.l,
        c: d.c,
      }));
      this.chart.update();
    }
  }

  
  switchSymbol(event: Event): void {
    this.isLoading=true;
    console.log("loading started");
    const target = event.target as HTMLSelectElement; // Type assertion
    if (target) { // Null check
        const selectedValue = target.value;
        this.currentSymbol = selectedValue;
        this.loadHistoricalData();
        //this.isLoading=false;
    }
}

switchInterval(event: Event): void {
  this.isLoading=true;
  console.log("loading started");
  const target = event.target as HTMLSelectElement; // Type assertion
  if (target) { // Null check
      const selectedValue = target.value;
      this.currentInterval = selectedValue;
      this.loadHistoricalData();
      this.isLoading=false;
     
  }
}

  // Cleanup WebSocket on component destruction
  ngOnDestroy(): void {
    console.log("existing chart is closed...")
    this.chartdata.close(); // Close the WebSocket connection
  }
}





















