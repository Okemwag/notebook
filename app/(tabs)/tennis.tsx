import { LoadingSpinner } from '@/components/loading-spinner';
import { MatchCard } from '@/components/match-card';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getSportConfig } from '@/constants/sports';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useMatches } from '@/hooks/use-matches';
import { usePredictions } from '@/hooks/use-predictions';
import { Match } from '@/types/match';
import { SportType } from '@/types/sport';
import { format, isSameDay, parseISO } from 'date-fns';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useMemo, useState } from 'react';
import {
    RefreshControl,
    SectionList,
    StyleSheet,
    View
} from 'react-native';

interface MatchSection {
  title: string;
  data: Match[];
}

export default function TennisScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const sportConfig = getSportConfig(SportType.TENNIS);

  const { matches, loading, error, refresh } = useMatches(SportType.TENNIS);
  const { predictions } = usePredictions();
  const [refreshing, setRefreshing] = useState(false);

  // Group matches by date
  const sections = useMemo(() => {
    if (!matches.length) return [];

    const grouped = matches.reduce((acc, match) => {
      const dateKey = format(match.dateTime, 'yyyy-MM-dd');
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(match);
      return acc;
    }, {} as Record<string, Match[]>);

    return Object.entries(grouped).map(([dateKey, matchesForDate]) => ({
      title: formatSectionDate(parseISO(dateKey)),
      data: matchesForDate,
    }));
  }, [matches]);

  const formatSectionDate = (date: Date): string => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (isSameDay(date, today)) {
      return 'Today';
    } else if (isSameDay(date, tomorrow)) {
      return 'Tomorrow';
    } else {
      return format(date, 'EEEE, MMM dd');
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const handleMatchPress = (matchId: string) => {
    router.push(`/match/${matchId}` as any);
  };

  const getPredictionForMatch = (matchId: string) => {
    return predictions.find(p => p.matchId === matchId);
  };

  const renderSectionHeader = ({ section }: { section: MatchSection }) => (
    <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
      <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
    </View>
  );

  const renderMatch = ({ item }: { item: Match }) => (
    <MatchCard
      match={item}
      prediction={getPredictionForMatch(item.id)}
      onPress={() => handleMatchPress(item.id)}
    />
  );

  const renderEmptyState = () => {
    if (loading) return null;

    return (
      <View style={styles.emptyContainer}>
        <SymbolView
          name={sportConfig.icon}
          size={64}
          tintColor={colors.icon}
          style={styles.emptyIcon}
        />
        <ThemedText style={styles.emptyTitle}>No Matches Available</ThemedText>
        <ThemedText style={styles.emptySubtitle}>
          There are no upcoming tennis matches at the moment.
        </ThemedText>
        <ThemedText style={styles.emptySubtitle}>
          Pull down to refresh.
        </ThemedText>
      </View>
    );
  };

  const renderErrorState = () => (
    <View style={styles.emptyContainer}>
      <ThemedText style={styles.emptyTitle}>Oops!</ThemedText>
      <ThemedText style={styles.emptySubtitle}>{error}</ThemedText>
      <ThemedText style={styles.emptySubtitle}>
        Pull down to try again.
      </ThemedText>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <SymbolView
            name={sportConfig.icon}
            size={32}
            tintColor={sportConfig.color}
            style={styles.headerIcon}
          />
          <ThemedText style={styles.headerTitle}>{sportConfig.name}</ThemedText>
        </View>
        <View style={styles.loadingContainer}>
          <LoadingSpinner
            sport={SportType.TENNIS}
            text="Loading matches..."
            size="large"
          />
        </View>
      </ThemedView>
    );
  }

  if (error && !matches.length) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <SymbolView
            name={sportConfig.icon}
            size={32}
            tintColor={sportConfig.color}
            style={styles.headerIcon}
          />
          <ThemedText style={styles.headerTitle}>{sportConfig.name}</ThemedText>
        </View>
        <SectionList
          sections={[]}
          renderItem={renderMatch}
          renderSectionHeader={renderSectionHeader}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={renderErrorState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={sportConfig.color}
              colors={[sportConfig.color]}
            />
          }
        />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <SymbolView
          name={sportConfig.icon}
          size={32}
          tintColor={sportConfig.color}
          style={styles.headerIcon}
        />
        <ThemedText style={styles.headerTitle}>{sportConfig.name}</ThemedText>
      </View>

      <SectionList
        sections={sections}
        renderItem={renderMatch}
        renderSectionHeader={renderSectionHeader}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={sportConfig.color}
            colors={[sportConfig.color]}
          />
        }
        stickySectionHeadersEnabled={true}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  headerIcon: {
    width: 32,
    height: 32,
  },
  headerTitle: {
    ...Typography.h2,
  },
  listContent: {
    paddingBottom: Spacing.lg,
    flexGrow: 1,
  },
  sectionHeader: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
  },
  sectionTitle: {
    ...Typography.bodyBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  emptyIcon: {
    marginBottom: Spacing.lg,
    opacity: 0.3,
  },
  emptyTitle: {
    ...Typography.h3,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  emptySubtitle: {
    ...Typography.body,
    opacity: 0.6,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
