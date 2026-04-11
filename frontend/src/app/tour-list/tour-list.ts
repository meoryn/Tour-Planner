import { Component, inject } from '@angular/core';
import { TourCard } from "../tour-card/tour-card";
import { TourStateService } from '../tour-state-service';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-tour-list',
  imports: [TourCard, ButtonModule, InputText],
  templateUrl: './tour-list.html',
  styleUrl: './tour-list.css',
})
export class TourList {
  private tourStateService = inject(TourStateService);

  filteredTours = this.tourStateService.filteredTours;

  exportAllTours() {
    this.tourStateService.exportAllTours();
  }

  importTour() {
    // TODO: implement tour import
  }

  onSearch(event: Event) {
    this.tourStateService.setSearchQuery((event.target as HTMLInputElement).value);
  }
}
