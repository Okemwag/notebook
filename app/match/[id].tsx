import { LeagueBadge } from '@/components/league-badge';
import { LoadingSpinner } from '@/components/loading-spinner';
import { PredictionSelector } from '@/components/prediction-selector';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSportTheme } from '@/hooks/use-sport-theme';
import { matchService } from '@/services/match-service';
import { PredictionError, predictionService } from '@/services/prediction-service';
import { Match } from '@/types/match';
import { Prediction, PredictionOption } from '@/types/prediction';
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

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [match, setMatch] = useState<Match | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const sportTheme = match ? useSportTheme(match.sport) : null;

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
    } catch (err) {
      console.error('Error loading match data:', err);
      setError('Failed to load match details');
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
    } catch (err) {
      if (err instanceof PredictionError) {
        Alert.alert('Prediction Error', err.message);
      } else {
        Alert.alert('Error', 'Failed to save prediction. Please try again.');
      }
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
      <View style={[styles.container, styles.centerContent, { backgroundColor: colors.background }]}>
        <Stack.Screen
          options={{
            title: 'Match Details',
            headerShown: true,
          }}
        />
        <Text style={[styles.errorText, { color: colors.text }]}>
          {error || 'Match not found'}
        </Text>
        <Pressable
          onPress={handleBackPress}
          style={[styles.backButton, { backgroundColor: colors.tint }]}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </Pressable>
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
      >
        {/* Match Header with Gradient */}
        {sportTheme && (
          <LinearGradient
            colors={sportTheme.colors.gradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerGradient}
          >
            <View style={styles.matchHeader}>
              {/* League Badge */}
              <View style={styles.leagueBadgeContainer}>
                <LeagueBadge
                  league={match.league.name}
                  country={match.league.country}
                  size="medium"
                />
              </View>

              {/* Teams */}
              <View style={styles.teamsContainer}>
                <View style={styles.teamSection}>
                  <Text style={styles.teamName} numberOfLines={2}>
                    {match.homeTeam.name}
                  </Text>
                  <Text style={styles.teamLabel}>Home</Text>
                </View>

                <View style={styles.vsContainer}>
                  <Text style={styles.vsText}>VS</Text>
                </View>

                <View style={styles.teamSection}>
                  <Text style={styles.teamName} numberOfLines={2}>
                    {match.awayTeam.name}
                  </Text>
                  <Text style={styles.teamLabel}>Away</Text>
                </View>
              </View>

              {/* Date and Time */}
              <View style={styles.dateTimeContainer}>
                <View style={styles.dateTimeRow}>
                  <Ionicons name="time-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.dateTimeText}>{formatMatchDateTime(match.dateTime)}</Text>
                </View>
              </View>

              {/* Venue */}
              {match.venue && (
                <View style={styles.venueContainer}>
                  <Ionicons name="location-outline" size={18} color="#FFFFFF" />
                  <Text style={styles.venueText}>{match.venue}</Text>
                </View>
              )}

              {/* Match Status */}
              <View style={[styles.statusBadge, getStatusBadgeStyle(match.status)]}>
                <Text style={styles.statusText}>{match.status.toUpperCase()}</Text>
              </View>
            </View>
          </LinearGradient>
        )}

        {/* Prediction Section */}
        <View style={[styles.predictionSection, { backgroundColor: colors.card }]}>
          <PredictionSelector
            match={match}
            currentPrediction={prediction || undefined}
            onPredictionChange={handlePredictionChange}
          />
        </View>

        {/* Prediction Info */}
        {prediction && (
          <View style={[styles.predictionInfo, { backgroundColor: colors.card }]}>
            <Text style={[styles.predictionInfoTitle, { color: colors.text }]}>
              Your Prediction
            </Text>
            <Text style={[styles.predictionInfoText, { color: colors.text }]}>
              Made {formatMatchDateTime(prediction.timestamp)}
            </Text>
          </View>
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
  errorText: {
    ...Typography.h3,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  backButton: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: 24,
  },
  backButtonText: {
    ...Typography.bodyBold,
    color: '#FFFFFF',
  },
});
