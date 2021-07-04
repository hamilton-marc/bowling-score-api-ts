import { ScoreCardDisplay } from './score-card.cli';
import { GamePlay } from './game-play.cli';
import prompts, { PromptObject, Answers } from 'prompts';
import { ScoreCard } from '../models';

/**
 * This is the main entry point for the command line interface
 * for the bowling game. We display a simple prompt to the user
 * allowing them to choose between starting a game or quitting.
 * 
 * The game play is fairly simple. We use the GamePlay class to
 * do the heavy lifting of asking the user for their input on
 * the number of pins knocked down for each frame. We then take
 * the resulting ScoreCard and use the ScoreCardDisplay class
 * to render it on the command line.
 * 
 */
export class Program {
    public constructor(
        private gamePlay: GamePlay = new GamePlay()
    ) {
    }

    /**
     * Displays a simple menu asking the user if they want to start tracking
     * a new game or quit.
     *
     * @returns a boolean wrapped in a Promise indicating whether or not
     *          the user wishes to start
     */
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

    /**
     * Use the ScoreCardDisplay class to take a ScoreCard and render it on the
     * command line.
     *
     * @param scoreCard - the score card from the game
     */
    private displayScoreCard(scoreCard: ScoreCard) {
        const scoreCardDisplay: ScoreCardDisplay = new ScoreCardDisplay(scoreCard);

        console.log(scoreCardDisplay.renderScoreCard());
    }

    /**
     * Entry point for the command line execution:
     * 1. Display a menu giving the user to track scores or quit
     * 2. Use the GamePlay class to perform the score tracking
     * 3. Use the ScoreCardDisplay class to render the resulting ScoreCard
     */
    public async run(): Promise<ScoreCard | undefined> {

        try {
            let result: Answers<string>;
            let playNewGame: boolean = false;
            let scoreCard: ScoreCard = new ScoreCard();

            playNewGame = await this.mainMenu();

            if (playNewGame) {
                scoreCard = await this.gamePlay.newGame();

                this.displayScoreCard(scoreCard);
                return scoreCard;
            }
        }
        catch(err) {
            console.error(err);
        }
    }
}