import { ThrowTally } from '../entities';

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

}