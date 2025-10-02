import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface LeagueBadgeProps {
  league: string;
  country: string;
  size?: 'small' | 'medium' | 'large';
}

const COUNTRY_FLAGS: Record<string, string> = {
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Spain': '🇪🇸',
  'Germany': '🇩🇪',
  'Italy': '🇮🇹',
  'France': '🇫🇷',
  'USA': '🇺🇸',
  'International': '🌍',
  'Canada': '🇨🇦',
  'Brazil': '🇧🇷',
  'Argentina': '🇦🇷',
  'Portugal': '🇵🇹',
  'Netherlands': '🇳🇱',
  'Belgium': '🇧🇪',
  'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Wales': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
  'Australia': '🇦🇺',
  'Japan': '🇯🇵',
  'China': '🇨🇳',
  'Russia': '🇷🇺',
  'Mexico': '🇲🇽',
};

export function LeagueBadge({ league, country, size = 'medium' }: LeagueBadgeProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  const flag = COUNTRY_FLAGS[country] || '🏳️';
  
  const sizeStyles = {
    small: {
      container: styles.containerSmall,
      text: styles.textSmall,
      flag: styles.flagSmall,
    },
    medium: {
      container: styles.containerMedium,
      text: styles.textMedium,
      flag: styles.flagMedium,
    },
    large: {
      container: styles.containerLarge,
      text: styles.textLarge,
      flag: styles.flagLarge,
    },
  };

  const currentSize = sizeStyles[size];

  return (
    <View style={[styles.container, currentSize.container, { backgroundColor: colors.cardBorder }]}>
      <Text style={[currentSize.flag]}>{flag}</Text>
      <Text 
        style={[
          styles.text, 
          currentSize.text, 
          { color: colors.text }
        ]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {league}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  
  // Small size
  containerSmall: {
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.xs / 2,
    gap: Spacing.xs / 2,
  },
  textSmall: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
    maxWidth: 100,
  },
  flagSmall: {
    fontSize: 10,
  },
  
  // Medium size
  containerMedium: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    gap: Spacing.xs,
  },
  textMedium: {
    ...Typography.caption,
    fontWeight: '500',
    maxWidth: 150,
  },
  flagMedium: {
    fontSize: 14,
  },
  
  // Large size
  containerLarge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  textLarge: {
    ...Typography.body,
    fontWeight: '600',
    maxWidth: 200,
  },
  flagLarge: {
    fontSize: 18,
  },
  
  text: {
    letterSpacing: 0.2,
  },
});
