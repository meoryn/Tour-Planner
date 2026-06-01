import { Component, inject } from '@angular/core';
import { TourCard } from "../tour-card/tour-card";
import { Tour, TourStateService } from '../tour-state-service';
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

  async importTour(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const tours: Tour[] = Array.isArray(parsed) ? parsed : [parsed];
      for (const tour of tours) {
        this.tourStateService.addTour(tour);
      }
    } catch {
      console.error("invalid json format");
    }
  }

  onSearch(event: Event) {
    this.tourStateService.setSearchQuery((event.target as HTMLInputElement).value);
  }
}
