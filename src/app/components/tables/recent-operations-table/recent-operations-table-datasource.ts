import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { finalize, map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject } from 'rxjs';
import { BudgetOperation } from 'src/app/models/BudgetOperation';
import { BudgetService } from 'src/app/services/budget/budget.service';

//BudgetOperation

/**
 * Data source for the RecentOperationsTable view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class RecentOperationsTableDataSource extends DataSource<BudgetOperation> {
  //data: BudgetOperation[];// = EXAMPLE_DATA;
  paginator: MatPaginator;
  sort: MatSort;

  operationsSubject = new BehaviorSubject<BudgetOperation[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();


  loadOperations() {
    this.loadingSubject.next(true);
    this.budgetService.getOperations().pipe(
      finalize(() => this.loadingSubject.next(false))
    )
      .subscribe(_operations => {
        let sorted = _operations.sort((a, b) => b.when.getTime() - a.when.getTime());
        this.operationsSubject.next(sorted);
      });
  }



  constructor(private budgetService: BudgetService) {
    super();

  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  /*
  connect( collectionViewer:CollectionViewer): Observable<Book[]> {
    return this.booksSubject.asObservable();
  }*/

  connect(collectionViewer: CollectionViewer): Observable<BudgetOperation[]> {
    // Combine everything that affects the rendered data into one update
    // stream for the data-table to consume.
    const dataMutations = [
      this.operationsSubject,
      //observableOf(this.data),
      this.paginator.page,
      this.sort.sortChange
    ];

    return merge(...dataMutations).pipe(map(() => {
      return this.getPagedData(this.getSortedData([...this.operationsSubject.value]));
    }));
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect() { }

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: BudgetOperation[]) {
    const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
    return data.splice(startIndex, this.paginator.pageSize);
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: BudgetOperation[]) {
    if (!this.sort.active || this.sort.direction === '') {
      return data;
    }

    return data.sort((a, b) => {
      const isAsc = this.sort.direction === 'asc';
      switch (this.sort.active) {
        case 'name': return compare(a.name, b.name, isAsc);
        case 'id': return compare(+a.id, +b.id, isAsc);
        default: return 0;
      }
    });
  }
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
