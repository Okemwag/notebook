import { SportType } from '@/types/sport';

export interface SportConfig {
  type: SportType;
  name: string;
  icon: string;
  color: string;
  gradientColors: {
    light: [string, string];
    dark: [string, string];
  };
  supportsDraw: boolean;
}

export const SPORT_CONFIGS: Record<SportType, SportConfig> = {
  [SportType.FOOTBALL]: {
    type: SportType.FOOTBALL,
    name: 'Football',
    icon: 'soccerball',
    color: '#00A86B',
    gradientColors: {
      light: ['#00A86B', '#00C853'],
      dark: ['#008F5A', '#00A86B'],
    },
    supportsDraw: true,
  },
  [SportType.BASKETBALL]: {
    type: SportType.BASKETBALL,
    name: 'Basketball',
    icon: 'basketball',
    color: '#FF6B35',
    gradientColors: {
      light: ['#FF6B35', '#FF8C42'],
      dark: ['#E65A2E', '#FF6B35'],
    },
    supportsDraw: false,
  },
  [SportType.TENNIS]: {
    type: SportType.TENNIS,
    name: 'Tennis',
    icon: 'tennisball',
    color: '#FFD700',
    gradientColors: {
      light: ['#FFD700', '#FFA500'],
      dark: ['#D4AF37', '#FFD700'],
    },
    supportsDraw: false,
  },
  [SportType.ICE_HOCKEY]: {
    type: SportType.ICE_HOCKEY,
    name: 'Ice Hockey',
    icon: 'hockey.puck',
    color: '#4A90E2',
    gradientColors: {
      light: ['#4A90E2', '#5CA8FF'],
      dark: ['#3A7BC8', '#4A90E2'],
    },
    supportsDraw: true,
  },
};

export const getSportConfig = (sportType: SportType): SportConfig => {
  return SPORT_CONFIGS[sportType];
};
