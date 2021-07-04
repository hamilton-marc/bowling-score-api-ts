import { ScoreCard, FrameScore } from "../../src/models";
import { Utilities } from "../utils";
import * as _ from "lodash";

/**
 * API Tests
 * 
 * @group api
 */

describe('Perform some basic operations on the FrameScore model object', () => {
    test('Test to make sure the properties reflect what is being passed in on the constructor', () => {
        const frameScore = new FrameScore([0, 1], 1);

        expect(_.isEqual(frameScore.throws, [0, 1])).toBeTruthy();
        expect(frameScore.score).toEqual(1);
    });

    test('Test getters and setters', () => {
        const frameScore = new FrameScore();

        frameScore.throws = [0, 1];
        frameScore.score = 1;

        expect(_.isEqual(frameScore.throws, [0, 1])).toBeTruthy();
        expect(frameScore.score).toEqual(1);
    });
});

describe('Make sure we can add new frames to the ScoreCard', () => {
    test('For a newly instantiated ScoreCard, it should contain 0 frames', () => {
        const scoreCard = new ScoreCard();

        expect(scoreCard.length).toEqual(0);
    });

    test('Add frames and verify the count', () => {
        const scoreCard = new ScoreCard();
        const expectedFrameCount = Utilities.getRandomInt(1, 9);

        for (let i:number = 0; i < expectedFrameCount; i++) {
            scoreCard.addFrameScore(new FrameScore());
        }

        expect(scoreCard.length).toEqual(expectedFrameCount);
    });

    test('Add frames and verify the count', () => {
        const scoreCard = new ScoreCard();
        const newFrameScore = new FrameScore([2, 0], 2)

        scoreCard.addFrameScore(new FrameScore([1, 0], 1));
        scoreCard.setFrameScore(0, newFrameScore);

        expect(scoreCard.getFrameScore(0)).toEqual(newFrameScore);
    });
});

describe('Make sure we get back the correct values from the ScoreCard', () => {
    test('Add a frame and verify the values', () => {
        const scoreCard = new ScoreCard();
        // Create a frame of 2 throws of random values between 1 and 4
        const throwValues: number[] = new Array<number>(FrameScore.DEFAULT_THROW_COUNT)
                                          .map( x => Utilities.getRandomInt(1, 4) );
        const expectedFrameScore = new FrameScore(throwValues);
        scoreCard.addFrameScore(expectedFrameScore);
        const frameScore = scoreCard.getFrameScore(0);

        expect(_.isEqual(scoreCard.getFrameScore(0), expectedFrameScore)).toBeTruthy();
    });
});
