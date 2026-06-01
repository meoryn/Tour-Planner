import { Injectable } from '@angular/core';
import type * as L from 'leaflet';
import { MapCoordinates } from '../tour-state-service';


@Injectable()
export class MapFacade {
  private center: MapCoordinates = { lat: 48.2082, lng: 16.3738 };
  private zoom = 14;

  private map?: L.Map;

  async init(element: HTMLElement): Promise<void> {
    const leaflet = await import('leaflet');

    this.map = leaflet.map(element).setView([this.center.lat, this.center.lng], this.zoom);

    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    this.map.invalidateSize();
  }

  destroy(): void {
    this.map?.remove();
  }
}
