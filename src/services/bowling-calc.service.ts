import { FrameScore, ScoreCard, ThrowTally } from '../entities';

/**
 * The purpose of this class is to manage the business logic for calculating a bowling score.
 * As a best practice, this class does not keep state, so it must be passed the entire state
 * of a player's game in order to compute the score.
 * 
 */

 export class BowlingScoreCalculator {
    constructor (
    ) {
    }

    private computeFrameScoreValue(throwTally: ThrowTally, frameIndex: number): number {
        const frameThrows: number[] = throwTally.getFrame(frameIndex);
    
        let frameScoreValue: number = frameThrows.reduce(
            (accumulater: number, currentValue: number) => {
                return (accumulater + currentValue);
             });

        // Handle spare case
        if (frameScoreValue === ThrowTally.MAX_PINS && frameIndex < ThrowTally.MAX_FRAMES - 1) {
            frameScoreValue += throwTally.getFrame(frameIndex + 1)[0];
        }

        return (frameScoreValue);
    }

    public computeScoreCard(throwTally: ThrowTally): ScoreCard {    
        const scoreCard = new ScoreCard();
        let scoreTotal = 0;

        for (let i: number = 0; i < ThrowTally.MAX_FRAMES; i++) {
            const frameThrows: number[] = throwTally.getFrame(i);
            let frameScoreValue: number = this.computeFrameScoreValue(throwTally, i);

            scoreTotal += frameScoreValue;

            const frameScore: FrameScore = new FrameScore(frameThrows, scoreTotal);

            scoreCard.addFrameScore(frameScore);
            scoreCard.finalScore = scoreTotal;
        }

        return scoreCard;
    }
}