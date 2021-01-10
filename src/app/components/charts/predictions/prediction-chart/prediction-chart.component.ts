import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { PredictionPoint } from 'src/app/models/internal/PredictionPoint';
import { PredictionChartCardConfig } from 'src/app/components/dashboard-cards/prediction-chart-card/prediction-chart-card.component';
import moment, { Moment } from 'moment';
import * as Highcharts from 'highcharts';

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


  loading$: BehaviorSubject<boolean>;

  @Output()
  onDayClicked: EventEmitter<Date>;


  displayYear: boolean = true;
  DisplayMonth: boolean = true;





  chartCompactHeight: boolean = false;




  Highcharts: typeof Highcharts = Highcharts; // required
  isHighcharts = typeof Highcharts === 'object';
  chartConstructor: string = 'chart'; // optional string, defaults to 'chart'
  chartOptions: Highcharts.Options = {
    legend:{
      enabled:false
    },
    
    series: [
      {
      data: [],
      type: 'line',
      name: 'fixed points',
      events:{
        click: this.highchartSeriesClicked
      },
      
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










  constructor() {
    this.onDayClicked = new EventEmitter<Date>();
  }

  dateToStr(date: Date, y: boolean = this.displayYear, m: boolean = this.DisplayMonth, d: boolean = true) {
    let s = date.toISOString();
    return `${y ? s.substr(0, 4) : ''}${m ? (y ? '-' : '') + s.substr(5, 2) : ''}${d ? (m ? '-' : '') + s.substr(8, 2) : ''}`;

  }

  

  ngOnInit() {
    //console.log('this.compact = ', this.compact);
    this.loading$ = new BehaviorSubject<boolean>(null);

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


          //highcharts:

          let high_fps = [];
          let high_history = [];
          let high_futur = [];
          let categories = [];
          this.categoriesMap.clear();
          
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

              high_history.push(point.y);
              high_futur.push(null);

            } else if (d > n) {

              high_history.push(null);
              high_futur.push(point.y);
            } else {

              high_history.push(point.y);
              high_futur.push(point.y);
            }

            if (p.fixedPoint) {
              
              high_fps.push(p.fixedPoint.exact_value);
            } else {
              high_fps.push(null);

            }

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


        }

        if (config) {

          this.delayOnUpdate = config.delayOnUpdate;
          if (config.disableControls) {
            
          }


          if (config.marks) {
            
          }
          this.chartCompactHeight = config.compact;



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
    

  }

}
