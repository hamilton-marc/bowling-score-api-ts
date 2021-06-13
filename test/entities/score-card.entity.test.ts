import { Utilities } from '../utils';
import { ScoreCard } from '../../src/entities';
import * as _ from "lodash";

describe('Basic score card throw tracking', () => {
    test('Test the ability to get and set frame scores', () => {
        const scoreCard: ScoreCard = new ScoreCard();
        const throwValue: number = Utilities.getRandomInt(1, 4);

        scoreCard.setThrow(0, throwValue);

        const throwFromScoreCard = scoreCard.getThrow(0);
        expect(throwFromScoreCard).toEqual(throwValue);
    });
});

describe('Basic score card frame management', () => {
    test('Test that I can get the scores for a specific frame', () => {
        const scoreCard: ScoreCard = new ScoreCard();
        const frameIndex = 1;
        let frameValue: number[] = new Array<number>(2).fill(0);

        frameValue = frameValue.map(val => {
            return Utilities.getRandomInt(1, 4);
        });

        scoreCard.setThrow(frameIndex * 2,     frameValue[0]);
        scoreCard.setThrow(frameIndex * 2 + 1, frameValue[1]);

        const frameFromScoreCard: number[] = scoreCard.getFrame(frameIndex);
        expect(_.isEqual(frameValue, frameFromScoreCard)).toBeTruthy();
    });
});
