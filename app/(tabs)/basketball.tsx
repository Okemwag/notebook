import { EmptyState } from '@/components/empty-state';
import { ErrorState } from '@/components/error-state';
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

export default function BasketballScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const sportConfig = getSportConfig(SportType.BASKETBALL);

  const { matches, loading, error, refresh } = useMatches(SportType.BASKETBALL);
  const { predictions } = usePredictions();
  const [refreshing, setRefreshing] = useState(false);

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
    <View 
      style={[styles.sectionHeader, { backgroundColor: colors.background }]}
      accessible={true}
      accessibilityRole="header"
      accessibilityLabel={`Matches for ${section.title}`}
    >
      <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
    </View>
  );

  const renderMatch = ({ item, index }: { item: Match; index: number }) => (
    <MatchCard
      match={item}
      prediction={getPredictionForMatch(item.id)}
      onPress={() => handleMatchPress(item.id)}
      index={index}
    />
  );

  const renderEmptyState = () => {
    if (loading) return null;

    return (
      <EmptyState
        title="No Matches Available"
        message="There are no upcoming basketball matches at the moment. Pull down to refresh."
        icon={sportConfig.icon}
        iconColor={sportConfig.color}
        actionText="Refresh"
        onAction={handleRefresh}
      />
    );
  };

  const renderErrorState = () => (
    <ErrorState
      message={error || 'Unable to load matches'}
      onRetry={handleRefresh}
    />
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
            sport={SportType.BASKETBALL}
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
      <View 
        style={styles.header}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel={`${sportConfig.name} matches`}
      >
        <SymbolView
          name={sportConfig.icon}
          size={32}
          tintColor={sportConfig.color}
          style={styles.headerIcon}
          accessibilityElementsHidden={true}
          importantForAccessibility="no"
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
            accessibilityLabel="Pull to refresh matches"
          />
        }
        stickySectionHeadersEnabled={true}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
        initialNumToRender={8}
        accessible={false}
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
});
