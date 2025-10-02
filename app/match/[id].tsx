import { ErrorState } from '@/components/error-state';
import { LeagueBadge } from '@/components/league-badge';
import { LoadingSpinner } from '@/components/loading-spinner';
import { PredictionSelector } from '@/components/prediction-selector';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSportTheme } from '@/hooks/use-sport-theme';
import { matchService } from '@/services/match-service';
import { predictionService } from '@/services/prediction-service';
import { Match } from '@/types/match';
import { Prediction, PredictionOption } from '@/types/prediction';
import { SportType } from '@/types/sport';
import { formatMatchDateTime } from '@/utils/date-utils';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

const AnimatedView = Animated.View;

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [match, setMatch] = useState<Match | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use a default sport type for the hook, then override with actual sport theme when match loads
  const defaultSportTheme = useSportTheme(match?.sport || SportType.FOOTBALL);
  const sportTheme = match ? defaultSportTheme : null;

  useEffect(() => {
    loadMatchData();
  }, [id]);

  const loadMatchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load match details
      const matchData = await matchService.getMatchById(id);
      
      if (!matchData) {
        setError('Match not found');
        setLoading(false);
        return;
      }

      setMatch(matchData);

      // Load existing prediction if available
      const existingPrediction = await predictionService.getPredictionByMatchId(id);
      setPrediction(existingPrediction);

      setLoading(false);
    } catch (err: any) {
      console.error('Error loading match data:', err);
      const errorMessage = err?.userMessage || err?.message || 'Failed to load match details';
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handlePredictionChange = async (predictionOption: PredictionOption) => {
    if (!match) return;

    try {
      if (prediction) {
        // Update existing prediction
        const updatedPrediction = await predictionService.updatePrediction(
          prediction.id,
          predictionOption,
          match
        );
        setPrediction(updatedPrediction);
      } else {
        // Save new prediction
        const newPrediction = await predictionService.savePrediction(
          {
            matchId: match.id,
            prediction: predictionOption,
          },
          match
        );
        setPrediction(newPrediction);
      }
    } catch (err: any) {
      const errorMessage = err?.userMessage || err?.message || 'Failed to save prediction. Please try again.';
      Alert.alert('Prediction Error', errorMessage);
      console.error('Error saving prediction:', err);
    }
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen
          options={{
            title: 'Match Details',
            headerShown: true,
          }}
        />
        <LoadingSpinner />
      </View>
    );
  }

  if (error || !match) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Stack.Screen
          options={{
            title: 'Match Details',
            headerShown: true,
          }}
        />
        <ErrorState
          message={error || 'Match not found'}
          onRetry={loadMatchData}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          title: 'Match Details',
          headerShown: true,
          headerLeft: () => (
            <Pressable
              onPress={handleBackPress}
              style={styles.headerBackButton}
              accessibilityLabel="Go back"
              accessibilityRole="button"
            >
              <Ionicons name="arrow-back" size={24} color={colors.text} />
            </Pressable>
          ),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        accessible={false}
      >
        {/* Match Header with Gradient */}
        {sportTheme && (
          <Animated.View entering={FadeIn.duration(400)}>
            <LinearGradient
              colors={sportTheme.colors.gradient as readonly [string, string, ...string[]]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.headerGradient}
              accessible={false}
            >
            <View 
              style={styles.matchHeader}
              accessible={true}
              accessibilityRole="header"
              accessibilityLabel={`Match details: ${match.homeTeam.name} versus ${match.awayTeam.name}, ${match.league.name}, ${match.league.country}, ${formatMatchDateTime(match.dateTime)}${match.venue ? `, at ${match.venue}` : ''}, status: ${match.status}`}
            >
              {/* League Badge */}
              <View style={styles.leagueBadgeContainer}>
                <LeagueBadge
                  league={match.league.name}
                  country={match.league.country}
                  size="medium"
                />
              </View>

              {/* Teams */}
              <View style={styles.teamsContainer} accessible={false}>
                <View style={styles.teamSection} accessible={false}>
                  <Text 
                    style={styles.teamName} 
                    numberOfLines={2}
                    accessibilityElementsHidden={true}
                    importantForAccessibility="no"
                  >
                    {match.homeTeam.name}
                  </Text>
                  <Text 
                    style={styles.teamLabel}
                    accessibilityElementsHidden={true}
                    importantForAccessibility="no"
                  >
                    Home
                  </Text>
                </View>

                <View style={styles.vsContainer} accessible={false}>
                  <Text 
                    style={styles.vsText}
                    accessibilityElementsHidden={true}
                    importantForAccessibility="no"
                  >
                    VS
                  </Text>
                </View>

                <View style={styles.teamSection} accessible={false}>
                  <Text 
                    style={styles.teamName} 
                    numberOfLines={2}
                    accessibilityElementsHidden={true}
                    importantForAccessibility="no"
                  >
                    {match.awayTeam.name}
                  </Text>
                  <Text 
                    style={styles.teamLabel}
                    accessibilityElementsHidden={true}
                    importantForAccessibility="no"
                  >
                    Away
                  </Text>
                </View>
              </View>

              {/* Date and Time */}
              <View 
                style={styles.dateTimeContainer}
                accessibilityElementsHidden={true}
                importantForAccessibility="no"
              >
                <View style={styles.dateTimeRow}>
                  <Ionicons name="time-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.dateTimeText}>{formatMatchDateTime(match.dateTime)}</Text>
                </View>
              </View>

              {/* Venue */}
              {match.venue && (
                <View 
                  style={styles.venueContainer}
                  accessibilityElementsHidden={true}
                  importantForAccessibility="no"
                >
                  <Ionicons name="location-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.venueText}>{match.venue}</Text>
                </View>
              )}

              {/* Match Status */}
              <View 
                style={[styles.statusBadge, getStatusBadgeStyle(match.status)]}
                accessibilityElementsHidden={true}
                importantForAccessibility="no"
              >
                <Text style={styles.statusText}>{match.status.toUpperCase()}</Text>
              </View>
            </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Prediction Section */}
        <AnimatedView 
          style={[styles.predictionSection, { backgroundColor: colors.card }]}
          entering={FadeInDown.delay(200).duration(400).springify()}
        >
          <PredictionSelector
            match={match}
            currentPrediction={prediction || undefined}
            onPredictionChange={handlePredictionChange}
          />
        </AnimatedView>

        {/* Prediction Info */}
        {prediction && (
          <AnimatedView 
            style={[styles.predictionInfo, { backgroundColor: colors.card }]}
            entering={FadeInDown.delay(300).duration(400).springify()}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`Your prediction was made on ${formatMatchDateTime(prediction.timestamp)}`}
          >
            <Text style={[styles.predictionInfoTitle, { color: colors.text }]}>
              Your Prediction
            </Text>
            <Text style={[styles.predictionInfoText, { color: colors.text }]}>
              Made {formatMatchDateTime(prediction.timestamp)}
            </Text>
          </AnimatedView>
        )}
      </ScrollView>
    </View>
  );
}

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'upcoming':
      return { backgroundColor: 'rgba(76, 175, 80, 0.9)' };
    case 'live':
      return { backgroundColor: 'rgba(244, 67, 54, 0.9)' };
    case 'finished':
      return { backgroundColor: 'rgba(158, 158, 158, 0.9)' };
    case 'postponed':
      return { backgroundColor: 'rgba(255, 193, 7, 0.9)' };
    default:
      return { backgroundColor: 'rgba(158, 158, 158, 0.9)' };
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xl,
  },
  headerBackButton: {
    padding: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  headerGradient: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  matchHeader: {
    alignItems: 'center',
  },
  leagueBadgeContainer: {
    marginBottom: Spacing.lg,
  },
  teamsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: Spacing.lg,
  },
  teamSection: {
    flex: 1,
    alignItems: 'center',
  },
  teamName: {
    ...Typography.h2,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  teamLabel: {
    ...Typography.caption,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  vsContainer: {
    paddingHorizontal: Spacing.md,
  },
  vsText: {
    ...Typography.h3,
    color: '#FFFFFF',
    fontWeight: '700',
    opacity: 0.9,
  },
  dateTimeContainer: {
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dateTimeText: {
    ...Typography.body,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  venueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  venueText: {
    ...Typography.body,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
    marginTop: Spacing.sm,
  },
  statusText: {
    ...Typography.caption,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 1,
  },
  predictionSection: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  predictionInfo: {
    marginTop: Spacing.md,
    marginHorizontal: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  predictionInfoTitle: {
    ...Typography.bodyBold,
    marginBottom: Spacing.xs,
  },
  predictionInfoText: {
    ...Typography.caption,
    opacity: 0.7,
  },
});
