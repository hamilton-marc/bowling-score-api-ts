import { ScoreCardDisplay } from '../../src/cli/score-card.cli';
import { FrameScore, ScoreCard, ThrowTally } from '../../src/models';

/**
 * Cli Tests
 * 
 * @group cli
 */

 class ScoreCardDisplayTest {
    private static instance: ScoreCardDisplayTest;

    private constructor (
    ) {
    }

    public static getInstance(): ScoreCardDisplayTest {
        if (!this.instance) {
            this.instance = new ScoreCardDisplayTest();
        }

        return this.instance;
    }

    public testScoreCardRender(frameThrows: Array<number[]>, searchStr: string) {
        const scoreCard = new ScoreCard();

        for (let i: number = 0; i < ThrowTally.MAX_FRAMES; i++) {
            let frameScore = new FrameScore([0,0], 0);

            if (i < frameThrows.length){
                frameScore = new FrameScore(frameThrows[i], frameThrows[i][0] + frameThrows[i][1]);
            }

            scoreCard.addFrameScore(frameScore);
        }

        const scoreCardDisplay = new ScoreCardDisplay(scoreCard);
        const scoreCardStr: string = scoreCardDisplay.renderScoreCard(scoreCard);

        console.log("This is not meant to represent an accurate score,\n" +
                    "only that we can render the score card in a table.\n" +
                    scoreCardStr);

        expect(scoreCardStr.length).toBeGreaterThan(0);
        expect(scoreCardStr).toContain(searchStr);

        return scoreCardStr;
    }
 }

describe('Render a score card table from a ScoreCard object', () => {
    test('Test that we can render a simple score card table', () => {
        const frameThrows: Array<number[]> = new Array(ThrowTally.MAX_FRAMES).fill([0,0]);
        ScoreCardDisplayTest.getInstance().testScoreCardRender(frameThrows, "-");
    });

    test('Test that we can render a simple score card table', () => {
        const frameThrows: Array<number[]> = new Array(ThrowTally.MAX_FRAMES).fill([1,1]);
        ScoreCardDisplayTest.getInstance().testScoreCardRender(frameThrows, "1");
    });

    test('Test that we can render a score card table with spares', () => {
        const frameThrows: Array<number[]> = new Array(ThrowTally.MAX_FRAMES).fill([5,5]);
        frameThrows[ThrowTally.MAX_FRAMES-1] = [5,5,5];

        ScoreCardDisplayTest.getInstance().testScoreCardRender(frameThrows, "/");
    });

    test('Test that we can render a score card table with a perfect game', () => {
        const frameThrows: Array<number[]> = new Array(ThrowTally.MAX_FRAMES).fill([10,0]);
        frameThrows[ThrowTally.MAX_FRAMES-1] = new Array(3).fill(10);

        ScoreCardDisplayTest.getInstance().testScoreCardRender(frameThrows, "X");
    });
});

