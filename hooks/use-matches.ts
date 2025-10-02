import { matchService } from '@/services/match-service';
import { Match } from '@/types/match';
import { SportType } from '@/types/sport';
import { useCallback, useEffect, useState } from 'react';

interface UseMatchesState {
  matches: Match[];
  loading: boolean;
  error: string | null;
}

interface UseMatchesReturn extends UseMatchesState {
  refresh: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing match data for a specific sport
 * @param sport - The sport type to fetch matches for
 * @returns Object containing matches, loading state, error state, and refresh function
 */
export function useMatches(sport: SportType): UseMatchesReturn {
  const [state, setState] = useState<UseMatchesState>({
    matches: [],
    loading: true,
    error: null,
  });

  const fetchMatches = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const matches = await matchService.getMatchesBySport(sport);
      setState({
        matches,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        matches: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load matches',
      });
    }
  }, [sport]);

  const refresh = useCallback(async () => {
    await matchService.refreshMatches();
    await fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return {
    ...state,
    refresh,
  };
}

/**
 * Custom hook for fetching upcoming matches across all sports
 * @param limit - Optional limit on number of matches to return
 * @returns Object containing matches, loading state, error state, and refresh function
 */
export function useUpcomingMatches(limit?: number): UseMatchesReturn {
  const [state, setState] = useState<UseMatchesState>({
    matches: [],
    loading: true,
    error: null,
  });

  const fetchMatches = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const matches = await matchService.getUpcomingMatches(limit);
      setState({
        matches,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        matches: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load upcoming matches',
      });
    }
  }, [limit]);

  const refresh = useCallback(async () => {
    await matchService.refreshMatches();
    await fetchMatches();
  }, [fetchMatches]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  return {
    ...state,
    refresh,
  };
}

/**
 * Custom hook for fetching a single match by ID
 * @param matchId - The match ID to fetch
 * @returns Object containing match, loading state, error state, and refresh function
 */
export function useMatch(matchId: string | null): {
  match: Match | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatch = useCallback(async () => {
    if (!matchId) {
      setMatch(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedMatch = await matchService.getMatchById(matchId);
      setMatch(fetchedMatch);
      setLoading(false);
    } catch (error) {
      setMatch(null);
      setLoading(false);
      setError(error instanceof Error ? error.message : 'Failed to load match');
    }
  }, [matchId]);

  const refresh = useCallback(async () => {
    await matchService.refreshMatches();
    await fetchMatch();
  }, [fetchMatch]);

  useEffect(() => {
    fetchMatch();
  }, [fetchMatch]);

  return {
    match,
    loading,
    error,
    refresh,
  };
}
