export enum PredictionOption {
  HOME_WIN = 'home_win',
  DRAW = 'draw',
  AWAY_WIN = 'away_win',
  GG = 'gg', // Both teams to score
  OVER_2_5 = 'over_2_5', // Over 2.5 goals
  UNDER_2_5 = 'under_2_5', // Under 2.5 goals
}

export interface Prediction {
  id: string;
  matchId: string;
  userId?: string;
  prediction: PredictionOption;
  timestamp: Date;
  confidence?: number;
  isCorrect?: boolean;
}
