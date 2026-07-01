import { Injectable, signal } from '@angular/core';
import { Location } from './models/location';

@Injectable({
  providedIn: 'root',
})
export class MapPickService {
  readonly activeTarget = signal<'from' | 'to' | null>(null);
  readonly pickedLocation = signal<Location | null>(null);

  toggle(target: 'from' | 'to') {
    if (this.activeTarget() === target) {
      this.activeTarget.set(null);
    } else {
      this.activeTarget.set(target);
    }
  }

  reset() {
    this.activeTarget.set(null);
    this.pickedLocation.set(null);
  }
}
