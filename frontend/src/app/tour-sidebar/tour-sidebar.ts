import { Component, input, signal, inject } from '@angular/core';
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

  selectedTransport = signal<TransportType>(TransportType.Car);

  from = signal<string>('');
  to = signal<string>('');
  tourName = signal<string>('');
  description = signal<string>('');

  distance = signal<number>(0);
  duration = signal<number>(0);

  addTour() {
    const newTour: Tour = {
      tourName: this.tourName(),
      description: this.description(),
      from: { lat: 0, lng: 0 }, 
      to: { lat: 0, lng: 0 }, 
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
      from: { lat: 0, lng: 0 }, 
      to: { lat: 0, lng: 0 }, 
      transportType: this.selectedTransport(),
      totalDistance: this.distance(),
      totalDuration: this.duration(),
      creatorId: 1,
    };

    //TODO: add edit tour logic in tourStateService
  }
}
