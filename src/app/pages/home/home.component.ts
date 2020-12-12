import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { PredictionChartCardConfig } from 'src/app/components/dashboard-cards/prediction-chart-card/prediction-chart-card.component';





@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  config1: PredictionChartCardConfig;
  config2: PredictionChartCardConfig;


  constructor(public auth: AuthService) {


    this.config1 = {
      startDate: new Date(),
      endDate: new Date(),
      title: 'Next 3 months'
    }
    this.config1.endDate.setMonth(this.config1.endDate.getMonth() + 3);

    this.config2 = {
      startDate: new Date(),
      endDate: new Date(),
      title: 'Last month'
    }
    this.config2.startDate.setMonth(this.config1.endDate.getMonth() - 1);





  }


  ngOnInit(): void {
  }

  onSignInClick() {
    this.auth.loginWithPopup();
  }
}
