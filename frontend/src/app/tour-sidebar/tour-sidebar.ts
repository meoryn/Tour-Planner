import { Component, input, linkedSignal, inject, signal, effect, DestroyRef } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule, AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { MessageService } from 'primeng/api';
import { TourStateService } from '../tour-state-service';
import { SavedTour, Tour } from '../models/tour';
import { TransportType } from '../models/transport-type';
import { Location } from '../models/location';
import { Router } from '@angular/router';
import { getValidationErrors } from '../shared/validation-utils';
import { OpenRouteService, Poi } from '../open-route-service';
import { TourApiService } from '../tour-api-service';
import { RouteStateService } from '../route-state-service';
import { MapPickService } from '../map-pick-service';

import * as v from 'valibot';

const TourSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1, 'Tour name is required.')),
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
  private mapPickService = inject(MapPickService);
  private destroyRef = inject(DestroyRef);
  private messageService = inject(MessageService);

  pickTarget = this.mapPickService.activeTarget;

  constructor() {
    this.routeStateService.clear();
    this.mapPickService.reset();

    effect(() => {
      const from = this.selectedFrom();
      const to = this.selectedTo();
      const transportType = this.selectedTransport();
      if (from && to && transportType) {
        this.fetchRoute(from, to, transportType);
      }
    });

    effect(() => {
      const picked = this.mapPickService.pickedLocation();
      if (picked) {
        if (this.mapPickService.activeTarget() === 'from') {
          this.selectedFrom.set(picked);
          this.mapPickService.pickedLocation.set(null);

        } else if (this.mapPickService.activeTarget() === 'to') {

          this.selectedTo.set(picked);
          this.mapPickService.pickedLocation.set(null);

        }
        this.mapPickService.reset();
      }
    });
  }

  pickOnMap(target: 'from' | 'to') {
    this.mapPickService.toggle(target);
  }

  transportTypes = [
    { label: 'Walk', value: TransportType.Walk },
    { label: 'Car', value: TransportType.Car },
    { label: 'Cycle', value: TransportType.Cycle },
  ];

  mode = input<'Add' | 'Edit'>('Add');
  currentTour = input<Tour | null>(null);

  selectedTransport = linkedSignal<TransportType>(
    () => this.currentTour()?.transportType ?? TransportType.Car,
  );

  title = linkedSignal<string>(() => this.currentTour()?.title ?? '');
  description = linkedSignal<string>(() => this.currentTour()?.description ?? '');

  distance = linkedSignal<number>(() => this.currentTour()?.totalDistance ?? 0);
  duration = linkedSignal<number>(() => this.currentTour()?.totalDuration ?? 0);

  errors = signal<Record<string, string>>({});
  submitting = signal(false);

  fromSuggestions = signal<Poi[]>([]);
  selectedFrom = linkedSignal<Location | null>(() => this.currentTour()?.from ?? null);

  toSuggestions = signal<Poi[]>([]);
  selectedTo = linkedSignal<Location | null>(() => this.currentTour()?.to ?? null);

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

  fetchRoute(from: Location, to: Location, transportType: TransportType) {
    this.tourApiService.getDirections(from, to, transportType).subscribe({
      next: ({ totalDistance, totalDuration, coordinates }) => {
        this.distance.set(totalDistance / 1000);
        this.duration.set(totalDuration / 60);
        this.routeStateService.setRoute(coordinates);
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Route failed',
          detail: 'Could not fetch directions',
        });
      },
    });
  }

  onSubmit() {
    const formResult = v.safeParse(TourSchema, {
      title: this.title(),
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

  private buildTour(): Tour {
    return {
      title: this.title(),
      description: this.description() ?? '',
      from: this.selectedFrom()!,
      to: this.selectedTo()!,
      transportType: this.selectedTransport(),
      totalDistance: this.distance(),
      totalDuration: this.duration(),
    };
  }

  addTour() {
    this.submitting.set(true);
    this.tourStateService.addTour(this.buildTour()).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Tour created',
          detail: this.title(),
        });
        this.router.navigate(['/tourlist']);
      },
      error: () => {
        this.submitting.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Save failed',
          detail: 'Could not create the tour',
        });
      },
    });
  }

  editTour() {
    const current = this.currentTour();
    if (!current?.id) return;
    const edited: SavedTour = { ...this.buildTour(), id: current.id };
    this.submitting.set(true);
    this.tourStateService.editTour(edited).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Tour updated',
          detail: this.title(),
        });
        this.router.navigate(['/tourlist']);
      },
      error: () => {
        this.submitting.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Save failed',
          detail: 'Could not update the tour',
        });
      },
    });
  }
}
