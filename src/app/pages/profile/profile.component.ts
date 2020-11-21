import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileJson: string = null;



  weekdays = [
    { name: 'Monday' },
    { name: 'Tuesday' },
    { name: 'Wednesday' },
    { name: 'Thursday' },
    { name: 'Friday' },
    { name: 'Saturday' },
    { name: 'Sunday' },
  ];
  displayWeekday(subject) {
    return subject ? subject.name : undefined;
  }

  randomNumber;
  sidenavOpened: boolean = true;

  exampleForm: FormGroup;

  exampleformControl: FormControl;
  filteredOptions: Observable<any>;


  constructor(public auth: AuthService, public snack: MatSnackBar) {



    this.randomNumber = new Date().getUTCSeconds();

    this.exampleformControl = new FormControl();

    this.filteredOptions = this.exampleformControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))

    )



  }

  ngOnInit() {
    this.auth.user$.subscribe(
      (profile) => {
        this.profileJson = JSON.stringify(profile, null, 2);
        console.log({ profile });
      }
    );
  }



  openCustomSnack() {
    this.snack.openFromComponent(CustomSnackbarComponent, { duration: 2000 })
  }

  openSnack(msg: string, action?: string) {



    let snackRef = this.snack.open(msg, action ? action : null, { duration: 2000 });


    snackRef.afterDismissed().subscribe(r => {
      console.log('snackbar dismissed', r);
    })

    snackRef.onAction().subscribe(r => {
      console.log('snackbar action triggered', r);
    })
  }

  private _filter(value: string): any[] {
    const filtervalue = value.toLowerCase();

    return this.weekdays.filter(w => w.name.toLowerCase().includes(filtervalue));
  }

  log(state) {
    console.log('log : ', state);
  }

  getNow() {
    return new Date().toISOString();
  }

}



@Component({
  selector: 'custom-snackbar',
  template: `<span style='color:green'> Home </span>`,
})
export class CustomSnackbarComponent {

}