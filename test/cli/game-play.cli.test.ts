import { GamePlay } from '../../src/cli/game-play.cli';
import { BowlingScoreCalculator } from '../../src/services/scoring-calc.service';
import prompts, { PromptObject, Answers } from 'prompts';
import { ScoreCard, ThrowTally } from '../../src/models';
import { mocked } from 'ts-jest/utils';

/**
 * Cli Tests
 * 
 * @group cli
 */

jest.mock('../../src/services/scoring-calc.service');

describe('Simple cases of the two choices in the main menu', () => {
    const MockedBowlingScoreCalculator = mocked(BowlingScoreCalculator, true);

    beforeEach(() => {
        MockedBowlingScoreCalculator.mockClear();
    });

    test('Test when we enter a series of throws', async () => {
        const gamePlay = new GamePlay();

        prompts.inject(new Array(ThrowTally.MAX_THROWS-1).fill(1));
        const scoreCard = await gamePlay.newGame();

        expect(MockedBowlingScoreCalculator).toHaveBeenCalled();
    });
});

