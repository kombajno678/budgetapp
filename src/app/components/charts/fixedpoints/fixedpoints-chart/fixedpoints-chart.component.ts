import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { Observable } from 'rxjs';
import { async } from 'rxjs/internal/scheduler/async';
import { FixedPoint } from 'src/app/models/FixedPoint';

@Component({
  selector: 'app-fixedpoints-chart',
  templateUrl: './fixedpoints-chart.component.html',
  styleUrls: ['./fixedpoints-chart.component.scss']
})
export class FixedpointsChartComponent implements OnInit {

  @Input()
  fixedPoints$: Observable<FixedPoint[]>;

  public lineChartData: ChartDataSets[] = [
    {
      data: [],
      label: 'Fixed points',
      pointRadius: 10,
      pointStyle: 'circle'
    },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        id: 'days',
        ticks: {
          reverse: false,
          /*fontColor: 'rgba(255, 255, 255, 1.0)',*/
          display: false,
        },

      }],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          ticks: {
            callback: (value, index, values) => {
              /*if(values.reduce((p, c, i, a) => p = p + c) > 1000)*/
              return Number(value) / 1000 + 'k';
            }
          }
        }
      ]
    }

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

  constructor() {

  }
  

  ngOnInit() {
    this.fixedPoints$.subscribe(r => {
      if (r) {
        //sort by date
        this.lineChartData[0].data = [];
        this.lineChartLabels = [];

        //this.data = [];
        r.forEach(fp => {
          this.lineChartLabels.push(fp.when.toISOString().substr(0, 10));
          this.lineChartData[0].data.push(fp.exact_value);
        });
        //this.labels = [];
        //r.forEach(fp => this.lineChartLabels.push(fp.when.toISOString().substr(0, 10)));

      }

    })
  }

}
