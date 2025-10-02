import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StyleSheet, View, useColorScheme } from 'react-native';

import { SportCard } from '@/components/sport-card';
import { ThemedText } from '@/components/themed-text';
import { Spacing, Typography } from '@/constants/theme';
import { SportType } from '@/types/sport';

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
    >
      <View style={styles.header}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          contentFit="contain"
        />
        <ThemedText style={styles.title}>Sports Predictions</ThemedText>
        <ThemedText style={styles.subtitle}>
          Choose your sport and start predicting
        </ThemedText>
      </View>

      <View style={styles.gridContainer}>
        <View style={styles.row}>
          <SportCard
            sport={SportType.FOOTBALL}
            onPress={() => handleSportPress(SportType.FOOTBALL)}
          />
          <SportCard
            sport={SportType.BASKETBALL}
            onPress={() => handleSportPress(SportType.BASKETBALL)}
          />
        </View>
        <View style={styles.row}>
          <SportCard
            sport={SportType.TENNIS}
            onPress={() => handleSportPress(SportType.TENNIS)}
          />
          <SportCard
            sport={SportType.ICE_HOCKEY}
            onPress={() => handleSportPress(SportType.ICE_HOCKEY)}
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
