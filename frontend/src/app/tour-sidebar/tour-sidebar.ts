import { Component, input, linkedSignal, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { AutoCompleteModule, AutoCompleteCompleteEvent, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { TransportType, Tour, TourStateService } from '../tour-state-service';
import { Router } from '@angular/router';
import { getValidationErrors } from '../shared/validation-utils';
import { OpenRouteService, Poi } from '../open-route-service';

import * as v from 'valibot';

const TourSchema = v.object({
  from: v.pipe(v.string(), v.minLength(1, 'From is required.')),
  to: v.pipe(v.string(), v.minLength(1, 'To is required.')),
  tourName: v.pipe(v.string(), v.minLength(1, 'Tour name is required.')),
  description: v.optional(v.string()),
});

@Component({
  selector: 'app-tour-sidebar',
  templateUrl: './tour-sidebar.html',
  imports: [FormsModule, SelectButton, InputText, Textarea, ButtonModule, AutoCompleteModule],
  standalone: true,
})
export class TourSidebarComponent {
  private tourStateService = inject(TourStateService);
  private router = inject(Router);
  private openRouteService = inject(OpenRouteService);
  private destroyRef = inject(DestroyRef);

  transportTypes = [
    { label: 'Walk', value: TransportType.Walk },
    { label: 'Car', value: TransportType.Car },
    { label: 'Train', value: TransportType.Train },
  ];

  mode = input<'Add' | 'Edit'>('Add');
  currentTour = input<Tour | null>(null);

  selectedTransport = linkedSignal<TransportType>(() => this.currentTour()?.transportType ?? TransportType.Car);

  from = linkedSignal<string>(() => this.currentTour()?.from ?? '');
  to = linkedSignal<string>(() => this.currentTour()?.to ?? '');
  tourName = linkedSignal<string>(() => this.currentTour()?.tourName ?? '');
  description = linkedSignal<string>(() => this.currentTour()?.description ?? '');

  distance = linkedSignal<number>(() => this.currentTour()?.totalDistance ?? 0);
  duration = linkedSignal<number>(() => this.currentTour()?.totalDuration ?? 0);

  errors = signal<Record<string, string>>({});

  fromSuggestions = signal<Poi[]>([]);
  selectedFrom = signal<Poi | null>(null);

  toSuggestions = signal<Poi[]>([]);
  selectedTo = signal<Poi | null>(null);

  searchFrom(event: AutoCompleteCompleteEvent) {
    this.openRouteService
      .getGeocodes(event.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pois) => this.fromSuggestions.set(pois));
  }

  onFromSelect(event: AutoCompleteSelectEvent) {
    this.selectedFrom.set(event.value as Poi);
  }

  searchTo(event: AutoCompleteCompleteEvent) {
    this.openRouteService
      .getGeocodes(event.query)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((pois) => this.toSuggestions.set(pois));
  }

  onToSelect(event: AutoCompleteSelectEvent) {
    this.selectedTo.set(event.value as Poi);
  }




  onSubmit() {
    const formResult = v.safeParse(TourSchema, {
      from: this.from(),
      to: this.to(),
      tourName: this.tourName(),
      description: this.description(),
    });

    if (formResult.success) {
      this.errors.set({});
      if (this.mode() === 'Edit') {
        this.editTour();
      } else {
        this.addTour();
      }
    } else {
      this.errors.set(getValidationErrors(formResult.issues));
    }
  }

  addTour() {
    const newTour: Tour = {
      tourName: this.tourName(),
      description: this.description(),
      from: this.from(),
      to: this.to(),
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
      from: this.from(),
      to: this.to(),
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
