import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  snackbar = inject(MatSnackBar);

  error(msg: string, duration = 5000) {
    this.snackbar.open(msg, 'ERROR', { duration });
  }
  success(msg: string, duration = 5000) {
    this.snackbar.open(msg, 'SUCCESS', { duration });
  }
}
