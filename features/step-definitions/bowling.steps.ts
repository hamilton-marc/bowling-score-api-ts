import assert from 'assert';
import { binding, given, then, when } from 'cucumber-tsflow';
import { rest } from 'lodash';
import * as typedRestClient from 'typed-rest-client/RestClient';
import { ThrowTally } from '../../src/models';
import { ScoreCardDTO } from '../../src/shared';

@binding()
export class BowlingSteps {
    private scoreCard: ScoreCardDTO | null = null;

    constructor (
        private restClient = new typedRestClient.RestClient('bowling-bdd', 'http://localhost:3000')
        ) {

    }

    private async getScoreCard(throws: string): Promise<ScoreCardDTO> {
        const options = {
            queryParameters: {
                params: {
                    throws: throws
                }
            }
        };

        let response = await this.restClient.get('api/score', options);
        const scoreCardResult: ScoreCardDTO = response.result as ScoreCardDTO;

        console.log(response.result);

        return scoreCardResult;
    }

    @given('I am playing a single player game')
    public createNewGame() {
        this.scoreCard = null;
    }

    @given('I throw a ball and knock down {int} pins')
    public async throwBallAndKnockDownPins(pins: number) {
        this.scoreCard = await this.getScoreCard(pins.toString());

        assert(this.scoreCard);
    }

    @given('I bowl a perfect game')
    public async bowlPerfectGame(){
//      const throws: string = '10,0,10,0,10,0,10,0,10,0,10,0,10,0,10,0,10,0,10,10,10';
        const throws: string = new Array<string>(ThrowTally.MAX_FRAMES - 1).fill('10,0').join(',')
                             + ','
                             + new Array<string>(3).fill('10').join(',');

        this.scoreCard = await this.getScoreCard(throws);

        assert(this.scoreCard);
    }

    @given('I bowl all 5s')
    public async bowlAllFives(){
        const throws: string =  new Array<string>(ThrowTally.MAX_THROWS).fill('5').join(',');

        this.scoreCard = await this.getScoreCard(throws);

        assert(this.scoreCard);
    }

    @when('I quit the game')
    public endTheGame() {
    }

    @then('my score should be {int}')
    public finalScoreShouldBeEqual(expectedFinalScore: number) {
        assert(this.scoreCard && this.scoreCard.finalScore);
        assert(this.scoreCard.finalScore === expectedFinalScore);
    }
}
