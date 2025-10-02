import { SportType } from './sport';

export enum MatchStatus {
  UPCOMING = 'upcoming',
  LIVE = 'live',
  FINISHED = 'finished',
  POSTPONED = 'postponed',
}

export interface Team {
  id: string;
  name: string;
  logo?: string;
  country?: string;
}

export interface League {
  id: string;
  name: string;
  country: string;
  logo?: string;
}

export interface Match {
  id: string;
  sport: SportType;
  homeTeam: Team;
  awayTeam: Team;
  dateTime: Date;
  status: MatchStatus;
  league: League;
  venue?: string;
  odds?: {
    home: number;
    draw?: number;
    away: number;
  };
  liveScore?: {
    home: number;
    away: number;
  };
}
