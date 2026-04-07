import { Component, inject, signal
 } from '@angular/core';
import { Card } from 'primeng/card';
import { TourSidebarComponent } from '../tour-sidebar/tour-sidebar';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-edit-tour',
  templateUrl: './edit-tour.html',
  imports: [Card, TourSidebarComponent],
  standalone: true,
})
export class EditTourComponent {

  tourID = signal<number>(0);
  private activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
    this.activatedRoute.params.subscribe((params: { [key: string]: string }) => {
      this.tourID.set(parseInt(params['id']));
    });
  }
}
