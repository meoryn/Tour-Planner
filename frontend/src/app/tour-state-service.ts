import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { UserStateService } from './user-state-service';
import { NumberSymbol } from '@angular/common';
import { TourApiService } from './tour-api-service';

export enum TransportType {
  Walk = 'walk',
  Car = 'car',
  Train = 'train',
}

//Used later when we add leaflet maps
export type MapCoordinates = {
  lat: number;
  lng: number;
};

export type TourLog = {
  id: number;
  creationDate: Date;
  description: string;
  difficulty: TourDifficulty;
  totalDistance: number;
  totalTime: number;
  rating: number;
};

export enum TourDifficulty {
  Hard,
  Medium,
  Easy
}

export type Tour = {
  transportType: TransportType;
  totalDistance: number;
  totalDuration: number;
  from: string;
  to: string;
  tourName: string;
  description: string;
  logs?: TourLog[];
  creatorId: number;
  id?: number;
};

@Injectable({
  providedIn: 'root',
})
export class TourStateService {
  private userStateService = inject(UserStateService);
  private apiService = inject(TourApiService);
  private logIdCounter = 0
  private readonly _tours = signal<Tour[]>([]);
  public tours = this._tours.asReadonly();

  public searchQuery = signal('');


  constructor() {
    this.loadTours();
  }



  public filteredTours = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this._tours();
    return this._tours().filter(
      (t) =>
        t.tourName.toLowerCase().includes(query) || t.description.toLowerCase().includes(query),
    );
  });



  public addTour(tour: Omit<Tour, "id">) {
    this.apiService.addTour(tour).subscribe({
      next: (created) => {
        this._tours.set([...this._tours(), created])
      },
      error: (error) => {
        console.log("Error:" + error)
      }
    })
  }

  public loadTours() {
    this.apiService.getAll().subscribe({
      next: (tours) => this._tours.set(tours),
      error: (err) => console.error(err),
    });
  }

  //delete it from cached tourList, if the backend fails to delete -> rollback
  public removeTour(tourId: number) {
    const previousTours = this._tours();
    this._tours.set(previousTours.filter((t) => t.id !== tourId));

    this.apiService.delete(tourId).subscribe({
      error: (err) => {
        console.error(err);
        this._tours.set(previousTours);
      },
    });
  }

  public editTour(updatedTour: Tour) {
    const previousTours = this._tours();

    this._tours.set(this._tours().map((t) => (t.id === updatedTour.id ? updatedTour : t)));

    this.apiService.update(updatedTour).subscribe({
      error: (err) => {
        console.error(err);
        this._tours.set(previousTours);
      },
    });
  }

  readonly userTours = computed(() => {
    const currentUser = this.userStateService.currentUser();
    if (!currentUser) {
      return [];
    }
    return this._tours().filter((t) => t.creatorId === currentUser.id);
  });

  getTourById(id: number): Tour | undefined {
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

  public addTourLog(log: Omit<TourLog, 'id'>) {
    const tourId = this.selectedTourId();
    if (tourId === null) return;

    const tempLog: TourLog = { ...log, id: this.logIdCounter++ };
    const previousTours = this._tours();

    this._tours.set(
      this._tours().map((t) => {
        if (t.id !== tourId) return t;
        const updatedLogs = [...(t.logs ?? []), tempLog];
        return { ...t, logs: updatedLogs };
      })
    );

    this.apiService.addTourLog(tourId, log).subscribe({
      next: (created) => { //sets id in _tours, if backend has answered
        const currentTours = this._tours();

        const updatedTours = currentTours.map((tour) => {
          if (tour.id !== tourId) return tour;

          const updatedLogs = (tour.logs ?? []).map((log) => {
            const isTempLog = log.id === tempLog.id;
            if (isTempLog) return created;
            return log;
          });

          return { ...tour, logs: updatedLogs };
        });

        this._tours.set(updatedTours);
      },

      error: (err) => {
        console.error(err);
        this._tours.set(previousTours);
      },
    });
  }

  editTourLog(log: TourLog) {
    const tourId = this.selectedTourId();
    if (tourId === null) return;

    const previousTours = this._tours();

    const updatedTours = this._tours().map((tour) => {
      if (tour.id !== tourId) {
        return tour;
      }
      const existingLogs = tour.logs ?? [];
      const updatedLogs = existingLogs.map((existingLog) => {
        const isEditedLog = existingLog.id === log.id;
        return isEditedLog ? log : existingLog;
      });

      return { ...tour, logs: updatedLogs };
    });
    this._tours.set(updatedTours);

    this.apiService.updateTourLog(tourId, log).subscribe({
      error: (err) => {
        console.error(err);
        this._tours.set(previousTours);
      },
    });
  }

  public removeTourLog(logId: number) {
    const tourId = this.selectedTourId();
    if (tourId === null) return;
    const previousTours = this._tours();

    const updatedTours = this._tours().map((tour) => {
      const isSelectedTour = tour.id === tourId;
      if (!isSelectedTour) {
        return tour;
      }

      const existingLogs = tour.logs ?? [];
      const filteredLogs = existingLogs.filter((log) => log.id !== logId);

      return { ...tour, logs: filteredLogs };
    });
    this._tours.set(updatedTours);

    this.apiService.deleteTourLog(tourId, logId).subscribe({
      error: (err) => {
        console.error(err);
        this._tours.set(previousTours);
      },
    });
  }

  public setSearchQuery(query: string) {
    this.searchQuery.set(query);
  }

  public exportAllTours() {
    this.exportTours(this.filteredTours(), 'tours.json');
  }

  public exportSingleTour(tour: Tour) {
    this.exportTours([tour], tour.tourName + '.json');
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
