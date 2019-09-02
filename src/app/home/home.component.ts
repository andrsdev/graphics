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
  plots = [];
  
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
        this.convertToMatTableData(items);
      };
      reader.readAsBinaryString(target.files[0]);
    }

  }

  convertToMatTableData(items: any[]){
    this.plots = [];
    for (let i = 0; i < items.length; i++) {
      const element = items[i];

      if(element.length === 2){
        this.plots.push({
          x: element[0],
          y: element[1],
        });
      }
    }

    console.log(this.plots);
  }

}
