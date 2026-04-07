import { Component } from '@angular/core';
import { Card } from 'primeng/card';
import { TourSidebarComponent } from '../tour-sidebar/tour-sidebar';

@Component({
  selector: 'app-add-tour',
  templateUrl: './add-tour.html',
  imports: [Card, TourSidebarComponent],
  standalone: true,
})
export class AddTourComponent {}
