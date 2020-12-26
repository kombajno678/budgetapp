import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { BehaviorSubject } from 'rxjs';
import { PredictionChartCardConfig } from 'src/app/components/dashboard-cards/prediction-chart-card/prediction-chart-card.component';





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  config1: BehaviorSubject<PredictionChartCardConfig> = new BehaviorSubject<PredictionChartCardConfig>(null);
  config2: BehaviorSubject<PredictionChartCardConfig> = new BehaviorSubject<PredictionChartCardConfig>(null);


  constructor(public auth: AuthService) {

    let endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 3);

    this.config1.next({
      startDate: new Date(),
      endDate: new Date(endDate),
      title: 'Next 3 months'
    })

    let startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    this.config2.next({
      startDate: new Date(startDate),
      endDate: new Date(),
      title: 'Last month'
    })




    


  }


  ngOnInit(): void {
  }

  onSignInClick() {
    this.auth.loginWithPopup();
  }
}
