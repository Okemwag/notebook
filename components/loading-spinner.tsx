import { ThemedText } from '@/components/themed-text';
import { getSportConfig } from '@/constants/sports';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { SportType } from '@/types/sport';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';

interface LoadingSpinnerProps {
  sport?: SportType;
  text?: string;
  size?: 'small' | 'medium' | 'large';
}

export function LoadingSpinner({ sport, text, size = 'medium' }: LoadingSpinnerProps) {
  const colorScheme = useColorScheme();
  const rotation = useSharedValue(0);

  // Get sport-specific color or use default tint color
  const spinnerColor = sport
    ? getSportConfig(sport).color
    : Colors[colorScheme ?? 'light'].tint;

  // Determine spinner size
  const spinnerSize = size === 'small' ? 24 : size === 'large' ? 48 : 36;

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1000,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [rotation]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  return (
    <View style={styles.container}>
      <Animated.View style={animatedStyle}>
        <ActivityIndicator size={spinnerSize} color={spinnerColor} />
      </Animated.View>
      {text && (
        <ThemedText style={[styles.text, Typography.caption]}>
          {text}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
  },
  text: {
    marginTop: Spacing.sm,
    textAlign: 'center',
  },
});
