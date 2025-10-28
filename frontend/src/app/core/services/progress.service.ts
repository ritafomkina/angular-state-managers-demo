import { Injectable, Signal, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private readonly _isLoading = signal<boolean>(false);

  get isLoading(): Signal<boolean> {
    return this._isLoading.asReadonly();
  }

  start(): void {
    this._isLoading.set(true);
  }

  stop(): void {
    this._isLoading.set(false);
  }
}
