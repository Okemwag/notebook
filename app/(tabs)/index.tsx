import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, View, useColorScheme } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

import { SportCard } from '@/components/sport-card';
import { ThemedText } from '@/components/themed-text';
import { Spacing, Typography } from '@/constants/theme';
import { SportType } from '@/types/sport';

const AnimatedView = Animated.createAnimatedComponent(View);

export default function HomeScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleSportPress = (sport: SportType) => {
    // Navigate to sport-specific screen
    router.push(`/(tabs)/${sport}`);
  };

  const gradientColors = colorScheme === 'dark'
    ? ['#151718', '#1a1d1f', '#151718'] as const
    : ['#f8f9fa', '#ffffff', '#f8f9fa'] as const;

  return (
    <LinearGradient
      colors={gradientColors}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
      accessible={false}
    >
      <AnimatedView 
        style={styles.header} 
        entering={FadeIn.duration(600)}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel="Sports Predictions app. Choose your sport and start predicting"
      >
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          contentFit="contain"
          accessible={true}
          accessibilityLabel="Sports Predictions logo"
          accessibilityRole="image"
        />
        <ThemedText style={styles.title}>Sports Predictions</ThemedText>
        <ThemedText style={styles.subtitle}>
          Choose your sport and start predicting
        </ThemedText>
      </AnimatedView>

      <View 
        style={styles.gridContainer}
        accessible={false}
      >
        <View style={styles.row} accessible={false}>
          <SportCard
            sport={SportType.FOOTBALL}
            onPress={() => handleSportPress(SportType.FOOTBALL)}
            index={0}
          />
          <SportCard
            sport={SportType.BASKETBALL}
            onPress={() => handleSportPress(SportType.BASKETBALL)}
            index={1}
          />
        </View>
        <View style={styles.row} accessible={false}>
          <SportCard
            sport={SportType.TENNIS}
            onPress={() => handleSportPress(SportType.TENNIS)}
            index={2}
          />
          <SportCard
            sport={SportType.ICE_HOCKEY}
            onPress={() => handleSportPress(SportType.ICE_HOCKEY)}
            index={3}
          />
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Spacing.xxl,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: Spacing.md,
  },
  title: {
    ...Typography.h1,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    opacity: 0.7,
    textAlign: 'center',
  },
  gridContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
});
