import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { Location } from './models/location';

export type Poi = Location;

@Injectable({
  providedIn: 'root',
})
export class OpenRouteService {
  private baseUrl = 'http://localhost:8080';
  private http = inject(HttpClient);

  getGeocodes(address: string): Observable<Poi[]> {
    const params = new HttpParams().set('text', address);

    return this.http.get<Poi[]>(`${this.baseUrl}/geocode`, { params }).pipe(
      catchError(() => of([])),
    );
  }
}
