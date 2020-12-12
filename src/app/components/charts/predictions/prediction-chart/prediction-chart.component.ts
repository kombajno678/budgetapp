import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, BaseChartDirective } from 'ng2-charts';
import { Observable } from 'rxjs';

import { PredicionPoint } from 'src/app/models/internal/PredictionPoint';

import * as pluginAnnotations from 'chartjs-plugin-annotation';
import * as pluginZoom from 'chartjs-plugin-zoom';


@Component({
  selector: 'app-prediction-chart',
  templateUrl: './prediction-chart.component.html',
  styleUrls: ['./prediction-chart.component.scss']
})
export class PredictionChartComponent implements OnInit {



  @Input()
  compact: boolean;// = false;
  @Input()
  data$: Observable<PredicionPoint[]>;

  @Input()
  width: number
  @Input()
  height: number

  @ViewChild('chart')
  chart: Chart;

  displayYear: boolean = true;
  DisplayMonth: boolean = true


  public lineChartData: ChartDataSets[] = [
    {
      data: [],
      label: 'History',
      borderWidth: 6,
      pointRadius: 0,
      pointHitRadius: 6,
      pointHoverBorderWidth: 10,
      pointHoverBorderColor: 'rgb(255, 255, 255, 0.5)',
      lineTension: 0,
      spanGaps: false,
    },
    {
      data: [],
      label: 'Future',
      borderWidth: 6,
      pointRadius: 0,
      pointHitRadius: 6,
      pointHoverBorderWidth: 10,
      pointHoverBorderColor: 'rgb(255, 255, 255, 0.5)',
      lineTension: 0,
      spanGaps: false,
    },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any } & { pan: any } & { zoom: any }) = {
    responsive: true,
    tooltips: {
      bodyFontSize: 16,
      enabled: true,
    },
    maintainAspectRatio: false,
    elements: {
      line: {
        tension: 0,

      }
    },
    scales: {
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
          ticks: {
            display: true,
          }
          /*
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          },
          */

        },
      ],
      xAxes: [
        {
          id: 'days',
          ticks: {
            //sampleSize: 10,
            autoSkipPadding: 14,
            minRotation: 0,
            maxRotation: 90,
            //display: !this.compact,
          }
        }
      ]
    },


    annotation: {
      annotations: [
        {
          type: 'line',
          mode: 'vertical',
          scaleID: 'days',
          value: this.dateToStr(new Date()),
          borderColor: 'orange',
          borderWidth: 2,
          label: {
            enabled: true,
            fontColor: 'orange',
            content: ''
          }
        },
      ]
    },


    // Container for pan options
    pan: {
      // Boolean to enable panning
      enabled: true,

      // Panning directions. Remove the appropriate direction to disable
      // Eg. 'y' would only allow panning in the y direction
      // A function that is called as the user is panning and returns the
      // available directions can also be used:
      //   mode: function({ chart }) {
      //     return 'xy';
      //   },
      mode: 'x',

      rangeMin: {
        // Format of min pan range depends on scale type
        x: null,
        y: null
      },
      rangeMax: {
        // Format of max pan range depends on scale type
        x: null,
        y: null
      },

      // On category scale, factor of pan velocity
      speed: 10,

      // Minimal pan distance required before actually applying pan
      threshold: 10,

      // Function called while the user is panning
      //onPan: function ({ chart }) { console.log(`I'm panning!!!`); },
      // Function called once panning is completed
      //onPanComplete: function ({ chart }) { console.log(`I was panned!!!`); }
    },

    // Container for zoom options
    zoom: {
      // Boolean to enable zooming
      enabled: true,

      // Enable drag-to-zoom behavior
      drag: false,

      // Drag-to-zoom effect can be customized
      // drag: {
      // 	 borderColor: 'rgba(225,225,225,0.3)'
      // 	 borderWidth: 5,
      // 	 backgroundColor: 'rgb(225,225,225)',
      // 	 animationDuration: 0
      // },

      // Zooming directions. Remove the appropriate direction to disable
      // Eg. 'y' would only allow zooming in the y direction
      // A function that is called as the user is zooming and returns the
      // available directions can also be used:
      //   mode: function({ chart }) {
      //     return 'xy';
      //   },
      mode: 'x',

      rangeMin: {
        // Format of min zoom range depends on scale type
        x: null,
        y: null
      },
      rangeMax: {
        // Format of max zoom range depends on scale type
        x: null,
        y: null
      },

      // Speed of zoom via mouse wheel
      // (percentage of zoom on a wheel event)
      speed: 10.0,

      // Minimal zoom distance required before actually applying zoom
      threshold: 0,

      // On category scale, minimal zoom level before actually applying zoom
      sensitivity: 0,

      // Function called while the user is zooming
      //onZoom: function ({ chart }) { console.log(`I'm zooming!!!`); },
      // Function called once zooming is completed
      //onZoomComplete: function ({ chart }) { console.log(`I was zoomed!!!`); }
    }





  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(255, 128, 32,0.3)',
      borderColor: 'rgba(255, 128, 32)'

    },
    {
      backgroundColor: 'rgba(32, 128, 255,0.3)',
      borderColor: 'rgba(32, 128, 255)'

    },
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [pluginAnnotations, pluginZoom];

  constructor() {

  }

  dateToStr(date: Date, y: boolean = this.displayYear, m: boolean = this.DisplayMonth, d: boolean = true) {
    let s = date.toISOString();
    return `${y ? s.substr(0, 4) : ''}${m ? (y ? '-' : '') + s.substr(5, 2) : ''}${d ? (m ? '-' : '') + s.substr(8, 2) : ''}`;

  }

  resetZoom() {
    //this.chart.resetZoom();
  }

  ngOnInit() {
    console.log('this.compact = ', this.compact);

    this.lineChartOptions.tooltips.enabled = !this.compact;
    //this.lineChartOptions.scales.yAxes.forEach(y => y.ticks.display = !this.compact)
    this.lineChartOptions.scales.xAxes.forEach(x => x.ticks.display = !this.compact)
    this.lineChartLegend = !this.compact

    if (this.data$) {
      this.data$.subscribe(r => {
        if (r) {
          //check if one year
          if (r[0].date.getFullYear() === r[r.length - 1].date.getFullYear()) {
            this.displayYear = false;
          }
          this.lineChartData[0].data = [];
          this.lineChartData[1].data = [];

          this.lineChartLabels = [];

          let n = this.dateToStr(new Date());
          r.forEach(p => {
            let d = this.dateToStr(p.date);

            let value: number = Number(p.value.toFixed(2));

            if (d < n) {
              this.lineChartData[0].data.push(value);
              this.lineChartData[1].data.push(null);
            } else if (d > n) {
              this.lineChartData[0].data.push(null);
              this.lineChartData[1].data.push(value);
            } else {
              this.lineChartData[0].data.push(value);
              this.lineChartData[1].data.push(value);
            }

            this.lineChartLabels.push(d);
          })

        } else {
          console.error('prediction chart received incorrent data');
        }
      })
    } else {
      console.error('chart initialized with no data observable');
    }


  }

}
