import { Component, Input, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TourStateService } from '../tour-state-service';
import { SavedTour } from '../models/tour';
import { Card } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { MessageService } from 'primeng/api';
import { TourLogsDialog } from '../tour-logs-dialog/tour-logs-dialog';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tour-card',
  imports: [Card, ButtonModule, TourLogsDialog, RouterLink, DecimalPipe],
  templateUrl: './tour-card.html',
  styleUrl: './tour-card.css',
})
export class TourCard {
  @Input() tour!: SavedTour;

  private tourStateService = inject(TourStateService);
  private messageService = inject(MessageService);

  logsDialogVisible = signal(false);

  exportTour() {
    this.tourStateService.exportSingleTour(this.tour);
  }

  showLogs() {
    this.tourStateService.selectTour(this.tour.id);
    this.logsDialogVisible.set(true);
    this.tourStateService.loadTourLogs(this.tour.id).subscribe({
      error: () =>
        this.messageService.add({
          severity: 'error',
          summary: 'Failed to load logs',
          detail: this.tour.title,
        }),
    });
  }

  removeTour() {
    this.tourStateService.removeTourById(this.tour.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Tour removed',
          detail: this.tour.title,
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Delete failed',
          detail: 'Could not delete the tour',
        });
      },
    });
  }

  formatTransport(value: string): string {
    return value.charAt(0) + value.slice(1).toLowerCase();
  }
}
