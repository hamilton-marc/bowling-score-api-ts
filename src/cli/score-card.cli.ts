import Table from 'cli-table3';
import { ScoreCardDTO } from '../shared';

export class ScoreCardDisplay {
    private readonly DEFAULT_TABLE_CHARS = { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
    , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
    , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
    , 'right': '║' , 'right-mid': '╢' , 'middle': '│' };

    private table!: Table;

    public constructor(
        private scoreCard: ScoreCardDTO = { } as ScoreCardDTO
    ) {
    }

    public renderScoreCard(scoreCardInput?: ScoreCardDTO): string {
        if (scoreCardInput) this.scoreCard = scoreCardInput;

        return this.createTable();
    }

    private createTable(): string {
        let renderedTable: string = '';
        let table = new Table({
            chars: this.DEFAULT_TABLE_CHARS
//        , colWidths: [30, 30]
        });

        table.push(            
            ['Frame',  {hAlign: 'center', colSpan:2, content:'1'}, {hAlign: 'center', colSpan:2, content:'2'},
                       {hAlign: 'center', colSpan:2, content:'3'}, {hAlign: 'center', colSpan:3, content:'4'}]
          , ['Throws', '1', '2', '3', '4', '5', '6', '7', '8', '-']
          , ['Score',  {hAlign: 'center', colSpan:2, content:'3'}, {hAlign: 'center', colSpan:2, content:'10'},
                       {hAlign: 'center', colSpan:2, content:'21'}, {hAlign: 'center', colSpan:3, content:'36'}]
        );

        renderedTable += table.toString() +'\n';

        return renderedTable;
    }
}
