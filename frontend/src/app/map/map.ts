import { Component, ElementRef, OnDestroy, afterNextRender, inject, viewChild } from '@angular/core';
import { MapFacade } from './map-facade';

@Component({
  selector: 'app-map',
  templateUrl: './map.html',
  styleUrl: './map.css',
  providers: [MapFacade],
  standalone: true,
})
export class MapComponent implements OnDestroy {
  private mapFacade = inject(MapFacade);
  private mapContainer = viewChild.required<ElementRef<HTMLElement>>('mapContainer');

  constructor() {
    afterNextRender(() => this.mapFacade.init(this.mapContainer().nativeElement));
  }

  ngOnDestroy(): void {
    this.mapFacade.destroy();
  }
}
