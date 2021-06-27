import { ScoreCardDisplay } from './score-card.cli';

class Program {
    public constructor() {
    }

    public run(): void {
        const scoreCardDisplay: ScoreCardDisplay = new ScoreCardDisplay();

        console.log(scoreCardDisplay.renderScoreCard());
    }
}

new Program().run();