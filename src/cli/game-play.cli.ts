import prompts, { PromptObject, Answers } from 'prompts';
import { ScoreCard, ThrowTally } from '../models';
import { BowlingScoreCalculator } from '../services';

export class GamePlay {
    private scoreCalculator = new BowlingScoreCalculator();
    private throwTally = new ThrowTally();
    private scoreCard = new ScoreCard();

    constructor() { }

    private reset(): void {
        this.throwTally = new ThrowTally();
        this.scoreCard = new ScoreCard();
    }
    
    public async newGame(): Promise<ScoreCard> {
        this.reset();

        for (let i=0; i < ThrowTally.MAX_THROWS - 1; i++) {
            const frameIndex: number = Math.floor(i / 2);
            const frameThrowIndex: number = i % 2;
            let maxPins = ThrowTally.MAX_PINS;

            if (frameThrowIndex === 1) {
                maxPins = ThrowTally.MAX_PINS - this.throwTally.getThrow(i-1);
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