import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  color = "#0000FF";
  charts = ['Dispersion', 'Lines', 'Columns', 'Bars', 'Histogram', 'Combined'];
  selectedChart = this.charts[0];
  
  canvasWidth = 1000;
  canvasHeight = 400;

  items = [];
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

  setChart(chart: string){
    this.selectedChart = chart;
    if(this.items.length > 0){
      this.buildGraphics();
    }
  }

  setColor(color: string){
    this.color = color;
    if(this.items.length > 0){
      this.buildGraphics();
    }
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
        this.items = (XLSX.utils.sheet_to_json(ws, {header: 1}));
        this.items.shift();
        if(this.items.length > 0){
          this.buildGraphics();
        }
      };
      reader.readAsBinaryString(target.files[0]);
    }

  }

  buildGraphics(){
    this.plots = [];

    for (let i = 0; i < this.items.length; i++) {
      const element = this.items[i];

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

    
    switch (this.selectedChart) {
      case 'Dispersion':
        this.drawDispersionGraphic();
        break;
      case 'Columns':
        this.drawColumnsGraphic();
        break;
      case 'Lines':
        this.drawLinesGraphic();
        break;
    
      default:
        break;
    }

    
    
    console.log(this.plots);
  }

  drawCartesianPlane(){
    let element = <HTMLCanvasElement> document.getElementById("canvas");
    let canvas = element.getContext("2d");

    canvas.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    canvas.beginPath();
    canvas.fillStyle = "#000000";

    let maxDistanceX = Math.max(Math.abs(this.minX), Math.abs(this.maxX));
    let maxDistanceY = Math.max(Math.abs(this.minY), Math.abs(this.maxY));

    canvas.moveTo(this.canvasWidth / 2, 0);
    canvas.lineTo(this.canvasWidth / 2, this.canvasHeight);

    canvas.moveTo(0, this.canvasHeight / 2);
    canvas.lineTo(this.canvasWidth, this.canvasHeight / 2);

    canvas.fillText("Y", this.canvasWidth / 2 + 10, 10);
    canvas.fillText("X", this.canvasWidth - 10, this.canvasHeight / 2 - 12);

    this.xDistance = maxDistanceX / 5;
    let xDistanceAcum = -maxDistanceX;
    for (let i = this.canvasWidth / 10; i < this.canvasWidth; i+=this.canvasWidth / 10) {   
      canvas.moveTo(i, this.canvasHeight / 2 - 5);
      canvas.lineTo(i, this.canvasHeight / 2 + 5);
      
      xDistanceAcum+= this.xDistance;
      if(i != this.canvasWidth / 2){
        canvas.fillText(Math.round(xDistanceAcum).toString(), i - 4, this.canvasHeight / 2 + 24);
      }

    }

    this.yDistance = maxDistanceY / 5;
    let yDistanceAcum = maxDistanceY;
    for (let i = this.canvasHeight / 10; i < this.canvasHeight; i+=this.canvasHeight / 10) {   
      canvas.moveTo(this.canvasWidth / 2 - 5, i);
      canvas.lineTo(this.canvasWidth / 2 + 5, i);
      
      yDistanceAcum-= this.yDistance;
      if(i != this.canvasHeight / 2){
        canvas.fillText(Math.round(yDistanceAcum).toString(), this.canvasWidth / 2 - 24, i + 2);
      }
    }

    canvas.stroke();
  }

  drawDispersionGraphic(){

    this.drawCartesianPlane();
    
    let element = <HTMLCanvasElement> document.getElementById("canvas");
    let canvas = element.getContext("2d");
  
    let xProportion = (this.canvasWidth / 2) / this.maxX;
    let yProportion = (this.canvasHeight / 2) / this.maxY;

    canvas.fillStyle = this.color;;
    canvas.moveTo(this.canvasWidth / 2, this.canvasHeight / 2);
    for (let i = 0; i < this.plots.length; i++) {

      const plot: any = this.plots[i];
      let x = this.canvasWidth / 2 + plot.x*xProportion;
      let y = this.canvasHeight / 2 - plot.y*yProportion;


      canvas.fillRect(x - 2, y - 1.5 , 4, 3);
      
    }

    canvas.stroke();
  }

  drawLinesGraphic(){
    
    this.drawCartesianPlane();

    let element = <HTMLCanvasElement> document.getElementById("canvas");
    let canvas = element.getContext("2d");

    let xProportion = (this.canvasWidth / 2) / this.maxX;
    let yProportion = (this.canvasHeight / 2) / this.maxY;

    canvas.fillStyle = this.color;

    canvas.moveTo(this.canvasWidth / 2, this.canvasHeight / 2);
    for (let i = 0; i < this.plots.length; i++) {

      const plot: any = this.plots[i];
      let x = this.canvasWidth / 2 + plot.x*xProportion;
      let y = this.canvasHeight / 2 - plot.y*yProportion;

 
      canvas.lineTo(x, y);   
    }

    canvas.stroke();
  }

  drawColumnsGraphic(){
    
    this.drawCartesianPlane();

    let element = <HTMLCanvasElement> document.getElementById("canvas");
    let canvas = element.getContext("2d");


    let xProportion = (this.canvasWidth / 2) / this.maxX;
    let yProportion = (this.canvasHeight / 2) / this.maxY;

    canvas.fillStyle = this.color;
    canvas.moveTo(this.canvasWidth / 2, this.canvasHeight / 2);
    for (let i = 0; i < this.plots.length; i++) {

      const plot: any = this.plots[i];
      let x = this.canvasWidth / 2 + plot.x*xProportion;
      let y = this.canvasHeight / 2 - plot.y*yProportion;


      canvas.fillRect(x - 2, y - 1.5 , 4, this.canvasHeight / 2 - y);
    }

    canvas.stroke();
  }



}
