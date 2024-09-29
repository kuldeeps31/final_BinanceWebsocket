import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
//import { CandlestickChartComponent } from '../candlestick-chart/candlestick-chart.component';
import { CandlestickLineComponent } from './candlestick-line/candlestick-line.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CandlestickLineComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crypto-card';
}
