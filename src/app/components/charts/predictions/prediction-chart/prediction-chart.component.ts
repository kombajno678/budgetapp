import { Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Observable } from 'rxjs';

import { PredicionPoint } from 'src/app/models/internal/PredictionPoint';

@Component({
  selector: 'app-prediction-chart',
  templateUrl: './prediction-chart.component.html',
  styleUrls: ['./prediction-chart.component.scss']
})
export class PredictionChartComponent implements OnInit {



  @Input()
  data$: Observable<PredicionPoint[]>;


  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Series A' },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,

  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'black',
      backgroundColor: 'rgba(255,0,0,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  constructor() { }

  ngOnInit() {
    if (this.data$) {
      this.data$.subscribe(r => {
        if (r) {
          //console.log('received new chart data : ', r);
          this.lineChartData[0].data = [];
          this.lineChartLabels = [];
          r.forEach(p => {
            this.lineChartData[0].data.push(p.value);
            this.lineChartLabels.push(p.date.toISOString().substr(0, 10));
          })

        }
      })
    } else {
      console.error('chart initialized with no data observable');
    }


  }

}
