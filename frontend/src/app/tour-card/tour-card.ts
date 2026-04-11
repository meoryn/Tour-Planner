import { Component, inject, Input } from '@angular/core';
import { Tour, TourStateService } from '../tour-state-service';
import { Card } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-tour-card',
  imports: [Card, ButtonModule],
  templateUrl: './tour-card.html',
  styleUrl: './tour-card.css',
})
export class TourCard {
  @Input() tour!: Tour;

  private tourStateService = inject(TourStateService);

  exportTour() {
    this.tourStateService.exportSingleTour(this.tour);
  }
}
