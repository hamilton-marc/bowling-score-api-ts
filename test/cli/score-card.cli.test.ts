import { ScoreCardDisplay } from '../../src/cli/score-card.cli';
import { FrameScore, ScoreCard, ThrowTally } from '../../src/models';

/**
 * Cli Tests
 * 
 * @group cli
 */


describe('Render a score card table from a ScoreCard object', () => {
    test('Test that we can render a simple score card table', () => {
        const scoreCard = new ScoreCard();

        for (let i: number = 0; i < ThrowTally.MAX_FRAMES; i++) {
            const frameScore = new FrameScore([1,1], 2 * (i+1));

            scoreCard.addFrameScore(frameScore);
        }

        const scoreCardDisplay = new ScoreCardDisplay(scoreCard);
        const scoreCardStr: string = scoreCardDisplay.renderScoreCard();

        console.log("This is not meant to represent an accurate score,\n" +
                    "only that we can render the score card in a table.\n" +
                    scoreCardStr);

        expect(scoreCardStr.length).toBeGreaterThan(0);
    });

    test('Test that we can render a score card table with spares', () => {
        const scoreCard = new ScoreCard();

        for (let i: number = 0; i < ThrowTally.MAX_FRAMES; i++) {
            let frameScore = new FrameScore([5,5], 10 * (i+1));

            if (i === ThrowTally.MAX_FRAMES - 1) {
                frameScore = new FrameScore([5,5,5], 10 * (i+1) + 5);
            }

            scoreCard.addFrameScore(frameScore);
        }

        const scoreCardDisplay = new ScoreCardDisplay(scoreCard);
        const scoreCardStr: string = scoreCardDisplay.renderScoreCard();

        console.log("This is not meant to represent an accurate score,\n" +
                    "only that we can render the score card in a table.\n" +
                    scoreCardStr);

        expect(scoreCardStr.length).toBeGreaterThan(0);
    });
});

