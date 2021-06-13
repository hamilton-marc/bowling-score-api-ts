import { ScoreCard } from '../entities';

/**
 * The purpose of this class is to manage the business logic for calculating a bowling score.
 * As a best practice, this class does not keep state, so it must be passed the entire state
 * of a player's game in order to compute the score.
 * 
 */

 export class BowlingScoreCalculator {
    constructor() {
    }

    public computeFinalScore(scoreCard: ScoreCard): number {
        let finalScore: number = 0;

        for (let i: number = 0; i < ScoreCard.MAX_THROWS; i++) {
            const throwValue: number = scoreCard.getThrow(i);

            if (throwValue >= 0) {
                finalScore += throwValue; 
            }
        }

        return finalScore;
    }
}