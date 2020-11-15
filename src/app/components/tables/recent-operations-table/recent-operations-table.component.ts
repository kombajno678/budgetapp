import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable } from '@angular/material/table';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { BudgetService } from 'src/app/services/budget/budget.service';
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
  displayedColumns = ['name', 'value', 'when'];

  constructor(private budget: BudgetService) { }

  ngOnInit() {
    //console.log('RecentOperationsTableComponent ngOnInit');
    this.dataSource = new RecentOperationsTableDataSource(this.budget);

  }

  ngAfterViewInit() {
    //console.log('RecentOperationsTableComponent ngAfterViewInit');

    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;

    this.dataSource.loadOperations();

  }
}
