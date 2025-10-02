import { mockMatches } from '@/constants/mock-data';
import { Match, MatchStatus } from '@/types/match';
import { SportType } from '@/types/sport';

/**
 * Custom error class for match service operations
 */
export class MatchServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public userMessage: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'MatchServiceError';
  }
}

interface CacheEntry {
  data: Match[];
  timestamp: number;
}

class MatchService {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  /**
   * Get all matches for a specific sport
   * @param sport - The sport type to filter by
   * @returns Promise resolving to array of matches for the specified sport
   * @throws MatchServiceError if operation fails
   */
  async getMatchesBySport(sport: SportType): Promise<Match[]> {
    try {
      const cacheKey = `sport_${sport}`;
      
      // Check cache first
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      // Simulate potential network delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Filter matches by sport
      const matches = mockMatches
        .filter((match) => match.sport === sport)
        .map(this.parseMatchDates);

      // Store in cache
      this.setCache(cacheKey, matches);

      return matches;
    } catch (error) {
      throw new MatchServiceError(
        `Failed to fetch matches for ${sport}`,
        'FETCH_MATCHES_ERROR',
        'Unable to load matches. Please check your connection and try again.',
        error
      );
    }
  }

  /**
   * Get a single match by ID
   * @param id - The match ID
   * @returns Promise resolving to the match or null if not found
   * @throws MatchServiceError if operation fails
   */
  async getMatchById(id: string): Promise<Match | null> {
    try {
      // Simulate potential network delay
      await new Promise(resolve => setTimeout(resolve, 50));

      const match = mockMatches.find((match) => match.id === id);
      
      if (!match) {
        return null;
      }

      return this.parseMatchDates(match);
    } catch (error) {
      throw new MatchServiceError(
        `Failed to fetch match with ID ${id}`,
        'FETCH_MATCH_ERROR',
        'Unable to load match details. Please try again.',
        error
      );
    }
  }

  /**
   * Get upcoming matches across all sports, sorted by date
   * @param limit - Optional limit on number of matches to return
   * @returns Promise resolving to array of upcoming matches sorted by date
   * @throws MatchServiceError if operation fails
   */
  async getUpcomingMatches(limit?: number): Promise<Match[]> {
    try {
      const cacheKey = `upcoming_${limit || 'all'}`;
      
      // Check cache first
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }

      // Simulate potential network delay
      await new Promise(resolve => setTimeout(resolve, 100));

      const now = new Date();

      // Filter for upcoming matches and sort by date
      let matches = mockMatches
        .filter((match) => {
          const matchDate = new Date(match.dateTime);
          return match.status === MatchStatus.UPCOMING && matchDate > now;
        })
        .map(this.parseMatchDates)
        .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime());

      // Apply limit if specified
      if (limit && limit > 0) {
        matches = matches.slice(0, limit);
      }

      // Store in cache
      this.setCache(cacheKey, matches);

      return matches;
    } catch (error) {
      throw new MatchServiceError(
        'Failed to fetch upcoming matches',
        'FETCH_UPCOMING_ERROR',
        'Unable to load upcoming matches. Please try again.',
        error
      );
    }
  }

  /**
   * Refresh match data by clearing the cache
   */
  async refreshMatches(): Promise<void> {
    this.cache.clear();
  }

  /**
   * Parse match dates to ensure they are Date objects
   * @param match - The match object
   * @returns Match with parsed dates
   */
  private parseMatchDates(match: Match): Match {
    return {
      ...match,
      dateTime: new Date(match.dateTime),
    };
  }

  /**
   * Get data from cache if valid
   * @param key - Cache key
   * @returns Cached data or null if expired/not found
   */
  private getFromCache(key: string): Match[] | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const isExpired = now - entry.timestamp > this.CACHE_TTL;

    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Store data in cache
   * @param key - Cache key
   * @param data - Data to cache
   */
  private setCache(key: string, data: Match[]): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }
}

// Export singleton instance
export const matchService = new MatchService();
export default matchService;
