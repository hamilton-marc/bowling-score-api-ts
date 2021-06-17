/**
 * These classes represent the concept of a Bowling Score Card.
 * A ScoreCard consists of 10 frames. Each frame consists of at least 2 throws.
 * A FrameScore represents both the pins that were knocked down and the 
 * score for that frame
 * 
 */

export class FrameScore {
    public static readonly DEFAULT_THROW_COUNT: number = 2;

    constructor (
        private throwValues: number[] = new Array(FrameScore.DEFAULT_THROW_COUNT),
        private scoreValue: number = 0
        ) {
    }

    /** sets the array of throws for this frame */
    set throws(throwValues: number[]) {
        this.throwValues = throwValues;
    }

    /** gets the array of throws for this frame */
    get throws(): number[] {
        return this.throwValues;
    }

    /** sets the score for this frame */
    set score(score: number) {
        this.scoreValue = score;
    }

    /** gets the score for this frame */
    get score(): number {
        return this.scoreValue;
    }
}

export class ScoreCard {
    private readonly DEFAULT_MAX_FRAMES: number = 10;
    private frameScores: FrameScore[] = [];
    private finalScoreValue: number = 0;

    constructor() {}

    /** gets the number of FrameScores currently collected in this ScoreCard */
    public get length(): number {
        return this.frameScores.length;
    }

    /** gets the final score for the game this score card represents */
    public get finalScore(): number {
        return this.finalScoreValue;
    }

    /** sets the final score for the game this score card represents */
    public set finalScore(value: number) {
        this.finalScoreValue = value;
    }

    /** adds an additional FrameScore to this ScoreCard */
    public addFrameScore(frameScore: FrameScore): void {
        this.frameScores.push(frameScore);
    }

    /** overwrites a FrameScore in this ScoreCard at the given index */
    public setFrameScore(index: number, frameScore: FrameScore): void {
        this.frameScores[index] = frameScore;
    }

    /** retrieves the FrameScore at the given index */
    public getFrameScore(index: number): FrameScore {
        return this.frameScores[index];
    }

    /** returns a copy of the array of Framescores */
    public getFrameScores(): FrameScore[] {
        return [...this.frameScores];
    }
}