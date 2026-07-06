import { TourDifficulty } from './tour-difficulty';

export type TourLog = {
  id: number;
  creationDate: Date;
  comment: string;
  difficulty: TourDifficulty;
  totalDistance: number;
  totalTime: number;
  rating: number;
};
