import { ScoreCardDisplay } from './score-card.cli';
import { GamePlay } from './game-play.cli';
import prompts, { PromptObject, Answers } from 'prompts';
import { waitForDebugger } from 'inspector';
import { ScoreCard } from '../models';

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

    private displayScoreCard(scoreCard: ScoreCard) {
        const scoreCardDisplay: ScoreCardDisplay = new ScoreCardDisplay(scoreCard);

        console.log(scoreCardDisplay.renderScoreCard());
    }

    public async run() {
        try {
            let result: Answers<string>;
            let playNewGame: boolean = false;
            let scoreCard: ScoreCard;

            playNewGame = await this.mainMenu();

            if (playNewGame) {
                const gamePlay: GamePlay = new GamePlay();
                scoreCard = await gamePlay.newGame();

                this.displayScoreCard(scoreCard);
            }
        }
        catch(err) {
            console.error(err);
        }
    }
}

new Program().run();