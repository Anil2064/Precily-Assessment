import { Injectable, Output, EventEmitter } from '@angular/core';
import { MatSnackBar } from '@angular/material';
// import { EventEmitter } from 'protractor';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  @Output() showSpinner$: EventEmitter<boolean> = new EventEmitter<boolean>();

  dateFilterCode = 'ncJN_bk54ds3213CBK25';

  constructor(private snackBar: MatSnackBar) { }

  /**
   * To show the Snackbar
   * @param message Parameter for what to be printed on SnackBar
   * @param type Message Type - Success or Error
   */
  openSnackBar(message: string, type?: 'error'|'success'){
    let typeClassName = (type == 'error' ? 'snack-error' : 'snack-success');
    this.snackBar.open(message, '', {
      duration: 2000,
      verticalPosition: 'bottom',
      horizontalPosition: 'right',
      panelClass: [typeClassName]
    })
  }

  /**
   * To Show Spinner
   */
  showSpinner(){
    this.showSpinner$.emit(true);
  }

  /**
   * To Hide Spinner
   */
  hideSpinner(){
    this.showSpinner$.emit(false);
  }
}
