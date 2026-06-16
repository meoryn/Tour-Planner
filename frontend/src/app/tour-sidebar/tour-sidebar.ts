import { Component, input, linkedSignal, inject, signal, effect, DestroyRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { TourStateService } from '../tour-state-service';
import { Tour } from '../models/tour';
import { TransportType } from '../models/transport-type';
import { Coordinates } from '../models/coordinates';
import { Location } from '../models/location';
import { Router } from '@angular/router';
import { getValidationErrors } from '../shared/validation-utils';
import { OpenRouteService, Poi } from '../open-route-service';
import { TourApiService } from '../tour-api-service';
import { RouteStateService } from '../route-state-service';

import * as v from 'valibot';

const TourSchema = v.object({
  tourName: v.pipe(v.string(), v.minLength(1, 'Tour name is required.')),
  description: v.optional(v.string()),
});

@Component({
  selector: 'app-tour-sidebar',
  templateUrl: './tour-sidebar.html',
  imports: [FormsModule, SelectButton, InputText, Textarea, ButtonModule, AutoCompleteModule, DecimalPipe],
  standalone: true,
})
export class TourSidebarComponent {
  private tourStateService = inject(TourStateService);
  private router = inject(Router);
  private openRouteService = inject(OpenRouteService);
  private tourApiService = inject(TourApiService);
  private routeStateService = inject(RouteStateService);
  private destroyRef = inject(DestroyRef);

  constructor() {
    this.routeStateService.clear();
    effect(() => {
      const from = this.selectedFrom()?.coordinates;
      const to = this.selectedTo()?.coordinates;
      const transportType = this.selectedTransport();
      if (from && to && transportType) {
        this.fetchRoute(from, to, transportType);
      }
    })
  }

  transportTypes = [
    { label: 'Walk', value: TransportType.Walk },
    { label: 'Car', value: TransportType.Car },
    { label: 'Cycle', value: TransportType.Cycle },
  ];

  mode = input<'Add' | 'Edit'>('Add');
  currentTour = input<Tour | null>(null);

  selectedTransport = linkedSignal<TransportType>(() => this.currentTour()?.transportType ?? TransportType.Car);

  tourName = linkedSignal<string>(() => this.currentTour()?.tourName ?? '');
  description = linkedSignal<string>(() => this.currentTour()?.description ?? '');

  distance = linkedSignal<number>(() => this.currentTour()?.totalDistance ?? 0);
  duration = linkedSignal<number>(() => this.currentTour()?.totalDuration ?? 0);

  errors = signal<Record<string, string>>({});

  fromSuggestions = signal<Poi[]>([]);
  selectedFrom = linkedSignal<Location | null>(() => {
    const tour = this.currentTour();
    if (tour) {
      return tour.from;
    }
    return null;
  });

  toSuggestions = signal<Poi[]>([]);
  selectedTo = linkedSignal<Location | null>(() => {
    const tour = this.currentTour();
    if (tour) {
      return tour.to;
    }
    return null;
  });

  searchFrom(event: AutoCompleteCompleteEvent) {
    this.openRouteService
      .getGeocodes(event.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pois) => this.fromSuggestions.set(pois));
  }

  searchTo(event: AutoCompleteCompleteEvent) {
    this.openRouteService
      .getGeocodes(event.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pois) => this.toSuggestions.set(pois));
  }

  onTransportChange(type: TransportType) {
    this.selectedTransport.set(type);
  }

  fetchRoute(from: Coordinates, to: Coordinates, transportType: TransportType) {
    this.tourApiService.getDirections(from, to, transportType).subscribe(({totalDistance, totalDuration, coordinates}) => {
      this.distance.set(totalDistance / 1000);
      this.duration.set(totalDuration / 60);
      this.routeStateService.setRoute(coordinates)
    })
  }


  onSubmit() {
    const formResult = v.safeParse(TourSchema, {
      tourName: this.tourName(),
      description: this.description(),
    });

    const errors: Record<string, string> = {};

    if (!formResult.success) {
      Object.assign(errors, getValidationErrors(formResult.issues));
    }
    if (!this.selectedFrom()) {
      errors['from'] = 'Please select a start location from the suggestions.';
    }
    if (!this.selectedTo()) {
      errors['to'] = 'Please select a destination from the suggestions.';
    }

    if (Object.keys(errors).length > 0) {
      this.errors.set(errors);
      return;
    }

    this.errors.set({});
    if (this.mode() === 'Edit') {
      this.editTour();
    } else {
      this.addTour();
    }
  }

  addTour() {
    const newTour: Tour = {
      tourName: this.tourName(),
      description: this.description(),
      from: this.selectedFrom()!,
      to: this.selectedTo()!,
      transportType: this.selectedTransport(),
      totalDistance: this.distance(),
      totalDuration: this.duration(),
      creatorId: 1,
    };

    this.tourStateService.addTour(newTour);

    this.router.navigate(['/tourlist']);
  }

  editTour() {
    const editedTour: Tour = {
      tourName: this.tourName(),
      description: this.description(),
      from: this.selectedFrom()!,
      to: this.selectedTo()!,
      transportType: this.selectedTransport(),
      totalDistance: this.distance(),
      totalDuration: this.duration(),
      creatorId: 1,
      id: this.currentTour()?.id,
    };

    this.tourStateService.editTour(editedTour);

    this.router.navigate(['/tourlist']);
  }
}
