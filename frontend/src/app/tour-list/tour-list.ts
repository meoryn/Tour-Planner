import { Component, signal, computed } from '@angular/core';
import { TourCard } from "../tour-card/tour-card";
import { Tour, TransportType } from '../tour-state-service';

@Component({
  selector: 'app-tour-list',
  imports: [TourCard],
  templateUrl: './tour-list.html',
  styleUrl: './tour-list.css',
})
export class TourList {
  tourlist = signal<Tour[]>([
    {
      id: 1, creatorId: 1,
      tourName: "Wien → Graz",
      from: "Wien", to: "Graz",
      transportType: TransportType.Car,
      totalDistance: 200, totalDuration: 2,
      description: "Klassische Autofahrt durch die Steierdddmark.",
      logs: []
    },
    {
      id: 2, creatorId: 1,
      tourName: "Graz → Salzburg",
      from: "Graz", to: "Salzburg",
      transportType: TransportType.Train,
      totalDistance: 280, totalDuration: 3,
      description: "Entspannte Zugfahrt mit Blick auf die Alpen.",
      logs: []
    },
    {
      id: 3, creatorId: 1,
      tourName: "Salzburg → Innsbruck",
      from: "Salzburg", to: "Innsbruck",
      transportType: TransportType.Car,
      totalDistance: 150, totalDuration: 1.5,
      description: "Kurze Fahrt durch das Salzachtal.",
      logs: []
    },
    {
      id: 4, creatorId: 1,
      tourName: "Wien Stadtspaziergang",
      from: "Stephansdom", to: "Prater",
      transportType: TransportType.Walk,
      totalDistance: 5, totalDuration: 1,
      description: "Gemütlicher Spaziergang durch die Wiener Innenstadt.",
      logs: []
    }
  ])

  searchQuery = signal("");

  filteredTours = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return this.tourlist();
    return this.tourlist().filter(t =>
      t.tourName.toLowerCase().includes(query) ||
      t.description.toLowerCase().includes(query)
    );
  });

  exportAllTours() {
    const json = JSON.stringify(this.filteredTours())
    const blob = new Blob([json])
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url
    a.download = "tours.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  onSearch(event: Event) {
    this.searchQuery.set((event.target as HTMLInputElement).value);
    console.log("set query" + this.filteredTours())
  }


}