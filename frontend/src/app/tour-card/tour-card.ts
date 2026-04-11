import { Component, Input } from '@angular/core';
import { Tour } from '../tour-state-service';

@Component({
  selector: 'app-tour-card',
  imports: [],
  templateUrl: './tour-card.html',
  styleUrl: './tour-card.css',
})
export class TourCard {
  @Input() tour!: Tour;

  exportTour() {
    const json = JSON.stringify(this.tour)
    const blob = new Blob([json])
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url
    a.download = this.tour.tourName + ".json";
    a.click();
    URL.revokeObjectURL(url);
  }
}
