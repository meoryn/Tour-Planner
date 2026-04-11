import { Component, inject, Input, signal } from '@angular/core';
import { Tour, TourStateService } from '../tour-state-service';
import { Card } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TourLogsDialog } from '../tour-logs-dialog/tour-logs-dialog';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-tour-card',
  imports: [Card, ButtonModule, TourLogsDialog, RouterLink],
  templateUrl: './tour-card.html',
  styleUrl: './tour-card.css',
})
export class TourCard {
  @Input() tour!: Tour;

  private tourStateService = inject(TourStateService);

  logsDialogVisible = signal(false);

  exportTour() {
    this.tourStateService.exportSingleTour(this.tour);
  }

  showLogs() {
    this.tourStateService.selectTour(this.tour.id!);
    this.logsDialogVisible.set(true);
  }
}
