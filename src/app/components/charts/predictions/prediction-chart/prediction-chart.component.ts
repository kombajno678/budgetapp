import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartPoint, ChartType } from 'chart.js';
import { Color, Label, BaseChartDirective } from 'ng2-charts';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';


import { PredictionPoint } from 'src/app/models/internal/PredictionPoint';

import * as pluginAnnotations from 'chartjs-plugin-annotation';
import * as pluginZoom from 'chartjs-plugin-zoom';
import { PredictionChartCardConfig } from 'src/app/components/dashboard-cards/prediction-chart-card/prediction-chart-card.component';


import Chart from 'chart.js';
import moment, { Moment } from 'moment';


import * as Highcharts from 'highcharts';
Highcharts.setOptions({
  
});


@Component({
  selector: 'app-prediction-chart',
  templateUrl: './prediction-chart.component.html',
  styleUrls: ['./prediction-chart.component.scss']
})
export class PredictionChartComponent implements OnInit, AfterViewInit {


  highchartSeriesClicked = (event) => {

    
    //console.log('clicked at ', this.categoriesMap.get(event.point.category));
    this.onDayClicked.emit(this.categoriesMap.get(event.point.category));
  }

  categoriesMap:Map<string, Date> = new Map<string, Date> ();



  Highcharts: typeof Highcharts = Highcharts; // required
  isHighcharts = typeof Highcharts === 'object';
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {
    
    series: [
      {
      data: [],
      type: 'line',
      name: 'fixed points',
      events:{
        click: this.highchartSeriesClicked
      }
    },
    {
      data: [],
      type: 'line',
      name: 'history',
      events:{
        click: this.highchartSeriesClicked
      }
    },
    {
      data: [],
      type: 'line',
      name: 'future',
      events:{
        click: this.highchartSeriesClicked
      }
    },

    

    
  ],


    xAxis: {
      categories: []
    },
    yAxis: {
      
      title: {
        text: ''
      }
      
    },



  }; // required
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) {
    chart.setTitle({text:''});
  } // optional function, defaults to null
  updateFlag: boolean = false; // optional boolean
  oneToOneFlag: boolean = false; // optional boolean, defaults to false
  runOutsideAngular: boolean = false; // optional boolean, defaults to false




  todayAnnotation = {
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
  };



  displayChart: boolean = true;


  @Input()
  config$: Observable<PredictionChartCardConfig>;// = false;


  @Input()
  compact: boolean;// = false;
  @Input()
  data$: Observable<PredictionPoint[]>;

  @Input()
  width: number
  @Input()
  height: number


  @Input()
  delayOnUpdate: boolean = false;

  @ViewChild(BaseChartDirective) chartCanvas: BaseChartDirective;
  chart: any;


  loading$: BehaviorSubject<boolean>;

  @Output()
  onDayClicked: EventEmitter<Date>;


  displayYear: boolean = true;
  DisplayMonth: boolean = true


  public lineChartData: ChartDataSets[] = [
    {
      data: [],
      label: 'Fixed points',
      borderWidth: 1,
      pointRadius: 4,
      pointHitRadius: 6,
      pointHoverBorderWidth: 8,
      pointHoverBorderColor: 'rgb(255, 255, 255, 0.5)',
      lineTension: 0,
      spanGaps: false,
    },

    {
      data: [],
      label: 'History',
      borderWidth: 6,
      pointRadius: 1,
      pointHitRadius: 6,
      pointHoverBorderWidth: 8,
      pointHoverBorderColor: 'rgb(255, 255, 255, 0.5)',
      lineTension: 0,
      spanGaps: false,
    },
    {
      data: [],
      label: 'Future',
      borderWidth: 6,
      pointRadius: 1,
      pointHitRadius: 6,
      pointHoverBorderWidth: 10,
      pointHoverBorderColor: 'rgb(255, 255, 255, 0.5)',
      lineTension: 0,
      spanGaps: false,
    },

  ];


  public lineChartLabels/*: Label[]*/ = [];
  public lineChartOptions: (ChartOptions & { annotation?: any } & { pan?: any } & { zoom?: any }) = {
    responsive: true,
    tooltips: {
      bodyFontSize: 16,
      enabled: true,
      mode: 'index',
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
            callback: (value, index, values) => {

              let x = Number(value);
              let i = 0;
              while ((x / Math.pow(1000, i)) > 1000) {
                i++
              }
              return ((x / Math.pow(1000, i))).toLocaleString() + 'k'.repeat(i);
              //return value.toLocaleString(null, { maximumSignificantDigits: 3 });
            },
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


          type: "time",
          distribution: 'linear',
          time: {
            minUnit: 'day',
            unit: 'day',
            round: 'day',
            stepSize: 14,
            displayFormats: {
              month: 'MM.YYYY',
              week: 'DD.MM.YYYY',
              day: 'DD.MM.YYYY',
              hour: 'DD.MM.YYYY',
              minute: 'DD.MM.YYYY',
            },
          },

          ticks: {
            //sampleSize: 10,
            autoSkipPadding: 14,
            minRotation: 0,
            maxRotation: 90,
            //display: !this.compact,
            /*
            callback: (value, index, values) => {
              if (('' + values[0]).substr(0, 4) === ('' + values[values.length - 1]).substr(0, 4)) {
                return ('' + value).substring(5);
              } else {
                return value;
              }
            },
            */

          }
        }
      ]
    },


    annotation: {
      annotations: [
        /*
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
        */
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
      speed: 2,

      // Minimal pan distance required before actually applying pan
      threshold: 0,

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
      // 	 borderColor: 'rgba(225,225,225,0.3)',
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
      speed: 0.1,

      // Minimal zoom distance required before actually applying zoom
      threshold: 0,

      // On category scale, minimal zoom level before actually applying zoom
      sensitivity: 1,

      // Function called while the user is zooming
      //onZoom: function ({ chart }) { console.log(`I'm zooming!!!`); },
      // Function called once zooming is completed
      //onZoomComplete: function ({ chart }) { console.log(`I was zoomed!!!`); }
    }



  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(192, 255, 0,1)',
      borderColor: 'rgba(0, 255, 0)'

    },
    {
      backgroundColor: 'rgba(255, 64, 192,0.3)',
      borderColor: 'rgba(255, 64, 192)'

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
    this.onDayClicked = new EventEmitter<Date>();
  }

  dateToStr(date: Date, y: boolean = this.displayYear, m: boolean = this.DisplayMonth, d: boolean = true) {
    let s = date.toISOString();
    return `${y ? s.substr(0, 4) : ''}${m ? (y ? '-' : '') + s.substr(5, 2) : ''}${d ? (m ? '-' : '') + s.substr(8, 2) : ''}`;

  }

  onChartClick(event: { event: MouseEvent, active: any[] }) {
    console.log(event);
    if (event.active.length >= 1) {
      event.active.forEach(chartElement => {
        console.log(chartElement);
        //let clickedDate:Moment = moment(chartElement._xScale._labelItems[chartElement._index]);
        let clickedDate: Moment = moment(this.lineChartLabels[chartElement._index]);
        //let clickedDate:Moment = (this.lineChartLabels[chartElement._index]);

        //if (clickedDate.getFullYear() < chartElement._xScale.min.substr(0, 4)) {
        //  clickedDate.setFullYear(chartElement._xScale.min.substr(0, 4));
        //}

        console.log('=========================================================');
        console.log('chartElement._xScale._minIndex : ', chartElement._xScale._minIndex);
        console.log('clicked at index : ', chartElement._index);
        console.log('this.lineChartLabels : ', this.lineChartLabels);
        console.log('click at : ', clickedDate);
        this.onDayClicked.emit(clickedDate.toDate());
      })
    }
  }




  clearAnnotations() {

    this.lineChartOptions.annotation.annotations = [];
    console.log(this.lineChartOptions.annotation.annotations);
  }
  lastDateTest = new Date();
  addAnnotation() {

    this.lineChartData[0].data.push(0);

    this.lastDateTest.setDate(this.lastDateTest.getDate() + 1);



    this.lineChartOptions.annotation.annotations.push({
      type: 'line',
      mode: 'vertical',
      scaleID: 'days',
      value: this.dateToStr(this.lastDateTest),
      borderColor: 'red',
      borderWidth: 4,
      label: {
        enabled: true,
        fontColor: 'red',
        content: ''
      }
    });


    this.lineChartData[0].data.pop();

    console.log(this.lineChartOptions.annotation.annotations);

  }
  chartRender() {
    this.chartCanvas.chart.render({
      duration: 800,
      lazy: false,
      easing: 'easeOutBounce'
    });

  }
  chartUpdate() {
    this.chartCanvas.chart.update({
      duration: 800,
      easing: 'easeOutBounce'
    });
    console.log(this.chartCanvas.chart);
  }
  chartDataUpdate() {
    this.lineChartData = this.lineChartData.slice();

  }


  redrawChart() {
    if (this.chart) {

      this.chart?.update();
      this.chart?.render();
      this.lineChartData = this.lineChartData.slice();

      try {
        this.chart?.resetZoom();
      } catch (err) {
        console.error(err);
      }
    }


  }







  ngOnInit() {
    //console.log('this.compact = ', this.compact);
    this.loading$ = new BehaviorSubject<boolean>(null);

    this.lineChartOptions.tooltips.enabled = !this.compact;
    //this.lineChartOptions.scales.yAxes.forEach(y => y.ticks.display = !this.compact)
    this.lineChartOptions.scales.xAxes.forEach(x => x.ticks.display = !this.compact)
    this.lineChartLegend = !this.compact;




    this.todayAnnotation.value = this.dateToStr(new Date());
    this.lineChartOptions.annotation.annotations = [];
    this.lineChartOptions.annotation.annotations.push(this.todayAnnotation);
    console.log('this.todayAnnotation : ', this.todayAnnotation);


    this.loading$.next(true);

    combineLatest([//undefined if not refreshed ? why fuck
      this.config$,
      this.data$
    ]).subscribe(r => {
      if (r) {
        let config = r[0];
        let data = r[1];




        if (data && config) {
          this.displayChart = false;
        }

        if (data) {

          this.lineChartData[0].data = [];// fps
          this.lineChartData[1].data = [];//history
          this.lineChartData[2].data = [];//futur

          //highcharts:

          let high_fps = [];
          let high_history = [];
          let high_futur = [];
          let categories = [];

          this.categoriesMap.clear();
          /*
          series: [{
              data: [1, 2, 3],
              type: 'line'
            }]
            */

          let fps = []
          let history = []
          let futur = []

          this.lineChartLabels = [];

          let n = this.dateToStr(new Date());
          data.forEach(p => {
            let d = this.dateToStr(p.date);
            let m: Moment = moment(p.date);
            m.hours(0);

            let value: number = Number(p.value.toFixed(2));

            let point = {
              y: value,
              x: m
            };
            let emptyPoint = {
              y: null,
              x: m
            }

            if (d < n) {
              history.push(point);
              futur.push(emptyPoint);

              high_history.push(point.y);
              high_futur.push(null);

            } else if (d > n) {
              history.push(emptyPoint);
              futur.push(point);

              high_history.push(null);
              high_futur.push(point.y);
            } else {
              history.push(point);
              futur.push(point);

              high_history.push(point.y);
              high_futur.push(point.y);
            }

            if (p.fixedPoint) {
              fps.push({
                x: m, 
                y: p.fixedPoint.exact_value
              });
              high_fps.push(p.fixedPoint.exact_value);
            } else {
              fps.push(emptyPoint);
              high_fps.push(null);

            }

            


            this.lineChartLabels.push(m);
            categories.push(m.format('DD-MM-YYYY'));
            this.categoriesMap.set(m.format('DD-MM-YYYY'), m.toDate())
          });


          this.chartOptions.series[0] = {
            data : high_fps,
            type: 'line'
          };
          this.chartOptions.series[1] = {
            type: 'line',
            data: high_history,
          }
          this.chartOptions.series[2] = {
            type: 'line',
            data: high_futur,
          }
          this.chartOptions.xAxis = {
            categories : categories
          }



          this.lineChartData[0].data = fps
          this.lineChartData[1].data = history;
          this.lineChartData[2].data = futur;
        }

        if (config) {

          this.delayOnUpdate = config.delayOnUpdate;
          if (config.disableControls) {
            this.lineChartOptions.zoom.enabled = false;
            this.lineChartOptions.pan.enabled = false;
          }


          if (config.marks) {
            this.lineChartOptions.annotation.annotations = [];
            this.lineChartOptions.annotation.annotations.push(this.todayAnnotation);

            config.marks.forEach(m => {
              this.lineChartOptions.annotation.annotations.push({
                type: 'line',
                mode: 'vertical',
                scaleID: 'days',
                value: m,
                borderColor: 'red',
                borderWidth: 4,
                label: {
                  enabled: true,
                  fontColor: 'yellow',
                  content: ''
                }
              });
            });
          }



        }




        this.loading$.next(false);

        if (data && config) {
          if (this.delayOnUpdate) {
            setTimeout(() => {
              this.displayChart = true;
              this.updateFlag = true;
            }, 1000)
          } else {
            this.displayChart = true;
            this.updateFlag = true;
          }
        }
      }
    });




  }

  ngAfterViewInit() {
    this.chart = this.chartCanvas.chart;

  }

}
