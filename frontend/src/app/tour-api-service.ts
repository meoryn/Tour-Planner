import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Location } from './models/location';
import { Tour } from './models/tour';
import { TransportType } from './models/transport-type';
import { SKIP_AUTH } from './auth-interceptor';

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
    from: Location,
    to: Location,
    transportType: TransportType,
  ): Observable<Directions> {
    return this.http.post<Directions>(
      `${this.baseUrl}/directions`,
      { from, to, transportType },
      { context: new HttpContext().set(SKIP_AUTH, true) },
    );
  }

  public getAll(): Observable<Tour[]> {
    return this.http.get<Tour[]>(`${this.baseUrl}/tours`);
  }

  public create(tour: Tour): Observable<Tour> {
    return this.http.post<Tour>(`${this.baseUrl}/tours`, this.toRequestBody(tour));
  }

  public update(id: number, tour: Tour): Observable<Tour> {
    return this.http.put<Tour>(`${this.baseUrl}/tours/${id}`, this.toRequestBody(tour));
  }

  public delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tours/${id}`);
  }

  private toRequestBody(tour: Tour) {
    return {
      title: tour.title,
      description: tour.description,
      from: tour.from,
      to: tour.to,
      transportType: tour.transportType,
      totalDistance: tour.totalDistance,
      totalDuration: tour.totalDuration,
    };
  }
}
