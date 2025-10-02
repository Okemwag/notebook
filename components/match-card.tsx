import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Match, MatchStatus } from '@/types/match';
import { Prediction } from '@/types/prediction';
import { format } from 'date-fns';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
    FadeInDown,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import { LeagueBadge } from './league-badge';

// Helper functions for date formatting
const formatMatchDate = (date: Date): string => {
  return format(date, 'MMM dd');
};

const formatMatchTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

interface MatchCardProps {
  match: Match;
  prediction?: Prediction;
  onPress: () => void;
  index?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function MatchCard({ match, prediction, onPress, index = 0 }: MatchCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: 400,
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.98, {
      damping: 15,
      stiffness: 300,
    });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    });
  };

  const getStatusColor = () => {
    switch (match.status) {
      case MatchStatus.LIVE:
        return colors.error;
      case MatchStatus.FINISHED:
        return colors.disabled;
      case MatchStatus.POSTPONED:
        return colors.warning;
      default:
        return colors.text;
    }
  };

  const getStatusText = () => {
    switch (match.status) {
      case MatchStatus.LIVE:
        return 'LIVE';
      case MatchStatus.FINISHED:
        return 'FT';
      case MatchStatus.POSTPONED:
        return 'POSTPONED';
      default:
        return formatMatchTime(match.dateTime);
    }
  };

  const getAccessibilityLabel = () => {
    const statusText = match.status === MatchStatus.LIVE 
      ? 'Live match' 
      : match.status === MatchStatus.FINISHED 
      ? 'Finished match' 
      : match.status === MatchStatus.POSTPONED
      ? 'Postponed match'
      : `Match at ${formatMatchTime(match.dateTime)}`;
    
    const predictionText = prediction ? ', you have made a prediction' : '';
    const scoreText = match.liveScore 
      ? `, current score ${match.liveScore.home} to ${match.liveScore.away}` 
      : '';
    
    return `${match.homeTeam.name} versus ${match.awayTeam.name}, ${match.league.name}, ${match.league.country}, ${formatMatchDate(match.dateTime)}, ${statusText}${scoreText}${predictionText}`;
  };

  return (
    <AnimatedPressable
      entering={FadeInDown.delay(index * 50).duration(400).springify()}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[
        styles.container,
        animatedStyle,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityHint="Double tap to view match details and make a prediction"
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      {/* Header with League Badge and Date */}
      <View style={styles.header}>
        <LeagueBadge
          league={match.league.name}
          country={match.league.country}
          size="small"
        />
        <Text style={[styles.date, { color: colors.icon }]}>
          {formatMatchDate(match.dateTime)}
        </Text>
      </View>

      {/* Teams Section */}
      <View style={styles.teamsContainer}>
        {/* Home Team */}
        <View style={styles.teamRow}>
          <Text
            style={[styles.teamName, { color: colors.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {match.homeTeam.name}
          </Text>
          {match.liveScore && (
            <Text style={[styles.score, { color: colors.text }]}>
              {match.liveScore.home}
            </Text>
          )}
        </View>

        {/* Away Team */}
        <View style={styles.teamRow}>
          <Text
            style={[styles.teamName, { color: colors.text }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {match.awayTeam.name}
          </Text>
          {match.liveScore && (
            <Text style={[styles.score, { color: colors.text }]}>
              {match.liveScore.away}
            </Text>
          )}
        </View>
      </View>

      {/* Footer with Status and Prediction Indicator */}
      <View style={styles.footer}>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                match.status === MatchStatus.LIVE
                  ? colors.error
                  : colors.cardBorder,
            },
          ]}
        >
          <Text
            style={[
              styles.statusText,
              {
                color:
                  match.status === MatchStatus.LIVE ? '#FFFFFF' : getStatusColor(),
              },
            ]}
          >
            {getStatusText()}
          </Text>
        </View>

        {prediction && (
          <View
            style={[
              styles.predictionIndicator,
              { backgroundColor: colors.success },
            ]}
          >
            <Text style={styles.predictionText}>✓ Predicted</Text>
          </View>
        )}
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: Spacing.md,
    marginHorizontal: Spacing.sm,
    marginVertical: 6,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  date: {
    ...Typography.caption,
    fontWeight: '500',
  },
  teamsContainer: {
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  teamRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamName: {
    ...Typography.bodyBold,
    flex: 1,
    marginRight: Spacing.sm,
  },
  score: {
    ...Typography.h3,
    fontWeight: '700',
    minWidth: 30,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
  },
  statusText: {
    ...Typography.caption,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  predictionIndicator: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  predictionText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
