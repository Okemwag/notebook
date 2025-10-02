import { SportType } from '@/types/sport';

export interface SportConfig {
  type: SportType;
  name: string;
  icon: string;
  color: string;
  gradientColors: [string, string];
  supportsDraw: boolean;
}

export const SPORT_CONFIGS: Record<SportType, SportConfig> = {
  [SportType.FOOTBALL]: {
    type: SportType.FOOTBALL,
    name: 'Football',
    icon: 'soccerball',
    color: '#00A86B',
    gradientColors: ['#00A86B', '#00C853'],
    supportsDraw: true,
  },
  [SportType.BASKETBALL]: {
    type: SportType.BASKETBALL,
    name: 'Basketball',
    icon: 'basketball',
    color: '#FF6B35',
    gradientColors: ['#FF6B35', '#FF8C42'],
    supportsDraw: false,
  },
  [SportType.TENNIS]: {
    type: SportType.TENNIS,
    name: 'Tennis',
    icon: 'tennisball',
    color: '#FFD700',
    gradientColors: ['#FFD700', '#FFA500'],
    supportsDraw: false,
  },
  [SportType.ICE_HOCKEY]: {
    type: SportType.ICE_HOCKEY,
    name: 'Ice Hockey',
    icon: 'hockey.puck',
    color: '#4A90E2',
    gradientColors: ['#4A90E2', '#5CA8FF'],
    supportsDraw: true,
  },
};

export const getSportConfig = (sportType: SportType): SportConfig => {
  return SPORT_CONFIGS[sportType];
};
