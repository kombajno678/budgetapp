import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, BehaviorSubject } from 'rxjs';
import { CategoryDialogComponent } from 'src/app/components/dialogs/category-dialog/category-dialog.component';
import { Category } from 'src/app/models/Category';
import { CategoryService } from 'src/app/services/budget/category.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {

  categories$: BehaviorSubject<Category[]>;
  categories: Category[];

  constructor(
    private categoriesService: CategoryService,
    private dialog: MatDialog
  ) {
    this.categories$ = new BehaviorSubject<Category[]>(null);
    this.categories = null;
    this.categories$.next(this.categories);
  }

  ngOnInit(): void {

    this.categoriesService.getAll().subscribe(r => {
      if(r){
        this.categories = r;
        this.categories$.next(this.categories);

      }

    })
  }




  onNewClick() {
    let dialogRef = this.dialog.open(CategoryDialogComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        let newObj: Category = result;
        this.categoriesService.create(newObj).subscribe(r => {
          console.log('result od add category = ', r);
        })
      }
    })
  }


  deleteCategory(category: Category) {
    console.log('receiver delete event, ', category);
    this.categoriesService.delete(category).subscribe(r => {
      console.log('delete result = ', r);
    })
  }

  modifyCategory(event) {
    console.log('receiver modify event, ', event);
    this.categoriesService.update(event.new).subscribe(r => {
      console.log('result = ', r);
    })
  }

}
