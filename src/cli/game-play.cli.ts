import prompts, { PromptObject, Answers } from 'prompts';
import { ThrowTally } from '../models';

export class GamePlay {
    constructor(
        private throws: Array<string> = new Array<string>(ThrowTally.MAX_THROWS)
    ) { }

    public async newGame(): Promise<Array<string>> {
        for (let i=0; i < ThrowTally.MAX_THROWS - 1; i++) {
            const questions: PromptObject<string>[] = [{
                type: 'number',
                name: 'throw',
                message: `Frame ${Math.floor(i / 2) + 1}, Throw ${i % 2 + 1}: How many pins were knocked down?`,
                min: 0,
                max: 10
            }];

            const response = await prompts(questions);
            this.throws[i] = response.throw;
        }

        return this.throws;
    }
}