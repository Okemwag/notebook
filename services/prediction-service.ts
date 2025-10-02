import { Match, MatchStatus } from '../types/match';
import { Prediction, PredictionOption } from '../types/prediction';
import { StorageError, storageService } from './storage-service';

/**
 * Custom error class for prediction operations
 */
export class PredictionError extends Error {
  constructor(
    message: string,
    public code: string,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'PredictionError';
  }
}

/**
 * Storage key for predictions in AsyncStorage
 */
const PREDICTIONS_STORAGE_KEY = 'predictions';

/**
 * Service for managing user predictions with validation and persistence
 */
export class PredictionService {
  /**
   * Generate a unique ID for a prediction
   * @returns Unique prediction ID
   */
  private generateId(): string {
    return `pred_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Load all predictions from storage
   * @returns Array of predictions
   */
  private async loadPredictions(): Promise<Prediction[]> {
    try {
      const predictions = await storageService.getItem<Prediction[]>(PREDICTIONS_STORAGE_KEY);
      if (!predictions) {
        return [];
      }
      
      // Convert timestamp strings back to Date objects
      return predictions.map(pred => ({
        ...pred,
        timestamp: new Date(pred.timestamp)
      }));
    } catch (error) {
      if (error instanceof StorageError) {
        throw new PredictionError(
          'Failed to load predictions from storage',
          'LOAD_PREDICTIONS_ERROR',
          error
        );
      }
      throw error;
    }
  }

  /**
   * Save predictions array to storage
   * @param predictions - Array of predictions to save
   */
  private async savePredictions(predictions: Prediction[]): Promise<void> {
    try {
      await storageService.setItem(PREDICTIONS_STORAGE_KEY, predictions);
    } catch (error) {
      if (error instanceof StorageError) {
        throw new PredictionError(
          'Failed to save predictions to storage',
          'SAVE_PREDICTIONS_ERROR',
          error
        );
      }
      throw error;
    }
  }

  /**
   * Validate if a prediction can be made for a match
   * @param match - Match to validate
   * @throws PredictionError if match has started or finished
   */
  private validateMatchStatus(match: Match): void {
    if (match.status === MatchStatus.LIVE) {
      throw new PredictionError(
        'Cannot make predictions on live matches',
        'MATCH_ALREADY_STARTED'
      );
    }
    
    if (match.status === MatchStatus.FINISHED) {
      throw new PredictionError(
        'Cannot make predictions on finished matches',
        'MATCH_ALREADY_FINISHED'
      );
    }
    
    if (match.status === MatchStatus.POSTPONED) {
      throw new PredictionError(
        'Cannot make predictions on postponed matches',
        'MATCH_POSTPONED'
      );
    }
  }

  /**
   * Save a new prediction
   * @param predictionData - Prediction data without id and timestamp
   * @param match - Match object for validation
   * @returns Saved prediction with generated id and timestamp
   * @throws PredictionError if validation fails or save fails
   */
  async savePrediction(
    predictionData: Omit<Prediction, 'id' | 'timestamp'>,
    match: Match
  ): Promise<Prediction> {
    // Validate match status
    this.validateMatchStatus(match);

    // Load existing predictions
    const predictions = await this.loadPredictions();

    // Check if prediction already exists for this match
    const existingPrediction = predictions.find(
      pred => pred.matchId === predictionData.matchId
    );

    if (existingPrediction) {
      throw new PredictionError(
        'Prediction already exists for this match. Use updatePrediction to modify it.',
        'PREDICTION_ALREADY_EXISTS'
      );
    }

    // Create new prediction
    const newPrediction: Prediction = {
      ...predictionData,
      id: this.generateId(),
      timestamp: new Date()
    };

    // Add to predictions array
    predictions.push(newPrediction);

    // Save to storage
    await this.savePredictions(predictions);

    return newPrediction;
  }

  /**
   * Get prediction for a specific match
   * @param matchId - Match ID to find prediction for
   * @returns Prediction if found, null otherwise
   */
  async getPredictionByMatchId(matchId: string): Promise<Prediction | null> {
    const predictions = await this.loadPredictions();
    const prediction = predictions.find(pred => pred.matchId === matchId);
    return prediction || null;
  }

  /**
   * Get all user predictions
   * @returns Array of all predictions sorted by timestamp (newest first)
   */
  async getAllPredictions(): Promise<Prediction[]> {
    const predictions = await this.loadPredictions();
    
    // Sort by timestamp, newest first
    return predictions.sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  /**
   * Update an existing prediction
   * @param id - Prediction ID to update
   * @param prediction - New prediction option
   * @param match - Match object for validation
   * @returns Updated prediction
   * @throws PredictionError if prediction not found or match has started
   */
  async updatePrediction(
    id: string,
    prediction: PredictionOption,
    match: Match
  ): Promise<Prediction> {
    // Validate match status
    this.validateMatchStatus(match);

    // Load existing predictions
    const predictions = await this.loadPredictions();

    // Find prediction to update
    const predictionIndex = predictions.findIndex(pred => pred.id === id);

    if (predictionIndex === -1) {
      throw new PredictionError(
        'Prediction not found',
        'PREDICTION_NOT_FOUND'
      );
    }

    // Update prediction
    predictions[predictionIndex] = {
      ...predictions[predictionIndex],
      prediction,
      timestamp: new Date() // Update timestamp to reflect modification
    };

    // Save to storage
    await this.savePredictions(predictions);

    return predictions[predictionIndex];
  }

  /**
   * Delete a prediction
   * @param id - Prediction ID to delete
   * @throws PredictionError if prediction not found
   */
  async deletePrediction(id: string): Promise<void> {
    // Load existing predictions
    const predictions = await this.loadPredictions();

    // Find prediction to delete
    const predictionIndex = predictions.findIndex(pred => pred.id === id);

    if (predictionIndex === -1) {
      throw new PredictionError(
        'Prediction not found',
        'PREDICTION_NOT_FOUND'
      );
    }

    // Remove prediction
    predictions.splice(predictionIndex, 1);

    // Save to storage
    await this.savePredictions(predictions);
  }

  /**
   * Get prediction statistics
   * @returns Statistics about user predictions
   */
  async getPredictionStats(): Promise<{
    total: number;
    correct: number;
    pending: number;
    accuracy: number;
  }> {
    const predictions = await this.loadPredictions();

    const total = predictions.length;
    const correct = predictions.filter(pred => pred.isCorrect === true).length;
    const pending = predictions.filter(pred => pred.isCorrect === undefined).length;
    const accuracy = total > 0 ? (correct / (total - pending)) * 100 : 0;

    return {
      total,
      correct,
      pending,
      accuracy: isNaN(accuracy) ? 0 : accuracy
    };
  }

  /**
   * Clear all predictions (useful for testing or reset)
   */
  async clearAllPredictions(): Promise<void> {
    await this.savePredictions([]);
  }
}

// Export singleton instance
export const predictionService = new PredictionService();
