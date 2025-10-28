import { inject, Injectable } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
  SimpleSnackBar,
} from '@angular/material/snack-bar';

type Snackbar = 'info' | 'success' | 'warning' | 'error';

@Injectable({ providedIn: 'root' })
export class SnackbarService {
  private readonly _snackbar: MatSnackBar = inject(MatSnackBar);
  private readonly _config: MatSnackBarConfig = new MatSnackBarConfig();

  constructor() {
    this._config.duration = 2000;
    this._config.horizontalPosition = 'end';
    this._config.verticalPosition = 'top';
  }

  open(message: string, type: Snackbar = 'info', duration = 2000): MatSnackBarRef<SimpleSnackBar> {
    this._config.duration = duration;
    this._config.panelClass = [`snackbar-${type}`, 'snackbar'];

    return this._snackbar.open(message, undefined, this._config);
  }
}
