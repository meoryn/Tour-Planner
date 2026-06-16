import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Coordinates } from './models/coordinates';

export type BoundingBox = [number, number, number, number];

export interface GeocodeResponse {
  bbox: BoundingBox,
  features: Feature[],
  geocoding: unknown,
  type: string
}

export interface Geometry {
  type: string,
  coordinates: number[]
}

export function toCoordinates(geometry: Geometry): Coordinates {
  return { lng: geometry.coordinates[0], lat: geometry.coordinates[1] };
}

export interface Feature {
  name: string,
  geometry: Geometry,
  properties: Properties
}

export interface Properties {
  label: string
}

export interface Poi {
  coordinates: Coordinates,
  label: string
}

@Injectable({
  providedIn: 'root',
})
export class OpenRouteService {
  private url = "https://api.openrouteservice.org/"
  private apiKey = "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjJjODdlYTlmYjZmMDQ5ZWFiZTRmMzM3NzY0NTQ3MGE0IiwiaCI6Im11cm11cjY0In0="
  private http = inject(HttpClient);

  getGeocodes(address: string): Observable<Poi[]> {
    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('text', address);

    return this.http.get<GeocodeResponse>(this.url + "geocode/search", { params }).pipe(
      map(res => (res.features ?? [])
        .filter(feature => feature.geometry?.type === "Point")
        .map(feature => ({
          coordinates: toCoordinates(feature.geometry),
          label: feature.properties.label,
        }))),
      catchError(() => of([])),
    );
  }
}
