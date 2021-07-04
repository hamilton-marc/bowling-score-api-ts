import prompts, { PromptObject, Answers } from 'prompts';
import { ScoreCard, ThrowTally } from '../models';
import { BowlingScoreCalculator } from '../services';

/**
 * This class uses prompts to present the user with the
 * the ability to enter the number of pins knocked down
 * in each frame of a game.
 * 
 * Afterward it generates and returns a ScoreCard object from
 * the newGame() method.
 */
export class GamePlay {
    private throwTally = new ThrowTally();
    private scoreCard = new ScoreCard();

    constructor(
        private scoreCalculator = new BowlingScoreCalculator()
    ) { }

    /**
     * Resets the private members holding the data for the
     * throws and score card.
     */
    private reset(): void {
        this.throwTally = new ThrowTally();
        this.scoreCard = new ScoreCard();
    }

    /**
     * Because, we're storing all of the throws in simple array,
     * this convenience function helps us understand which frame
     * and throw within that frame that an element in the array
     * corresponds to.
     * 
     * Note that the math also accounts for the the final frame
     * which allows for a max of 3 throws (versus a max of 2 in
     * a "regular" frame).
     * 
     * @param throwIndex - index in the array
     * @returns the zero based frame and throw within that frame
     */
    public static calculateFrameAndThrowIndex(throwIndex: number): { frameIndex: number, frameThrowIndex: number } {
        const frameIndex = Math.floor(throwIndex / 2) - (throwIndex === ThrowTally.MAX_THROWS - 1 ? 1 : 0);
        const frameThrowIndex = throwIndex % (frameIndex < ThrowTally.MAX_FRAMES - 1 ? 2 : 3);

        return { frameIndex: frameIndex, frameThrowIndex: frameThrowIndex };
    }

    /**
     * Calculates the maximum number of pins that a user can knock down next.
     * We use the rules of bowling to determine how many more pins the user
     * is allowed to enter.
     * 
     * @param throwIndex - the index in the simple array of throws
     * @returns max number of pins a user can knock down on this throw
     */
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

    /**
     * Starts up a new game, prompting the user to enter the number of
     * pins knocked down for each throw in a frame.
     * 
     * @returns the ScoreCard of the game wrapped in a Promise
     */
    public async newGame(): Promise<ScoreCard> {
        let userExit: boolean = false;
        this.reset();

        for (let i=0; i < ThrowTally.MAX_THROWS && !userExit; i++) {
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
                max: maxPins,
                initial: 0
            }];

            const response = await prompts(questions, {
                onSubmit: (prompt, answer) => this.throwTally.setThrow(i, answer),
                onCancel: prompt => userExit = true
            });
        }

        this.scoreCard = this.scoreCalculator.computeScoreCard(this.throwTally);
        return this.scoreCard;
    }
}