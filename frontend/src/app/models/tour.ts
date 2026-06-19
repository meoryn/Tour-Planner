import { TransportType } from './transport-type';
import { Location } from './location';
import { TourLog } from './tour-log';

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
