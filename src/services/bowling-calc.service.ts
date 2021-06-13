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

    public computeFrameScore(scoreCard: ScoreCard, frameIndex: number): number {
        let frameScore: number = 0;
        const frameThrows: Array<number> = scoreCard.getFrame(frameIndex);

        frameScore = frameThrows[0] + frameThrows[1];

        return frameScore;
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