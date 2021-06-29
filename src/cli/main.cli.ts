import { ScoreCardDisplay } from './score-card.cli';
import { GamePlay } from './game-play.cli';
import prompts, { PromptObject, Answers } from 'prompts';
import { waitForDebugger } from 'inspector';

class Program {
    public constructor() {
    }

    private async mainMenu(): Promise<boolean> {
        const questions: PromptObject<string>[] = [{
            type: 'select',
            name: 'newGame',
            message: 'Choose from the following options',
            choices: [
                { title: 'New Game', description: 'Start tracking a new bowling game', value: true },
                { title: 'Quit', description: 'Exit the application', value: false }
            ]
        }];

        const response = await prompts(questions);

        return response.newGame === true;
    }

    private async playGame(): Promise<number> {
        const questions: PromptObject<string>[] = [{
            type: 'number',
            name: 'throw',
            message: 'Frame 1, Throw 1: How many pins were knocked down?',
            min: 0,
            max: 10
        }];

        const response = await prompts(questions);

        return response.throw;
    }

    private displayScoreCard() {
        const scoreCardDisplay: ScoreCardDisplay = new ScoreCardDisplay();

        console.log(scoreCardDisplay.renderScoreCard());
    }

    public async run() {

        try {
            let result: Answers<string>;
            let playNewGame: boolean = false;
            let pins: Array<string> = [];

            playNewGame = await this.mainMenu();
//          console.log(`playNewGame = ${playNewGame}`);

            if (playNewGame) {
                const gamePlay: GamePlay = new GamePlay();
                pins = await gamePlay.newGame();
                console.log(`pins = ${pins}`);

                this.displayScoreCard();
            }
        }
        catch(err) {
        }
    }
}

new Program().run();