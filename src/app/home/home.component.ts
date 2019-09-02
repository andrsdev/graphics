import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  charts = ['Dispersion', 'Lines', 'Columns', 'Bars', 'histogram', 'Combined']
  selectedChart = this.charts[0];
  
  constructor() { }

  ngOnInit() {
  }

  setChart(item: string){
    this.selectedChart = item;
  }

}
