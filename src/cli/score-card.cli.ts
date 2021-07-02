import CliTable3, { Table } from 'cli-table3';
import colors from 'colors/safe';
import { ThrowTally, ScoreCard, FrameScore } from '../models';

/**
 * This purpose of this class is the take a ScoreCard and render it
 * in a table on the command line.  Special care has been taken to
 * render it the way that it would appear in a real bowling alley.
 * (i.e. 'X' for strikes, '/' for spares, '-' for gutter ball, etc.)
 * This made the command line "UI" logic a bit more complex than
 * anticipated.
 */
export class ScoreCardDisplay {
    private readonly DEFAULT_TABLE_CHARS = {
      'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
    , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
    , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
    , 'right': '║' , 'right-mid': '╢' , 'middle': '│' };

    public constructor(
        private scoreCard: ScoreCard = new ScoreCard()
        ) {
    }

    /**
     * The public method which takes a score card as input and then creates a table.
     * An optional "maxThrows" parameter allows the table to be properly rendered
     * if we want to render the table before the game has concluded.
     *
     * @param scoreCardInput - the ScoreCard to be rendered
     * @param maxThrows - the maximum number of throws that should be rendered
     * @returns the rendered score card as a string
     */
    public renderScoreCard(scoreCardInput?: ScoreCard, maxThrows: number = ThrowTally.MAX_THROWS): string {
        if (scoreCardInput) this.scoreCard = scoreCardInput;

        return this.createTable(maxThrows);
    }

    /**
     * Creates the header row for the table indicating the Frame count.
     *
     * @returns an Array object used to render the cli-table3 row
     */
    private createHeaderRow(): Array<any> {
        const row = [];

        row.push(colors.green('Frame'));

        for (let i: number = 0; i < ThrowTally.MAX_FRAMES; i++) {
            // make sure we account for the potential for 3 throws on the final frame
            const colSpan: number = i < ThrowTally.MAX_FRAMES - 1 ? 2 : 3;
            const content: string = (i + 1).toString();

            row.push({
                hAlign: 'center'
              , colSpan: colSpan
              , content: colors.green(content)
            });
        }

        return row;
    }

    /**
     * Super messy method which renders the throw to similate how a bowling score
     * is reflected in a real bowling game.
     * 
     * Strikes are marked with an 'X'
     * Spares are marked with an '/'
     * Gutterballs are marked with a '-'
     * 
     * And then there are the special cases with the final frame... 
     *
     * @param throwIndex - the index in the total number of throws to render
     * @returns the 1 char string indicating what will show up in the throw box
     */
    private renderThrow(throwIndex: number): string {
        // a little messy... we need to figure out which frame each throw
        // corresponds to and also take into account the final frame

        const frameIndex = Math.floor(throwIndex / 2) - (throwIndex === ThrowTally.MAX_THROWS - 1 ? 1 : 0);
        const frameThrowIndex = throwIndex % (frameIndex < ThrowTally.MAX_FRAMES - 1 ? 2 : 3);

        const frameScore: FrameScore = this.scoreCard.getFrameScore(frameIndex);
        let content: string = frameScore.throws[frameThrowIndex]?.toString();

        if (frameScore.throws[frameThrowIndex] === 0) content = '-';

        if (frameScore.throws[0] + frameScore.throws[1] === ThrowTally.MAX_PINS) {
            if (frameThrowIndex === 0 && frameScore.throws[frameThrowIndex] === ThrowTally.MAX_PINS) {
                content = 'X';
            }
            else if (frameThrowIndex === 1) {
                content = frameScore.throws[frameThrowIndex] > 0 ? '/' : ' ';
            }
        }

        // Super messy dealing with the special cases of the final frame
        if (frameIndex === ThrowTally.MAX_FRAMES - 1) {
            if (frameScore.throws[frameThrowIndex] === ThrowTally.MAX_PINS) {
                content = 'X';
            }
            else if (frameThrowIndex === 2 &&
                     frameScore.throws[frameThrowIndex] > 0 &&
                     frameScore.throws[frameThrowIndex-1] + frameScore.throws[frameThrowIndex] === ThrowTally.MAX_PINS) {
                content = '/';
            }
            else if (frameThrowIndex === 2 &&
                     frameScore.throws[frameThrowIndex-1] + frameScore.throws[frameThrowIndex] < ThrowTally.MAX_PINS) {
                content = ' ';
            }
        }

        return content;
    }

    /**
     * Creates the row that indicates the number of pins knocked down
     * in each frame.  Most of the heavy lifting to indicate what is
     * actually displayed is hanled by the "renderThrow" method.
     *
     * @param maxThrows - maximum number of throws to render
     * @returns an Array object used to render the cli-table3 row
     */
    private createThrowsRow(maxThrows: number): Array<any> {
        const row = [];

        row.push(colors.green('Throws'));

        for (let i: number = 0; i < ThrowTally.MAX_THROWS; i++) {
            let content: string = this.renderThrow(i);

            row.push({
                hAlign: 'center'
              , content: content
            });
        }

        return row;
    }

    /**
     * This method renders the row which shows the score for each
     * individual frame.
     *
     * @param maxFrames - the maxiumum number of frames to render
     * @returns an Array object used to render the cli-table3 row
     */
    private createFrameScoreRow(maxFrames: number): Array<any> {
        const row = [];

        row.push(colors.green('Score'));

        for (let i: number = 0; i < ThrowTally.MAX_FRAMES; i++) {
            const colSpan: number = i < ThrowTally.MAX_FRAMES - 1 ? 2 : 3;
            let content: string = ' ';

            content = this.scoreCard.getFrameScore(i).score.toString();

            row.push({
                hAlign: 'center'
              , colSpan: colSpan
              , content: content
            });
        }

        return row;
    }

    /**
     * This method creates the entire table to render the ScoreCard:
     * 1. render the header row containing the frame numbers
     * 2. render the throws row containing the pins knocked down for each frame
     * 3. render the row containing the score for each frame
     *
     * @param maxThrows the maximum number of throws to render
     * @returns the rendered table as a string that can be displayed
     *          on the command line.
     */
    private createTable(maxThrows: number): string {
        let renderedTable: string = '';
        let table: Table = new CliTable3({
            chars: this.DEFAULT_TABLE_CHARS
        });

        table.push(
            this.createHeaderRow(),
            this.createThrowsRow(maxThrows),
            this.createFrameScoreRow(maxThrows / 2)
        );

        renderedTable += table.toString() +'\n';

        return renderedTable;
    }
}
