import { Utilities } from '../utils';
import { BowlingScoreCalculator } from '../../src/services';
import { ThrowTally } from '../../src/entities';
/**
 * Performs unit tests on the BowlingScoreCalculator service
 * 
 */

describe('Basic game with only 1 throw', () => {
    test('Test for a correct score after only 1 throw', () => {
        const scoreCalculator = new BowlingScoreCalculator();
        const throwValue: number = Utilities.getRandomInt(0, 10);
        const throwTally = new ThrowTally();

        throwTally.setThrow(0, throwValue);

        const finalScoreFromCalculator: number = scoreCalculator.computeFinalScore(throwTally);

        expect(finalScoreFromCalculator).toEqual(throwValue);
    });
});

describe('Basic game with no spares or strikes', () => {
    const scoreCalculator: BowlingScoreCalculator = new BowlingScoreCalculator();

    test('Test for a correct frame score with 2 throws', () => {
        const throwValues: number[] = new Array<number>(2).map( x => Utilities.getRandomInt(1, 4) );
        const throwTally = new ThrowTally();
        const frameIndex = 0;
        let expectedFrameScore: number = 0;

        for (let i: number = 0; i < 2; i++) {
            throwTally.setThrowInFrame(frameIndex, i, throwValues[i]);
            expectedFrameScore += throwValues[i];
        }

        const frameScore: number = scoreCalculator.computeFrameScore(throwTally, frameIndex);
        expect(frameScore).toEqual(expectedFrameScore);
    });

    test('Test for a correct score with all throws the same', () => {
        const throwValue: number = Utilities.getRandomInt(1, 4);
        const throwTally = new ThrowTally();

        for (let i: number = 0; i < ThrowTally.MAX_THROWS; i++) {
            throwTally.setThrow(i, throwValue);
        }

        const finalScore: number = scoreCalculator.computeFinalScore(throwTally);
        expect(finalScore).toEqual(throwValue * ThrowTally.MAX_THROWS);
    });

    test('Test for a correct score with each throw being random', () => {
        const throwTally = new ThrowTally();
        let totalScore: number = 0;

        for (let i: number = 0; i < ThrowTally.MAX_THROWS; i++) {
            const throwValue: number = Utilities.getRandomInt(1, 4);
            throwTally.setThrow(i, throwValue);
            totalScore += throwValue;
        }

        const finalScore: number = scoreCalculator.computeFinalScore(throwTally);
        expect(finalScore).toEqual(totalScore);
    });
});
