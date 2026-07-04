import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { TourStateService } from './tour-state-service';
import { TourApiService } from './tour-api-service';
import { SavedTour } from './models/tour';
import { TourDifficulty } from './models/tour-difficulty';
import { TransportType } from './models/transport-type';

function testTour(overrides: Partial<SavedTour>): SavedTour {
  return {
    id: 1,
    title: 'Tour',
    description: 'desc',
    transportType: TransportType.Walk,
    totalDistance: 10,
    totalDuration: 60,
    from: { label: 'A', lat: 0, lng: 0 },
    to: { label: 'B', lat: 1, lng: 1 },
    logs: [],
    ...overrides,
  };
}

const easyLog = {
  id: 1,
  creationDate: new Date(),
  comment: 'nice weather',
  difficulty: TourDifficulty.Easy,
  totalDistance: 5,
  totalTime: 30,
  rating: 4,
};

const TOURS: SavedTour[] = [
  testTour({ id: 1, title: 'Donauinsel Ride', description: 'flat bike route' }),
  testTour({
    id: 2,
    title: 'Schneeberg Hike',
    description: 'steep climb',
    logs: [
      { ...easyLog, id: 1 },
      { ...easyLog, id: 2, comment: 'rainy day', difficulty: TourDifficulty.Hard },
    ],
  }),
  testTour({
    id: 3,
    title: 'Stadtpark Walk',
    description: 'short stroll',
    logs: [{ ...easyLog, id: 3 }],
  }),
];

describe('TourStateService full-text search', () => {
  let service: TourStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: TourApiService, useValue: { getAll: () => of(TOURS) } }],
    });
    service = TestBed.inject(TourStateService);
    service.loadTours().subscribe();
  });

  it('returns all tours when the query is empty', () => {
    expect(service.filteredTours().length).toBe(3);
  });

  it('matches the tour title case-insensitively', () => {
    service.setSearchQuery('schneeberg');
    expect(service.filteredTours().map((t) => t.id)).toEqual([2]);
  });

  it('matches the tour description', () => {
    service.setSearchQuery('stroll');
    expect(service.filteredTours().map((t) => t.id)).toEqual([3]);
  });

  it('matches tour log comments', () => {
    service.setSearchQuery('rainy');
    expect(service.filteredTours().map((t) => t.id)).toEqual([2]);
  });

  it('matches the computed popularity (number of logs)', () => {
    service.setSearchQuery('2');
    expect(service.filteredTours().map((t) => t.id)).toEqual([2]);
  });

  it('matches the computed child-friendliness', () => {
    service.setSearchQuery('child');
    // only tour 3 has logs that are all easy and stays below the limits
    expect(service.filteredTours().map((t) => t.id)).toEqual([3]);
  });
});
