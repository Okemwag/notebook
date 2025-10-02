import { PredictionError, predictionService } from '@/services/prediction-service';
import { Match } from '@/types/match';
import { Prediction, PredictionOption } from '@/types/prediction';
import { useCallback, useEffect, useState } from 'react';

interface UsePredictionsState {
  predictions: Prediction[];
  loading: boolean;
  error: string | null;
}

interface UsePredictionsReturn extends UsePredictionsState {
  refresh: () => Promise<void>;
  savePrediction: (
    predictionData: Omit<Prediction, 'id' | 'timestamp'>,
    match: Match
  ) => Promise<Prediction | null>;
  updatePrediction: (
    id: string,
    prediction: PredictionOption,
    match: Match
  ) => Promise<Prediction | null>;
  deletePrediction: (id: string) => Promise<boolean>;
}

/**
 * Custom hook for managing all user predictions
 * @returns Object containing predictions, loading state, error state, and CRUD functions
 */
export function usePredictions(): UsePredictionsReturn {
  const [state, setState] = useState<UsePredictionsState>({
    predictions: [],
    loading: true,
    error: null,
  });

  const fetchPredictions = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const predictions = await predictionService.getAllPredictions();
      setState({
        predictions,
        loading: false,
        error: null,
      });
    } catch (error) {
      setState({
        predictions: [],
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load predictions',
      });
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchPredictions();
  }, [fetchPredictions]);

  const savePrediction = useCallback(
    async (
      predictionData: Omit<Prediction, 'id' | 'timestamp'>,
      match: Match
    ): Promise<Prediction | null> => {
      try {
        const newPrediction = await predictionService.savePrediction(predictionData, match);
        await fetchPredictions();
        return newPrediction;
      } catch (error) {
        const errorMessage = error instanceof PredictionError
          ? error.message
          : 'Failed to save prediction';
        setState(prev => ({ ...prev, error: errorMessage }));
        return null;
      }
    },
    [fetchPredictions]
  );

  const updatePrediction = useCallback(
    async (
      id: string,
      prediction: PredictionOption,
      match: Match
    ): Promise<Prediction | null> => {
      try {
        const updatedPrediction = await predictionService.updatePrediction(id, prediction, match);
        await fetchPredictions();
        return updatedPrediction;
      } catch (error) {
        const errorMessage = error instanceof PredictionError
          ? error.message
          : 'Failed to update prediction';
        setState(prev => ({ ...prev, error: errorMessage }));
        return null;
      }
    },
    [fetchPredictions]
  );

  const deletePrediction = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        await predictionService.deletePrediction(id);
        await fetchPredictions();
        return true;
      } catch (error) {
        const errorMessage = error instanceof PredictionError
          ? error.message
          : 'Failed to delete prediction';
        setState(prev => ({ ...prev, error: errorMessage }));
        return false;
      }
    },
    [fetchPredictions]
  );

  useEffect(() => {
    fetchPredictions();
  }, [fetchPredictions]);

  return {
    ...state,
    refresh,
    savePrediction,
    updatePrediction,
    deletePrediction,
  };
}

/**
 * Custom hook for managing a prediction for a specific match
 * @param matchId - The match ID to get prediction for
 * @returns Object containing prediction, loading state, error state, and save/update/delete functions
 */
export function useMatchPrediction(matchId: string | null): {
  prediction: Prediction | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  savePrediction: (
    predictionData: Omit<Prediction, 'id' | 'timestamp'>,
    match: Match
  ) => Promise<Prediction | null>;
  updatePrediction: (
    prediction: PredictionOption,
    match: Match
  ) => Promise<Prediction | null>;
  deletePrediction: () => Promise<boolean>;
} {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPrediction = useCallback(async () => {
    if (!matchId) {
      setPrediction(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const fetchedPrediction = await predictionService.getPredictionByMatchId(matchId);
      setPrediction(fetchedPrediction);
      setLoading(false);
    } catch (error) {
      setPrediction(null);
      setLoading(false);
      setError(error instanceof Error ? error.message : 'Failed to load prediction');
    }
  }, [matchId]);

  const refresh = useCallback(async () => {
    await fetchPrediction();
  }, [fetchPrediction]);

  const savePrediction = useCallback(
    async (
      predictionData: Omit<Prediction, 'id' | 'timestamp'>,
      match: Match
    ): Promise<Prediction | null> => {
      try {
        const newPrediction = await predictionService.savePrediction(predictionData, match);
        await fetchPrediction();
        return newPrediction;
      } catch (error) {
        const errorMessage = error instanceof PredictionError
          ? error.message
          : 'Failed to save prediction';
        setError(errorMessage);
        return null;
      }
    },
    [fetchPrediction]
  );

  const updatePrediction = useCallback(
    async (
      predictionOption: PredictionOption,
      match: Match
    ): Promise<Prediction | null> => {
      if (!prediction) {
        setError('No prediction to update');
        return null;
      }

      try {
        const updatedPrediction = await predictionService.updatePrediction(
          prediction.id,
          predictionOption,
          match
        );
        await fetchPrediction();
        return updatedPrediction;
      } catch (error) {
        const errorMessage = error instanceof PredictionError
          ? error.message
          : 'Failed to update prediction';
        setError(errorMessage);
        return null;
      }
    },
    [prediction, fetchPrediction]
  );

  const deletePrediction = useCallback(async (): Promise<boolean> => {
    if (!prediction) {
      setError('No prediction to delete');
      return false;
    }

    try {
      await predictionService.deletePrediction(prediction.id);
      await fetchPrediction();
      return true;
    } catch (error) {
      const errorMessage = error instanceof PredictionError
        ? error.message
        : 'Failed to delete prediction';
      setError(errorMessage);
      return false;
    }
  }, [prediction, fetchPrediction]);

  useEffect(() => {
    fetchPrediction();
  }, [fetchPrediction]);

  return {
    prediction,
    loading,
    error,
    refresh,
    savePrediction,
    updatePrediction,
    deletePrediction,
  };
}

/**
 * Custom hook for getting prediction statistics
 * @returns Object containing stats, loading state, error state, and refresh function
 */
export function usePredictionStats(): {
  stats: {
    total: number;
    correct: number;
    pending: number;
    accuracy: number;
  } | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
} {
  const [stats, setStats] = useState<{
    total: number;
    correct: number;
    pending: number;
    accuracy: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const fetchedStats = await predictionService.getPredictionStats();
      setStats(fetchedStats);
      setLoading(false);
    } catch (error) {
      setStats(null);
      setLoading(false);
      setError(error instanceof Error ? error.message : 'Failed to load prediction stats');
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refresh,
  };
}
