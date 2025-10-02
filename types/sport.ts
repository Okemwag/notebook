export enum SportType {
  FOOTBALL = 'football',
  BASKETBALL = 'basketball',
  TENNIS = 'tennis',
  ICE_HOCKEY = 'ice-hockey',
}

export interface SportConfig {
  type: SportType;
  name: string;
  icon: string;
  color: string;
  gradientColors: [string, string];
  supportsDraw: boolean;
}
