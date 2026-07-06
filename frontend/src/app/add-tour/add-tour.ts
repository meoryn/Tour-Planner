import { Component } from '@angular/core';
import { Card } from 'primeng/card';
import { TourSidebarComponent } from '../tour-sidebar/tour-sidebar';
import { MapComponent } from '../map/map';

@Component({
  selector: 'app-add-tour',
  templateUrl: './add-tour.html',
  imports: [Card, TourSidebarComponent, MapComponent],
  standalone: true,
})
export class AddTourComponent {}
