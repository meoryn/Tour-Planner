import { Tour, isTourChildFriendly, tourPopularity } from '../models/tour';
import { TourLog } from '../models/tour-log';
import { TourDifficulty } from '../models/tour-difficulty';
import { TransportType } from '../models/transport-type';

describe('tourPopularity', () => {
  it('returns the number of logs', () => {
    const tour: Tour = {
      transportType: TransportType.Car,
      totalDistance: 10,
      totalDuration: 60,
      from: { label: 'A', lat: 0, lng: 0 },
      to: { label: 'B', lat: 1, lng: 1 },
      title: 'Test Tour',
      description: 'desc',
      logs: [
        { id: 1, creationDate: new Date(), comment: '', difficulty: TourDifficulty.Easy, totalDistance: 5, totalTime: 30, rating: 4 },
        { id: 2, creationDate: new Date(), comment: '', difficulty: TourDifficulty.Hard, totalDistance: 5, totalTime: 30, rating: 4 },
      ],
    };
    expect(tourPopularity(tour)).toBe(2);
  });

  it('returns 0 when logs are undefined', () => {
    const tour: Tour = {
      transportType: TransportType.Car,
      totalDistance: 10,
      totalDuration: 60,
      from: { label: 'A', lat: 0, lng: 0 },
      to: { label: 'B', lat: 1, lng: 1 },
      title: 'Test Tour',
      description: 'desc',
    };
    expect(tourPopularity(tour)).toBe(0);
  });
});

describe('isTourChildFriendly', () => {
  const easyLog: TourLog = {
    id: 1,
    creationDate: new Date(),
    comment: '',
    difficulty: TourDifficulty.Easy,
    totalDistance: 5,
    totalTime: 30,
    rating: 4,
  };

  it('is true when all logs are easy and duration/distance are below the limits', () => {
    const tour: Tour = {
      transportType: TransportType.Car,
      totalDistance: 10,
      totalDuration: 60,
      from: { label: 'A', lat: 0, lng: 0 },
      to: { label: 'B', lat: 1, lng: 1 },
      title: 'Test Tour',
      description: 'desc',
      logs: [easyLog, { ...easyLog, id: 2 }],
    };
    expect(isTourChildFriendly(tour)).toBe(true);
  });

  it('is false when at least one log is not easy', () => {
    const tour: Tour = {
      transportType: TransportType.Car,
      totalDistance: 10,
      totalDuration: 60,
      from: { label: 'A', lat: 0, lng: 0 },
      to: { label: 'B', lat: 1, lng: 1 },
      title: 'Test Tour',
      description: 'desc',
      logs: [easyLog, { ...easyLog, id: 2, difficulty: TourDifficulty.Medium }],
    };
    expect(isTourChildFriendly(tour)).toBe(false);
  });

  it('is false when the duration reaches the limit', () => {
    const tour: Tour = {
      transportType: TransportType.Car,
      totalDistance: 10,
      totalDuration: 100,
      from: { label: 'A', lat: 0, lng: 0 },
      to: { label: 'B', lat: 1, lng: 1 },
      title: 'Test Tour',
      description: 'desc',
      logs: [easyLog],
    };
    expect(isTourChildFriendly(tour)).toBe(false);
  });

  it('is false when the distance reaches the limit', () => {
    const tour: Tour = {
      transportType: TransportType.Car,
      totalDistance: 120,
      totalDuration: 60,
      from: { label: 'A', lat: 0, lng: 0 },
      to: { label: 'B', lat: 1, lng: 1 },
      title: 'Test Tour',
      description: 'desc',
      logs: [easyLog],
    };
    expect(isTourChildFriendly(tour)).toBe(false);
  });

  it('is false when the tour has no logs', () => {
    const tour: Tour = {
      transportType: TransportType.Car,
      totalDistance: 10,
      totalDuration: 60,
      from: { label: 'A', lat: 0, lng: 0 },
      to: { label: 'B', lat: 1, lng: 1 },
      title: 'Test Tour',
      description: 'desc',
    };
    expect(isTourChildFriendly(tour)).toBe(false);
  });
});
