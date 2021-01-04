import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Category } from 'src/app/models/Category';
import { CategoryDialogComponent } from '../../dialogs/category-dialog/category-dialog.component';
import { modifyEvent } from 'src/app/models/internal/modifyEvent';



@Component({
  selector: 'app-category-list-element',
  templateUrl: './category-list-element.component.html',
  styleUrls: ['./category-list-element.component.scss']
})
export class CategoryListElementComponent implements OnInit, OnDestroy {


  highlighted:boolean;
  
  @Input()
  cat: Category;

  @Input()
  public displayButton: boolean = true;
  @Input()
  public compact: boolean;

  @Output()
  onDelete: EventEmitter<Category> = new EventEmitter<Category>();

  @Output()
  onModify: EventEmitter<modifyEvent<Category>> = new EventEmitter<modifyEvent<Category>>();


  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }
  ngOnDestroy(): void {
    this.cat = null;
    this.onDelete = null;
    this.onModify = null;
  }

  modify() {

    let dialogRef = this.dialog.open(CategoryDialogComponent, { width: '500px', data: Category.getCopy(this.cat) });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        let x: modifyEvent<Category> = {
          old: this.cat,
          new: result
        }
        this.onModify.emit(x);

        this.cat = result;
        this.highlighted = true;
        setTimeout(()=> this.highlighted = false, 2000);


      }
    })

  }


}
