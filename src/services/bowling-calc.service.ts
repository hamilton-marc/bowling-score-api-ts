import { FrameScore, ScoreCard, ThrowTally } from '../entities';

/**
 * The purpose of this class is to manage the business logic for calculating a bowling score.
 * As a best practice, this class does not keep state, so it must be passed the entire state
 * of a player's game in order to compute the score.
 * 
 */

 export class BowlingScoreCalculator {
    constructor() {
    }

    public computeFrameScore(throwTally: ThrowTally, frameIndex: number): number {
        let frameScore: number = 0;
        const frameThrows: Array<number> = throwTally.getFrame(frameIndex);

        frameScore = frameThrows[0] + frameThrows[1];

        return frameScore;
    }

    public computeFinalScore(throwTally: ThrowTally): number {
        let finalScore: number = 0;

        for (let i: number = 0; i < ThrowTally.MAX_THROWS; i++) {
            const throwValue: number = throwTally.getThrow(i);

            if (throwValue >= 0) {
                finalScore += throwValue; 
            }
        }

        return finalScore;
    }

    public computeScoreCard(throwTally: ThrowTally): ScoreCard {
        const scoreCard = new ScoreCard();
        let scoreTotal = 0;

        for (let i: number = 0; i < ThrowTally.MAX_FRAMES; i++) {
            const frameThrows: number[] = throwTally.getFrame(i);
            // Sum up the throws for the frame
            let frameScoreValue: number = frameThrows.reduce(
                (accumulater: number, currentValue: number) => {
                    return (accumulater + currentValue);
                 });

            // Handle spare case
            if (frameScoreValue === ThrowTally.MAX_PINS && i < ThrowTally.MAX_FRAMES - 1) {
                frameScoreValue += throwTally.getFrame(i+1)[0];
            }

            scoreTotal += frameScoreValue;

            const frameScore: FrameScore = new FrameScore(frameThrows, scoreTotal);

            scoreCard.addFrameScore(frameScore);
            scoreCard.finalScore = scoreTotal;
            scoreCard.progressScore = scoreTotal;
        }

        return scoreCard;
    }
}