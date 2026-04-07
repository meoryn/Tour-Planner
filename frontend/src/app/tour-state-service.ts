import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { UserStateService } from './user-state-service';

export enum TransportType {
  Walk = 'walk',
  Car = 'car',
  Train = 'train'
}

export type MapCoordinates = {
    lat: number;
    lng: number;
}

export type TourLog = {
    id: number;
    creationDate: Date;
    description: string;
    rating: number;
}

export type Tour = {
    transportType: TransportType;
    totalDistance: number;
    totalDuration: number;
    from: MapCoordinates;
    to: MapCoordinates;
    tourName: string;
    description: string;
    logs? : TourLog[];
    creatorId: number;
    id?: number;
} 

@Injectable({
  providedIn: 'root',
})
export class TourStateService {

    private tourIdCounter = 1;

    private userStateService = inject(UserStateService);

    private readonly _tours = signal<Tour[]>([]);
    
    public tours = this._tours.asReadonly();

    public addTour(tour: Tour) {
        tour.id = this.tourIdCounter++;
        this._tours.set([...this._tours(), tour]);
    }
    
    public removeTour(tourName: string) {
        this._tours.set(this._tours().filter(t => t.tourName !== tourName));
    }

    public editTour(updatedTour: Tour) {
        this._tours.set(this._tours().map(t => t.id === updatedTour.id ? updatedTour : t));
    }

    readonly userTours = computed(() => {
        const currentUser = this.userStateService.currentUser();
        if (!currentUser) {
            return [];
        }
        return this._tours().filter(t => t.creatorId === currentUser.id);
    });

    getTourById(id: number): Tour | undefined {
        return this._tours().find(t => t.id === id);
    }
}
