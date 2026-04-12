import { Injectable, signal } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';
import { Tour, TourLog, TransportType } from './tour-state-service';

@Injectable({
  providedIn: 'root',
})
export class TourApiService {
  private tourIdCounter = 5;

  private readonly delay = 3000;

  private tourLogIdCounter = 1;

  private mockedTours: Tour[] = [
    {
      id: 1,
      creatorId: 1,
      tourName: 'Verlängertes Wochenende',
      from: 'Wien',
      to: 'Graz',
      transportType: TransportType.Car,
      totalDistance: 200,
      totalDuration: 2,
      description: 'Klassische Autofahrt durch die Steiermark.',
      logs: [],
    },
    {
      id: 2,
      creatorId: 1,
      tourName: 'Familientrip',
      from: 'Graz',
      to: 'Salzburg',
      transportType: TransportType.Train,
      totalDistance: 280,
      totalDuration: 3,
      description: 'Entspannte Zugfahrt mit Blick auf die Alpen.',
      logs: [],
    },
    {
      id: 3,
      creatorId: 1,
      tourName: 'Alpenüberquerung',
      from: 'Salzburg',
      to: 'Innsbruck',
      transportType: TransportType.Car,
      totalDistance: 150,
      totalDuration: 1.5,
      description: 'Kurze Fahrt durch das Salzachtal.',
      logs: [],
    },
    {
      id: 4,
      creatorId: 1,
      tourName: 'Wien Stadtspaziergang',
      from: 'Stephansdom',
      to: 'Prater',
      transportType: TransportType.Walk,
      totalDistance: 5,
      totalDuration: 1,
      description: 'Gemütlicher Spaziergang durch die Wiener Innenstadt.',
      logs: [],
    },
  ]

  addTour(tour: Omit<Tour, "id">): Observable<Tour> {
    const created: Tour = { ...tour, id: this.tourIdCounter++ };
    this.mockedTours.push(created)
    return of({ ...created });
  }

  getAll(): Observable<Tour[]> {
    const deepCopy = this.mockedTours.map((t) => {
      const logsCopy = [...(t.logs ?? [])];
      return { ...t, logs: logsCopy };
    });
    return of(deepCopy).pipe(delay(this.delay));
  }

  update(tour: Tour): Observable<Tour> {
    const idx = this.mockedTours.findIndex((t) => t.id === tour.id);
    if (idx < 0) {
      return throwError(() => new Error("tour not found"));
    }
    this.mockedTours[idx] = tour;

    return of({ ...tour }).pipe(delay(this.delay));
  }


  delete(tourId: number): Observable<void> {
    const idx = this.mockedTours.findIndex((t) => t.id === tourId);
    if (idx >= 0) {
      this.mockedTours.splice(idx, 1);
    }
    return of(undefined).pipe(delay(this.delay));
  }

  addTourLog(tourId: number, log: Omit<TourLog, "id">): Observable<TourLog> {
    const tour = this.mockedTours.find((t) => t.id === tourId);
    if (!tour) {
      return throwError(() => new Error("tour not found"));
    }
    const created: TourLog = { ...log, id: this.tourLogIdCounter++ }
    tour.logs = [...(tour.logs ?? []), created];
    return of({ ...created }).pipe(delay(this.delay));
  }

  updateTourLog(tourId: number, log: TourLog): Observable<TourLog> {
    const tour = this.mockedTours.find((t) => t.id === tourId);
    if (!tour) {
      return throwError(() => new Error("tour not found"));
    }
    const updatedLogs: TourLog[] = [];
    if (!tour.logs) {
      tour.logs = [];
    }
    for (const existingLog of tour.logs) {
      if (existingLog.id === log.id) {
        updatedLogs.push(log);
      } else {
        updatedLogs.push(existingLog);
      }
    }
    tour.logs = updatedLogs;

    return of({ ...log }).pipe(delay(this.delay));
  }

  deleteTourLog(tourId: number, logId: number): Observable<void> {
    const tour = this.mockedTours.find((t) => t.id === tourId);
    if (!tour) {
      return throwError(() => new Error("tour not found"));
    }
    if (!tour.logs) {
      tour.logs = [];
    }
    const idx = tour.logs.findIndex((l) => l.id === logId);
    if (idx >= 0) {
      tour.logs.splice(idx, 1);
    }
    return of(undefined).pipe(delay(this.delay));
  }



}
