import { freemem } from 'os';
import prompts, { PromptObject, Answers } from 'prompts';
import { ScoreCard, ThrowTally } from '../models';
import { BowlingScoreCalculator } from '../services';

export class GamePlay {
    ;
    private throwTally = new ThrowTally();
    private scoreCard = new ScoreCard();

    constructor(
        private scoreCalculator = new BowlingScoreCalculator()
    ) { }

    private reset(): void {
        this.throwTally = new ThrowTally();
        this.scoreCard = new ScoreCard();
    }


    public static calculateFrameAndThrowIndex(throwIndex: number): { frameIndex: number, frameThrowIndex: number } {
        const frameIndex = Math.floor(throwIndex / 2) - (throwIndex === ThrowTally.MAX_THROWS - 1 ? 1 : 0);
        const frameThrowIndex = throwIndex % (frameIndex < ThrowTally.MAX_FRAMES - 1 ? 2 : 3);

        return { frameIndex: frameIndex, frameThrowIndex: frameThrowIndex };
    }

    private calculateMaxPins(throwIndex: number): number {
        const { frameIndex, frameThrowIndex } = GamePlay.calculateFrameAndThrowIndex(throwIndex);
        let maxPins: number = ThrowTally.MAX_PINS;

        if (frameThrowIndex > 0) {
            maxPins = ThrowTally.MAX_PINS - this.throwTally.getThrow(throwIndex-1);
        }

        if (frameIndex === ThrowTally.MAX_FRAMES - 1) {

            // if we're in the last frame and on the 3rd throw...
            // if the user hasn't had at least a spare,
            // then it's game over.
            if (frameThrowIndex > 1 &&
                this.throwTally.getThrow(throwIndex-1) + this.throwTally.getThrow(throwIndex-2) < ThrowTally.MAX_PINS) {
                maxPins = 0;
            } 

            if (frameThrowIndex > 0 && this.throwTally.getThrow(throwIndex-1) === ThrowTally.MAX_PINS) {
                maxPins = ThrowTally.MAX_PINS;
            }
        }

        return maxPins;
    }

    public async newGame(): Promise<ScoreCard> {
        this.reset();

        for (let i=0; i < ThrowTally.MAX_THROWS; i++) {
            const { frameIndex, frameThrowIndex } = GamePlay.calculateFrameAndThrowIndex(i);
            let maxPins = this.calculateMaxPins(i);

            if (maxPins <= 0) {
                this.throwTally.setThrow(i, 0);
                continue;
            }

            const questions: PromptObject<string>[] = [{
                type: 'number',
                name: 'throw',
                message: `Frame ${frameIndex+1}, Throw ${frameThrowIndex+1}: How many pins were knocked down?`,
                min: 0,
                max: maxPins
            }];

            const response = await prompts(questions);
            this.throwTally.setThrow(i, response.throw);
        }

        this.scoreCard = this.scoreCalculator.computeScoreCard(this.throwTally);
        return this.scoreCard;
    }
}