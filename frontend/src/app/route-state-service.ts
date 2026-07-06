import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class RouteStateService {
  readonly coordinates = signal<number[][] | null>(null);

  setRoute(coordinates: number[][]) {
    this.coordinates.set(coordinates);
  }

  clear() {
    this.coordinates.set(null);
  }
}
