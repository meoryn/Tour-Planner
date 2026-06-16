import { TourDifficulty } from './tour-difficulty';

export type TourLog = {
  id: number;
  creationDate: Date;
  description: string;
  difficulty: TourDifficulty;
  totalDistance: number;
  totalTime: number;
  rating: number;
};
