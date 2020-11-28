import { Component, OnInit } from '@angular/core';
import { ScheduledOperationsService } from 'src/app/services/budget/scheduled-operations.service';

@Component({
  selector: 'app-scheduled-operations-card',
  templateUrl: './scheduled-operations-card.component.html',
  styleUrls: ['./scheduled-operations-card.component.scss']
})
export class ScheduledOperationsCardComponent implements OnInit {
  operations = [];

  link = {
    title: 'Scheduled operations',
    url: '/scheduledoperations',
    icon: 'event',
    loginRequired: true,
  }
  constructor(private scheduledOperationsService: ScheduledOperationsService) {
    this.scheduledOperationsService.getAll()
      .subscribe(r => {
        if (r) {

          this.operations = r.slice(0, 5);
        }
      })
  }

  ngOnInit(): void {
  }

}
