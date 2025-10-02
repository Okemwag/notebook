import { getSportConfig } from '@/constants/sports';
import { Spacing, Typography } from '@/constants/theme';
import { SportType } from '@/types/sport';
import { LinearGradient } from 'expo-linear-gradient';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, StyleSheet, useColorScheme } from 'react-native';
import Animated, {
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withSpring
} from 'react-native-reanimated';
import { ThemedText } from './themed-text';

interface SportCardProps {
  sport: SportType;
  onPress: () => void;
  index?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function SportCard({ sport, onPress, index = 0 }: SportCardProps) {
  const colorScheme = useColorScheme();
  const sportConfig = getSportConfig(sport);
  const scale = useSharedValue(1);

  // Get gradient colors based on color scheme
  const gradientColors = colorScheme === 'dark' 
    ? sportConfig.gradientColors.dark 
    : sportConfig.gradientColors.light;

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(0.95, {
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

  return (
    <AnimatedPressable
      entering={FadeInUp.delay(index * 100).duration(500).springify()}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={[styles.container, animatedStyle]}
      accessibilityRole="button"
      accessibilityLabel={`View ${sportConfig.name} matches`}
      accessibilityHint={`Double tap to open the ${sportConfig.name} matches screen`}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SymbolView
          name={sportConfig.icon}
          size={64}
          type="hierarchical"
          tintColor="white"
          style={styles.icon}
          accessibilityLabel={`${sportConfig.name} icon`}
        />
        <ThemedText style={styles.text}>{sportConfig.name}</ThemedText>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 160,
    height: 160,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  icon: {
    marginBottom: Spacing.sm,
  },
  text: {
    ...Typography.h3,
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
  },
});
