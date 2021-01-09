import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ScheduledBudgetOperation } from 'src/app/models/ScheduledBudgetOperation';

@Component({
  templateUrl: './upload-help-dialog.component.html',
  styleUrls: ['./upload-help-dialog.component.scss']
})
export class UploadHelpDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<UploadHelpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ScheduledBudgetOperation,

  ) { }

  ngOnInit(): void {
  }

}
