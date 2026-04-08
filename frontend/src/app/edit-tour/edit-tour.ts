import { Component, computed, inject } from '@angular/core';
import { Card } from 'primeng/card';
import { TourSidebarComponent } from '../tour-sidebar/tour-sidebar';
import { ActivatedRoute, Params } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { TourStateService } from '../tour-state-service';

@Component({
  selector: 'app-edit-tour',
  templateUrl: './edit-tour.html',
  imports: [Card, TourSidebarComponent],
  standalone: true,
})
export class EditTourComponent {

  private activatedRoute = inject(ActivatedRoute);
  private tourStateService = inject(TourStateService);

  private params = toSignal(this.activatedRoute.params, { initialValue: {} as Params });
  tourID = computed(() => Number(this.params()['id']));
  currentTour = computed(() => this.tourStateService.getTourById(this.tourID()) ?? null);
}
