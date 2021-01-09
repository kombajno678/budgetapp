import { AfterViewInit, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { BudgetOperationService } from 'src/app/services/budget/budget-operation.service';
import { RecentOperationsTableDataSource } from './recent-operations-table-datasource';

@Component({
  selector: 'app-recent-operations-table',
  templateUrl: './recent-operations-table.component.html',
  styleUrls: ['./recent-operations-table.component.scss']
})
export class RecentOperationsTableComponent implements AfterViewInit, OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<BudgetOperation>;
  dataSource: RecentOperationsTableDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['name', 'value', 'when', 'action'];

  @Output()
  deleteEvent: EventEmitter<BudgetOperation>;

  @Output()
  modifyEvent: EventEmitter<BudgetOperation>;

  @Output()
  createEvent: EventEmitter<void>;


  constructor(private opeartionService: BudgetOperationService) {
    this.deleteEvent = new EventEmitter<BudgetOperation>();
    this.modifyEvent = new EventEmitter<BudgetOperation>();
    this.createEvent = new EventEmitter<void>();
  }

  ngOnInit() {
    //console.log('RecentOperationsTableComponent ngOnInit');
    this.dataSource = new RecentOperationsTableDataSource(this.opeartionService);

  }

  ngAfterViewInit() {
    //console.log('RecentOperationsTableComponent ngAfterViewInit');

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;

    this.dataSource.loadOperations();

  }


  onDeleteClick(operation: BudgetOperation) {
    this.deleteEvent.emit(operation);
  }

  onModifyClick(operation: BudgetOperation) {
    console.log('emiting modify event, ', operation)
    this.modifyEvent.emit(operation);
  }

  onCrateClick() {
    this.createEvent.emit();
  }



  displayDate(row: BudgetOperation) {
    if (row) {
      let d = new Date(row.when);
      return `${d.getFullYear()}-${d.getMonth() < 10 ? '0' + d.getMonth() : d.getMonth()}-${d.getDate() < 10 ? '0' + d.getDate() : d.getDate()}`;
    } else {
      return '?';
    }
  }
}
