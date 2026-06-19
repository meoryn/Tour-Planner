import { Component, OnInit, inject, signal } from '@angular/core';
import { concatMap, from } from 'rxjs';
import { TourCard } from '../tour-card/tour-card';
import { TourStateService } from '../tour-state-service';
import { Tour } from '../models/tour';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-tour-list',
  imports: [TourCard, ButtonModule, InputText],
  templateUrl: './tour-list.html',
  styleUrl: './tour-list.css',
})
export class TourList implements OnInit {
  private tourStateService = inject(TourStateService);
  private messageService = inject(MessageService);

  filteredTours = this.tourStateService.filteredTours;
  importing = signal(false);

  ngOnInit() {
    this.tourStateService.loadTours().subscribe({
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Load failed',
          detail: 'Could not load tours',
        });
      },
    });
  }

  exportAllTours() {
    this.tourStateService.exportAllTours();
  }

  async importTour(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    let tours: Tour[];
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      tours = Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      this.messageService.add({
        severity: 'error',
        summary: 'Import failed',
        detail: 'Invalid JSON',
      });
      input.value = '';
      return;
    }

    this.importing.set(true);
    from(tours)
      .pipe(concatMap((tour) => this.tourStateService.addTour(tour)))
      .subscribe({
        complete: () => {
          this.importing.set(false);
          input.value = '';
          this.messageService.add({
            severity: 'success',
            summary: 'Tours imported',
            detail: `${tours.length} tour(s) added`,
          });
        },
        error: () => {
          this.importing.set(false);
          input.value = '';
          this.messageService.add({
            severity: 'error',
            summary: 'Import failed',
            detail: 'Server rejected one of the tours',
          });
        },
      });
  }

  onSearch(event: Event) {
    this.tourStateService.setSearchQuery((event.target as HTMLInputElement).value);
  }
}
