import { Injectable, computed, inject, signal } from '@angular/core';
import { EMPTY, Observable, tap } from 'rxjs';
import { Tour, SavedTour } from './models/tour';
import { TourLog } from './models/tour-log';
import { TourApiService } from './tour-api-service';

@Injectable({
  providedIn: 'root',
})
export class TourStateService {
  private tourApi = inject(TourApiService);

  private readonly _tours = signal<SavedTour[]>([]);

  public tours = this._tours.asReadonly();

  public searchQuery = signal('');

  public filteredTours = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this._tours();
    return this._tours().filter(
      (t) =>
        t.title.toLowerCase().includes(query) || t.description.toLowerCase().includes(query),
    );
  });

  public loadTours(): Observable<Tour[]> {
    return this.tourApi.getAll().pipe(
      tap((tours) => this._tours.set(tours as SavedTour[])),
    );
  }

  public addTour(tour: Tour): Observable<Tour> {
    return this.tourApi.create(tour).pipe(
      tap((saved) => this._tours.set([...this._tours(), saved as SavedTour])),
    );
  }

  public editTour(updatedTour: SavedTour): Observable<Tour> {
    return this.tourApi.update(updatedTour.id, updatedTour).pipe(
      tap((saved) =>
        this._tours.set(
          this._tours().map((t) => (t.id === updatedTour.id ? (saved as SavedTour) : t)),
        ),
      ),
    );
  }

  public removeTourById(id: number): Observable<void> {
    return this.tourApi.delete(id).pipe(
      tap(() => this._tours.set(this._tours().filter((t) => t.id !== id))),
    );
  }

  getTourById(id: number): SavedTour | undefined {
    return this._tours().find((t) => t.id === id);
  }

  public selectedTourId = signal<number | null>(null);

  public selectedTour = computed(() => {
    const id = this.selectedTourId();
    if (id === null) return undefined;
    return this._tours().find((t) => t.id === id);
  });

  public selectedTourLogs = computed(() => this.selectedTour()?.logs ?? []);

  public selectTour(id: number) {
    this.selectedTourId.set(id);
  }

  public clearSelection() {
    this.selectedTourId.set(null);
  }

  public loadTourLogs(tourId: number): Observable<TourLog[]> {
    return this.tourApi.getTourLogs(tourId).pipe(
      tap((logs) =>
        this._tours.set(
          this._tours().map((t) => (t.id === tourId ? { ...t, logs } : t)),
        ),
      ),
    );
  }

  public addTourLog(log: Omit<TourLog, 'id' | 'creationDate'>): Observable<TourLog> {
    const tourId = this.selectedTourId();
    if (tourId === null) return EMPTY;
    return this.tourApi.createTourLog(tourId, log).pipe(
      tap((saved) =>
        this._tours.set(
          this._tours().map((t) =>
            t.id === tourId ? { ...t, logs: [...(t.logs ?? []), saved] } : t,
          ),
        ),
      ),
    );
  }

  public editTourLog(
    logId: number,
    log: Omit<TourLog, 'id' | 'creationDate'>,
  ): Observable<TourLog> {
    const tourId = this.selectedTourId();
    if (tourId === null) return EMPTY;
    return this.tourApi.updateTourLog(logId, tourId, log).pipe(
      tap((saved) =>
        this._tours.set(
          this._tours().map((t) =>
            t.id === tourId
              ? { ...t, logs: (t.logs ?? []).map((l) => (l.id === saved.id ? saved : l)) }
              : t,
          ),
        ),
      ),
    );
  }

  public removeTourLog(logId: number): Observable<void> {
    const tourId = this.selectedTourId();
    if (tourId === null) return EMPTY;
    return this.tourApi.deleteTourLog(logId).pipe(
      tap(() =>
        this._tours.set(
          this._tours().map((t) =>
            t.id === tourId ? { ...t, logs: (t.logs ?? []).filter((l) => l.id !== logId) } : t,
          ),
        ),
      ),
    );
  }

  public setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  public exportAllTours() {
    this.exportTours(this.filteredTours(), 'tours.json');
  }

  public exportSingleTour(tour: Tour) {
    this.exportTours([tour], tour.title + '.json');
  }

  private exportTours(tours: Tour[], filename: string) {
    const json = JSON.stringify(tours);
    const blob = new Blob([json]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
}
