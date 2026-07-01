import { Injectable, effect, inject } from '@angular/core';
import type * as L from 'leaflet';
import { RouteStateService } from '../route-state-service';
import { MapPickService } from '../map-pick-service';

@Injectable()
export class MapFacade {
  private center = { lat: 48.2082, lng: 16.3738 };
  private zoom = 14;

  private routeState = inject(RouteStateService);
  private pickService = inject(MapPickService);

  private leaflet?: typeof import('leaflet');
  private map?: L.Map;
  private routeLayer?: L.Polyline;

  constructor() {
    effect(() => this.drawRoute(this.routeState.coordinates()));
  }

  async init(element: HTMLElement): Promise<void> {
    const leaflet = await import('leaflet');
    this.leaflet = leaflet;

    this.map = leaflet.map(element).setView([this.center.lat, this.center.lng], this.zoom);

    leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);

    this.map.invalidateSize();

    this.drawRoute(this.routeState.coordinates());

    this.map.on("click", event => this.handlePick(event.latlng));
  }

  private handlePick(latlng: L.LatLng): void {
    if (!this.pickService.activeTarget()) return;

    this.pickService.pickedLocation.set({
      lat: latlng.lat,
      lng: latlng.lng,
      label: `${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`,
    });
  }

  private drawRoute(coordinates: number[][] | null): void {
    if (!this.map || !this.leaflet) return;

    this.routeLayer?.remove();
    this.routeLayer = undefined;

    if (!coordinates || coordinates.length === 0) return;

    const latLngs = coordinates.map(([lon, lat]) => [lat, lon] as L.LatLngTuple);

    this.routeLayer = this.leaflet
      .polyline(latLngs, { color: '#3b82f6', weight: 5 })
      .addTo(this.map);

    this.map.fitBounds(this.routeLayer.getBounds(), { padding: [30, 30] });
  }

  destroy(): void {
    this.map?.remove();
  }
}
