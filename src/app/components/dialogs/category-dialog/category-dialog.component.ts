import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from 'src/app/models/Category';

@Component({
  selector: 'app-category-dialog',
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.scss']
})
export class CategoryDialogComponent implements OnInit {

  form: FormGroup;

  category: Category;

  createTitle: string = 'New category';
  updateTitle: string = 'Modify category';
  createButtonText: string = 'Add';
  updateButtonText: string = 'Save';
  acceptButtonTest: string = null;
  title: string = null;

  colorRegExp: string;
  iconRegExp: string;

  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category
  ) {
    this.colorRegExp = '^[#]{1}[0-9a-fA-F]{3,8}$';
    this.iconRegExp = '^[-a-zA-Z]+$';
    if (data) {
      this.category = data;
      this.acceptButtonTest = this.updateButtonText;
      this.title = this.updateTitle;
    } else {
      this.category = new Category();
      this.category.name = null;
      this.category.color = null;
      this.category.icon = null;

      this.acceptButtonTest = this.createButtonText;
      this.title = this.createTitle;
    }
    this.form = new FormGroup({
      name: new FormControl(this.category.name, [Validators.required, Validators.maxLength(40)]),
      color: new FormControl(this.category.color, [Validators.maxLength(9), Validators.pattern(this.colorRegExp)]),
      icon: new FormControl(this.category.icon ? this.category.icon : 'category', [Validators.maxLength(20), Validators.pattern(this.iconRegExp)]),
    })
  }

  ngOnInit(): void {
  }

  test() {
    console.log(this.form)
  }

  onSave() {
    console.log('dialog on save');

    if (this.form.valid) {
      this.category.name = this.form.controls.name.value;
      this.category.icon = this.form.controls.icon.value;
      this.category.color = this.form.controls.color.value;

      this.dialogRef.close(this.category);
    } else {
      console.error('form invalid');
    }
  }
}
