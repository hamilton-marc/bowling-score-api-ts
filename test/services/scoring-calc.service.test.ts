import { Utilities } from '../utils';
import { BowlingScoreCalculator } from '../../src/services';
import { ThrowTally, ScoreCard, FrameScore } from '../../src/entities';
/**
 * Performs unit tests on the BowlingScoreCalculator service
 * 
 */

describe('Basic game with only 1 throw', () => {
    test('Test for a correct score after only 1 throw', () => {
        const scoreCalculator = new BowlingScoreCalculator();
        const throwValue: number = 6;
        const throwTally = new ThrowTally();

        throwTally.setThrow(0, throwValue);

        const scoreCard: ScoreCard = scoreCalculator.computeScoreCard(throwTally);

        expect(scoreCard.finalScore).toEqual(throwValue);     // expect it to be 6
    });
});

describe('Basic game with no spares or strikes', () => {
    const scoreCalculator: BowlingScoreCalculator = new BowlingScoreCalculator();

    test('Test for a correct frame score with 2 throws', () => {
        const throwValues: number[] = [ 6, 3 ];
        const throwTally = new ThrowTally();
        const expectedScore = 6 + 3;

        for (let i: number = 0; i < throwValues.length; i++) {
            throwTally.setThrow(i, throwValues[i]);
        }

        const scoreCard: ScoreCard = scoreCalculator.computeScoreCard(throwTally);

        expect(scoreCard.getFrameScore(0).score).toEqual(expectedScore); // expect it to be 6
        expect(scoreCard.finalScore).toEqual(expectedScore);       // expect it to be 6
    });

    test('Test for a correct frame score with all throws the same', () => {
        // simple case... assume 2 throws per frame
        const throwValues: number[] = new Array<number>(10 * 2).fill(2);
        const throwTally = new ThrowTally();
        const expectedSingleFrameScore = 2 * 2;
        const expectedScore = 10 * expectedSingleFrameScore;

        for (let i: number = 0; i < throwValues.length; i++) {
            throwTally.setThrow(i, throwValues[i]);
        }

        const scoreCard: ScoreCard = scoreCalculator.computeScoreCard(throwTally);

        expect(scoreCard.getFrameScore(0).score).toEqual(expectedSingleFrameScore); // expect it to be 4
        expect(scoreCard.finalScore).toEqual(expectedScore);       // expect it to be 40
    });
});


describe('Test for the spare case', () => {
    const scoreCalculator: BowlingScoreCalculator = new BowlingScoreCalculator();

    test('Test for correct frame scores with 1 spare and 1 more throw', () => {
        const throwValues: number[] = [ 5, 5, 1 ];

        const throwTally = new ThrowTally();
        const expectedFrameScore = 5 + 5 + 1;
        const expectedFinalScore = expectedFrameScore + 1;

        for (let i: number = 0; i < throwValues.length; i++) {
            throwTally.setThrow(i, throwValues[i]);
        }

        const scoreCard: ScoreCard = scoreCalculator.computeScoreCard(throwTally);

        expect(scoreCard.getFrameScore(0).score).toEqual(expectedFrameScore); // expect it to be 11
        expect(scoreCard.finalScore).toEqual(expectedFinalScore);       // expect it to be 12
    });

    test('Test for correct frame scores with 2 spares and 2 more throws', () => {
        const throwValues: number[] = [ 5, 5, 5, 5, 1, 2 ];

        const throwTally = new ThrowTally();
        const expectedFinalScore = (5 + 5 + 5) + (5 + 5 + 1) + (1 + 2);

        for (let i: number = 0; i < throwValues.length; i++) {
            throwTally.setThrow(i, throwValues[i]);
        }

        const scoreCard: ScoreCard = scoreCalculator.computeScoreCard(throwTally);

        expect(scoreCard.getFrameScore(0).score).toEqual(5 + 5 + 5); // expect it to be 15
        expect(scoreCard.getFrameScore(1).score).toEqual((5 + 5 + 5) + (5 + 5 + 1)); // expect it to be 26
        expect(scoreCard.getFrameScore(2).score).toEqual(expectedFinalScore);        // expect it to be 29

        expect(scoreCard.finalScore).toEqual(expectedFinalScore);       // expect it to be 29
    });

    test('Test for correct frame scores with all 5s', () => {
        const throwValues: number[] = new Array(ThrowTally.MAX_THROWS).fill(5);

        const throwTally = new ThrowTally();
        const expectedFinalScore = (5 + 5 + 5) * 9 + (5 + 5 + 5);

        for (let i: number = 0; i < throwValues.length; i++) {
            throwTally.setThrow(i, throwValues[i]);
        }

        const scoreCard: ScoreCard = scoreCalculator.computeScoreCard(throwTally);

        expect(scoreCard.finalScore).toEqual(expectedFinalScore);       // expect it to be 29
    });
});
