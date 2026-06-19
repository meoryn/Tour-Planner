import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, map, catchError, of } from 'rxjs';
import { Location } from './models/location';
import { SKIP_AUTH } from './auth-interceptor';

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

export interface Feature {
  name: string,
  geometry: Geometry,
  properties: Properties
}

export interface Properties {
  label: string
}

export type Poi = Location;

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

    return this.http.get<GeocodeResponse>(this.url + "geocode/search", {
      params,
      context: new HttpContext().set(SKIP_AUTH, true),
    }).pipe(
      map(res => (res.features ?? [])
        .filter(feature => feature.geometry?.type === "Point")
        .map(feature => ({
          lng: feature.geometry.coordinates[0],
          lat: feature.geometry.coordinates[1],
          label: feature.properties.label,
        }))),
      catchError(() => of([])),
    );
  }
}
