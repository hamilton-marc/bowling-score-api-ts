import CliTable3, { Table } from 'cli-table3';
import colors from 'colors/safe';
import { head } from 'lodash';
import { ThrowTally, ScoreCard, FrameScore } from '../models';

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

    public renderScoreCard(scoreCardInput?: ScoreCard, maxThrows: number = ThrowTally.MAX_THROWS): string {
        if (scoreCardInput) this.scoreCard = scoreCardInput;

        return this.createTable(maxThrows);
    }

    private createHeaderRow(): Array<any> {
        const row = [];

        row.push(colors.green('Frame'));

        for (let i: number = 0; i < ThrowTally.MAX_FRAMES; i++) {
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

    private createThrowsRow(maxThrows: number): Array<any> {
        const row = [];

        row.push(colors.green('Throws'));

        for (let i: number = 0; i < ThrowTally.MAX_THROWS; i++) {
            let content: string = ' ';

            // a little messy... we need to figure out which frame each throw
            // corresponds to and also take into account the final frame
            const divisor = i < ThrowTally.MAX_THROWS - 1 ? 2 : 3;
            const frameIndex = Math.floor(i / divisor);
            const frameThrowIndex = i % divisor;

            const frameScore: FrameScore = this.scoreCard.getFrameScore(frameIndex);
            content = frameScore.throws[frameThrowIndex]?.toString();

            row.push({
                hAlign: 'center'
              , content: content
            });
        }

        return row;
    }

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

    private createTable(maxThrows: number): string {
        let renderedTable: string = '';
        let table: Table = new CliTable3({
            chars: this.DEFAULT_TABLE_CHARS
//        , colWidths: [30, 30]
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
