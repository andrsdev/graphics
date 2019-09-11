import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  charts = ['Dispersion', 'Lines', 'Columns', 'Bars', 'Histogram', 'Combined']
  selectedChart = this.charts[0];
  
  canvasWidth = 1000;
  canvasHeight = 600;

  plots = [];

  minX: number;
  minY: number;
  maxX: number;
  maxY: number;

  xDistance: number;
  yDistance: number;
  
  constructor() { }

  ngOnInit() {
  }

  async loadExcelFile() {
    document.getElementById('fileOpener').click();
  }

  setChart(item: string){
    this.selectedChart = item;
  }

  onFileChange(evt: any) {
    /* wire up file reader */
    const target: DataTransfer = <DataTransfer>(evt.target);
    
    if (target.files.length === 1){
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, {type: 'binary'});
  
        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
  
        /* save data */
        let items = (XLSX.utils.sheet_to_json(ws, {header: 1}));
        items.shift();
        this.initializeData(items);
      };
      reader.readAsBinaryString(target.files[0]);
    }

  }

  initializeData(items: any[]){
    this.plots = [];

    for (let i = 0; i < items.length; i++) {
      const element = items[i];

      if(element.length === 2){

        let x = element[0];
        let y = element[1];
        
        //Iniitialize the min and max values
        if(i === 0){
          this.minX = x;
          this.minY = y;
          this.maxX = x;
          this.maxY = y;
        } else {
          if(this.minX > x) this.minX = x;
          if(this.minY > y) this.minY = y;
          if(this.maxX < x) this.maxX = x;
          if(this.maxY < y) this.maxY = y;
        }

        this.plots.push({
          x: x,
          y: y,
        });
      }
    }

    this.xDistance = this.maxX - this.minX;
    this.yDistance = this.maxY - this.minY;


    this.drawCartesianPlane();

    console.log(this.plots);
  }

  drawCartesianPlane(){
   let element = <HTMLCanvasElement> document.getElementById("canvas");
   let canvas = element.getContext("2d");

   
  
   canvas.fillStyle = "#00FF00";
   canvas.fillRect(0, 0, 1000, 600);
  }


}
