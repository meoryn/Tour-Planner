import { TransportType } from './transport-type';
import { Location } from './location';
import { TourLog } from './tour-log';
import { TourDifficulty } from './tour-difficulty';

export type Tour = {
  transportType: TransportType;
  totalDistance: number;
  totalDuration: number;
  from: Location;
  to: Location;
  title: string;
  description: string;
  logs?: TourLog[];
  id?: number;
};

export type SavedTour = Tour & { id: number };


export function tourPopularity(tour: Tour): number {
  return tour.logs?.length ?? 0;
}


export function isTourChildFriendly(tour: Tour): boolean {
  if (!tour.logs || tour.logs.length === 0) {
    return false
  }

  for (const log of tour.logs) {
    if (log.difficulty != TourDifficulty.Easy) {
      return false
    }
  }

  if (tour.totalDuration >= 100) {
    return false
  }

  if (tour.totalDistance >= 100) {
    return false
  }
  return true

}


