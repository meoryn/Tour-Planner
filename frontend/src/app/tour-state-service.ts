import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { UserStateService } from './user-state-service';

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
  rating: number;
};

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
  private tourIdCounter = 5;
  private logIdCounter = 1;

  private userStateService = inject(UserStateService);

  private readonly _tours = signal<Tour[]>([
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
  ]);

  public tours = this._tours.asReadonly();

  public searchQuery = signal('');

  public filteredTours = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this._tours();
    return this._tours().filter(
      (t) =>
        t.tourName.toLowerCase().includes(query) || t.description.toLowerCase().includes(query),
    );
  });

  public addTour(tour: Tour) {
    tour.id = this.tourIdCounter++;
    this._tours.set([...this._tours(), tour]);
  }

  public removeTour(tourName: string) {
    this._tours.set(this._tours().filter((t) => t.tourName !== tourName));
  }

  public editTour(updatedTour: Tour) {
    this._tours.set(this._tours().map((t) => (t.id === updatedTour.id ? updatedTour : t)));
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
    const newLog: TourLog = { ...log, id: this.logIdCounter++ };
    this._tours.set(
      this._tours().map((t) =>
        t.id === tourId ? { ...t, logs: [...(t.logs ?? []), newLog] } : t,
      ),
    );
  }

  public editTourLog(log: TourLog) {
    const tourId = this.selectedTourId();
    if (tourId === null) return;
    this._tours.set(
      this._tours().map((t) =>
        t.id === tourId
          ? { ...t, logs: (t.logs ?? []).map((l) => (l.id === log.id ? log : l)) }
          : t,
      ),
    );
  }

  public removeTourLog(logId: number) {
    const tourId = this.selectedTourId();
    if (tourId === null) return;
    this._tours.set(
      this._tours().map((t) =>
        t.id === tourId ? { ...t, logs: (t.logs ?? []).filter((l) => l.id !== logId) } : t,
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
