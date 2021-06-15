import { Utilities } from '../utils';
import { ThrowTally } from '../../src/models';
import * as _ from "lodash";

describe('Basic throw tracking', () => {
    test('Test the ability to get and set frame throws', () => {
        const throwTally: ThrowTally = new ThrowTally();
        const throwValue: number = Utilities.getRandomInt(1, 4);

        throwTally.setThrow(0, throwValue);

        const throwFromthrowTally = throwTally.getThrow(0);
        expect(throwFromthrowTally).toEqual(throwValue);
    });
});

describe('Basic throw tracking frame management', () => {
    test('Test that I can get the throws for a specific frame', () => {
        const throwTally: ThrowTally = new ThrowTally();
        const frameIndex = 1;
        let frameValue: number[] = new Array<number>(2).fill(0);

        frameValue = frameValue.map(val => {
            return Utilities.getRandomInt(1, 4);
        });

        throwTally.setThrow(frameIndex * 2,     frameValue[0]);
        throwTally.setThrow(frameIndex * 2 + 1, frameValue[1]);

        const frameFromThrowTally: number[] = throwTally.getFrame(frameIndex);
        expect(_.isEqual(frameValue, frameFromThrowTally)).toBeTruthy();
    });
});
