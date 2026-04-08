import { Component, input, linkedSignal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SelectButton } from 'primeng/selectbutton';
import { InputText } from 'primeng/inputtext';
import { Textarea } from 'primeng/textarea';
import { ButtonModule } from 'primeng/button';
import { TransportType, Tour, TourStateService } from '../tour-state-service';

@Component({
  selector: 'app-tour-sidebar',
  templateUrl: './tour-sidebar.html',
  imports: [FormsModule, SelectButton, InputText, Textarea, ButtonModule],
  standalone: true,
})
export class TourSidebarComponent {
  private tourStateService = inject(TourStateService);

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

    console.log('Tour added:', this.tourStateService.tours());
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

     console.log('Tour edited:', this.tourStateService.tours());
  }
}
