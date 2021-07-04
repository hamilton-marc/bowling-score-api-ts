import { GamePlay } from '../../src/cli/game-play.cli';
import { ScoreCardDisplay } from '../../src/cli/score-card.cli'
import { Program } from '../../src/cli/main.cli';
import prompts, { PromptObject, Answers } from 'prompts';
import { ScoreCard } from '../../src/models';
import { mocked } from 'ts-jest/utils';

/**
 * Cli Tests
 * 
 * @group cli
 */

jest.mock('../../src/cli/game-play.cli');
jest.mock('../../src/cli/score-card.cli');


describe('Simple cases of the two choices in the main menu', () => {
    const MockedGamePlay = mocked(GamePlay, true);
    const MockedScoreCardDisplay = mocked(ScoreCardDisplay, true);

    beforeEach(() => {
        MockedGamePlay.mockClear();
        MockedScoreCardDisplay.mockClear();
    });

    test('Test when we choose to exit the main menu', async () => {
        const mainProgram = new Program();

        prompts.inject([false]);
        const scoreCard = await mainProgram.run();

        expect(scoreCard).toBeUndefined();
    });

    test('Test when we choose to play a game', async () => {
        const mainProgram = new Program();

        prompts.inject([true]);
        const scoreCard = await mainProgram.run();

        expect(MockedGamePlay).toHaveBeenCalled();
        expect(MockedScoreCardDisplay).toHaveBeenCalled();
    });
});

