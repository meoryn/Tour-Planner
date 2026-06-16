import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Coordinates } from './models/coordinates';
import { TransportType } from './models/transport-type';

export interface Directions {
  totalDistance: number;
  totalDuration: number;
  coordinates: number[][];
}

@Injectable({
  providedIn: 'root',
})
export class TourApiService {
  private baseUrl = 'http://localhost:8080';
  private http = inject(HttpClient);

  public getDirections(
    from: Coordinates,
    to: Coordinates,
    transportType: TransportType,
  ): Observable<Directions> {
    return this.http.post<Directions>(`${this.baseUrl}/directions`, {
      from,
      to,
      transportType,
    });
  }
}
