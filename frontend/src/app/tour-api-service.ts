import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Location } from './models/location';
import { Tour } from './models/tour';
import { TourLog } from './models/tour-log';
import { TourDifficulty } from './models/tour-difficulty';
import { TransportType } from './models/transport-type';

export interface Directions {
  totalDistance: number;
  totalDuration: number;
  coordinates: number[][];
}

interface ResponseTourLogDto {
  id: number;
  creationDate: string;
  comment: string;
  difficulty: TourDifficulty;
  totalDistance: number;
  totalTime: number;
  rating: number;
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

  public getTourLogs(tourId: number): Observable<TourLog[]> {
    return this.http
      .get<ResponseTourLogDto[]>(`${this.baseUrl}/tour-logs`, { params: { tourId } })
      .pipe(map((dtos) => dtos.map(this.fromTourLogDto)));
  }

  public createTourLog(
    tourId: number,
    log: Omit<TourLog, 'id' | 'creationDate'>,
  ): Observable<TourLog> {
    return this.http
      .post<ResponseTourLogDto>(`${this.baseUrl}/tour-logs`, this.toTourLogRequestBody(tourId, log))
      .pipe(map(this.fromTourLogDto));
  }

  public updateTourLog(
    tourLogId: number,
    tourId: number,
    log: Omit<TourLog, 'id' | 'creationDate'>,
  ): Observable<TourLog> {
    return this.http
      .put<ResponseTourLogDto>(
        `${this.baseUrl}/tour-logs/${tourLogId}`,
        this.toTourLogRequestBody(tourId, log),
      )
      .pipe(map(this.fromTourLogDto));
  }

  public deleteTourLog(tourLogId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/tour-logs/${tourLogId}`);
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

  private toTourLogRequestBody(tourId: number, log: Omit<TourLog, 'id' | 'creationDate'>) {
    return {
      tourId,
      comment: log.comment,
      difficulty: log.difficulty,
      totalDistance: log.totalDistance,
      totalTime: log.totalTime,
      rating: log.rating,
    };
  }

  private fromTourLogDto = (dto: ResponseTourLogDto): TourLog => ({
    id: dto.id,
    creationDate: new Date(dto.creationDate),
    comment: dto.comment,
    difficulty: dto.difficulty,
    totalDistance: dto.totalDistance,
    totalTime: dto.totalTime,
    rating: dto.rating,
  });
}
