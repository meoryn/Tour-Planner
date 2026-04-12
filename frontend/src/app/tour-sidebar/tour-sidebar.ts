import { Component, input, linkedSignal, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { TransportType, Tour, TourStateService } from '../tour-state-service';
import { Router } from '@angular/router';
import { getValidationErrors } from '../shared/validation-utils';
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
  imports: [FormsModule, SelectButton, InputText, Textarea, ButtonModule],
  standalone: true,
})
export class TourSidebarComponent {
  private tourStateService = inject(TourStateService);
  private router = inject(Router);

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
