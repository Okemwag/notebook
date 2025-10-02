import { SPORT_CONFIGS } from '@/constants/sports';
import { useSportTheme } from '@/hooks/use-sport-theme';
import { Match, MatchStatus } from '@/types/match';
import { Prediction, PredictionOption } from '@/types/prediction';
import React, { useState } from 'react';
import {
    Pressable,
    StyleSheet,
    Text,
    View
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withSpring,
} from 'react-native-reanimated';

interface PredictionSelectorProps {
  match: Match;
  currentPrediction?: Prediction;
  onPredictionChange: (prediction: PredictionOption) => void;
  disabled?: boolean;
}

export function PredictionSelector({
  match,
  currentPrediction,
  onPredictionChange,
  disabled = false,
}: PredictionSelectorProps) {
  const sportTheme = useSportTheme(match.sport);
  const sportConfig = SPORT_CONFIGS[match.sport];
  const [selectedOption, setSelectedOption] = useState<PredictionOption | null>(
    currentPrediction?.prediction || null
  );

  // Animation values for confirmation feedback
  const confirmationScale = useSharedValue(1);

  // Check if match has started or finished
  const isMatchDisabled =
    disabled ||
    match.status === MatchStatus.LIVE ||
    match.status === MatchStatus.FINISHED;

  // Determine available prediction options based on sport
  const predictionOptions: Array<{
    option: PredictionOption;
    label: string;
  }> = sportConfig.supportsDraw
    ? [
        { option: PredictionOption.HOME_WIN, label: match.homeTeam.name },
        { option: PredictionOption.DRAW, label: 'Draw' },
        { option: PredictionOption.AWAY_WIN, label: match.awayTeam.name },
      ]
    : [
        { option: PredictionOption.HOME_WIN, label: match.homeTeam.name },
        { option: PredictionOption.AWAY_WIN, label: match.awayTeam.name },
      ];

  const handlePredictionSelect = (option: PredictionOption) => {
    if (isMatchDisabled) return;

    setSelectedOption(option);

    // Trigger confirmation animation
    confirmationScale.value = withSequence(
      withSpring(1.1, { damping: 10, stiffness: 200 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );

    // Call the callback
    onPredictionChange(option);
  };

  const confirmationAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: confirmationScale.value }],
    };
  });

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: sportTheme.colors.text }]}>
        Make Your Prediction
      </Text>

      {isMatchDisabled && (
        <Text style={[styles.disabledText, { color: sportTheme.colors.text }]}>
          {match.status === MatchStatus.LIVE
            ? 'Match is currently live'
            : match.status === MatchStatus.FINISHED
            ? 'Match has finished'
            : 'Predictions are closed'}
        </Text>
      )}

      <View
        style={[
          styles.optionsContainer,
          !sportConfig.supportsDraw && styles.optionsContainerNoDrawn,
        ]}
      >
        {predictionOptions.map(({ option, label }) => {
          const isSelected = selectedOption === option;

          return (
            <Animated.View
              key={option}
              style={[
                styles.optionWrapper,
                !sportConfig.supportsDraw && styles.optionWrapperNoDrawn,
                isSelected && confirmationAnimatedStyle,
              ]}
            >
              <Pressable
                onPress={() => handlePredictionSelect(option)}
                disabled={isMatchDisabled}
                style={({ pressed }) => [
                  styles.optionButton,
                  isSelected && {
                    backgroundColor: sportTheme.colors.primary,
                    borderColor: sportTheme.colors.primary,
                  },
                  !isSelected && {
                    backgroundColor: 'transparent',
                    borderColor: sportTheme.colors.border,
                  },
                  isMatchDisabled && {
                    backgroundColor: sportTheme.isDark ? '#2C2C2C' : '#F5F5F5',
                    borderColor: sportTheme.colors.border,
                    opacity: 0.5,
                  },
                  pressed && !isMatchDisabled && styles.optionButtonPressed,
                ]}
                accessibilityLabel={`Predict ${label}`}
                accessibilityRole="button"
                accessibilityState={{
                  selected: isSelected,
                  disabled: isMatchDisabled,
                }}
                accessibilityHint={isMatchDisabled ? undefined : `Double tap to predict ${label} will win`}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                    !isSelected && { color: sportTheme.colors.text },
                    isMatchDisabled && {
                      color: sportTheme.isDark ? '#757575' : '#BDBDBD',
                    },
                  ]}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {label}
                </Text>
              </Pressable>
            </Animated.View>
          );
        })}
      </View>

      {selectedOption && !isMatchDisabled && (
        <Animated.View style={[styles.confirmationContainer, confirmationAnimatedStyle]}>
          <Text style={[styles.confirmationText, { color: sportTheme.colors.success }]}>
            ✓ Prediction saved
          </Text>
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
    letterSpacing: -0.2,
    marginBottom: 16,
    textAlign: 'center',
  },
  disabledText: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
    letterSpacing: 0.1,
    marginBottom: 12,
    textAlign: 'center',
    opacity: 0.7,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  optionsContainerNoDrawn: {
    gap: 16,
  },
  optionWrapper: {
    flex: 1,
  },
  optionWrapperNoDrawn: {
    flex: 1,
  },
  optionButton: {
    minHeight: 48, // Meets 44x44 minimum touch target
    minWidth: 48,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
    letterSpacing: 0,
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  confirmationContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  confirmationText: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 24,
  },
});
