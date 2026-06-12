import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Geometry } from './open-route-service';
import { TransportType } from './tour-state-service';

export interface Directions {
  totalDistance: number;
  totalDuration: number; 
  coordinates: number[][]; 
}

@Injectable({
  providedIn: 'root',
})
export class TourApiService {
  private baseUrl = 'http://localhost:8080/api';
  private http = inject(HttpClient);

  public getDirections(
    from: Geometry,
    to: Geometry,
    transportType: TransportType,
  ): Observable<Directions> {
    return this.http.post<Directions>(`${this.baseUrl}/directions`, {
      from: from.coordinates,
      to: to.coordinates,
      transportType,
    });
  }
}
