import { binding, given, then, when} from 'cucumber-tsflow';

@binding()
export class BowlingSteps {

    @given('I am playing a single player game')
    public createNewGame(){
        return 'pending';
    }

    @given('I throw a ball and knock down {int} pins')
    public throwBallAndKnockDownPins(pins: number){
        return 'pending';
    }

    @when('I quit the game')
    public endTheGame(){
        return 'pending';
    }

    @then('my score should be {int}')
    public finalScoreShouldBeEqual(expectedFinalScore: number){
        return 'pending';
    }
}
