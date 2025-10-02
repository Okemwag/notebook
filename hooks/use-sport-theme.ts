import { SPORT_CONFIGS } from '@/constants/sports';
import { SportConfig, SportType } from '@/types/sport';
import { useMemo } from 'react';
import { useColorScheme } from './use-color-scheme';

interface SportTheme {
  config: SportConfig;
  colors: {
    primary: string;
    gradient: [string, string];
    text: string;
    background: string;
    card: string;
    border: string;
  };
  isDark: boolean;
}

/**
 * Custom hook for getting sport-specific theming
 * @param sport - The sport type to get theme for
 * @returns Object containing sport configuration and theme colors
 */
export function useSportTheme(sport: SportType): SportTheme {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const theme = useMemo(() => {
    const config = SPORT_CONFIGS[sport];

    // Adjust colors for dark mode
    const colors = {
      primary: config.color,
      gradient: config.gradientColors as [string, string],
      text: isDark ? '#FFFFFF' : '#000000',
      background: isDark ? '#000000' : '#FFFFFF',
      card: isDark ? '#1E1E1E' : '#FFFFFF',
      border: isDark ? '#2C2C2C' : '#E5E5E5',
    };

    return {
      config,
      colors,
      isDark,
    };
  }, [sport, isDark]);

  return theme;
}

/**
 * Custom hook for getting all sport themes
 * @returns Array of all sport themes
 */
export function useAllSportThemes(): SportTheme[] {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const themes = useMemo(() => {
    return Object.values(SportType).map(sport => {
      const config = SPORT_CONFIGS[sport];

      const colors = {
        primary: config.color,
        gradient: config.gradientColors as [string, string],
        text: isDark ? '#FFFFFF' : '#000000',
        background: isDark ? '#000000' : '#FFFFFF',
        card: isDark ? '#1E1E1E' : '#FFFFFF',
        border: isDark ? '#2C2C2C' : '#E5E5E5',
      };

      return {
        config,
        colors,
        isDark,
      };
    });
  }, [isDark]);

  return themes;
}

/**
 * Custom hook for getting theme colors based on color scheme
 * @returns Object containing theme colors for current color scheme
 */
export function useAppTheme(): {
  colors: {
    text: string;
    background: string;
    card: string;
    cardBorder: string;
    success: string;
    warning: string;
    error: string;
    disabled: string;
    overlay: string;
  };
  isDark: boolean;
} {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = useMemo(() => {
    if (isDark) {
      return {
        text: '#FFFFFF',
        background: '#000000',
        card: '#1E1E1E',
        cardBorder: '#2C2C2C',
        success: '#66BB6A',
        warning: '#FFD54F',
        error: '#EF5350',
        disabled: '#757575',
        overlay: 'rgba(0, 0, 0, 0.7)',
      };
    }

    return {
      text: '#000000',
      background: '#FFFFFF',
      card: '#FFFFFF',
      cardBorder: '#E5E5E5',
      success: '#4CAF50',
      warning: '#FFC107',
      error: '#F44336',
      disabled: '#BDBDBD',
      overlay: 'rgba(0, 0, 0, 0.5)',
    };
  }, [isDark]);

  return {
    colors,
    isDark,
  };
}
