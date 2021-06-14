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


    private handleStrikeScenario(throwTally: ThrowTally, frameIndex: number, throwSum: number): number {
        let frameScoreValue: number = throwSum;
        const nextThrow = throwTally.getFrame(frameIndex + 1)[0];
        let secondThrow = throwTally.getFrame(frameIndex + 1)[1];

        if (nextThrow === ThrowTally.MAX_PINS) {
            secondThrow = throwTally.getFrame(frameIndex + 2)[0];
        }

        frameScoreValue += (nextThrow + secondThrow);

        return frameScoreValue;
    }

    private handleSpareScenario(throwTally: ThrowTally, frameIndex: number, throwSum: number): number {
        let frameScoreValue: number = throwSum;
    
        frameScoreValue += throwTally.getFrame(frameIndex + 1)[0];

        return frameScoreValue;
    }

    /**
     * Computes the individual sum for a given frame. Note that this does not accummulate
     * from the prior frames.
     * 
     * @param throwTally
     * @param frameIndex 
     * @returns 
     */
    private computeFrameScoreValue(throwTally: ThrowTally, frameIndex: number): number {
        const frameThrows: number[] = throwTally.getFrame(frameIndex);
    
        let frameScoreValue: number = frameThrows.reduce(
            (accumulater: number, currentValue: number) => {
                return (accumulater + currentValue);
             });

        // Handle spare case
        if (frameScoreValue === ThrowTally.MAX_PINS && frameIndex < ThrowTally.MAX_FRAMES - 1) {
            if (frameThrows[0] === ThrowTally.MAX_PINS) {
                frameScoreValue = this.handleStrikeScenario(throwTally, frameIndex, frameScoreValue);                
            }
            else {
                frameScoreValue = this.handleSpareScenario(throwTally, frameIndex, frameScoreValue);
            }
        }

        return (frameScoreValue);
    }

    /**
     * Creates and computes the values for a ScoreCard object which represents the
     * accumulated scores for each frame as well as the final score.
     *
     * @param throwTally
     * @returns 
     */
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