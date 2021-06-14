/**
 * These classes represent the concept of a Bowling Score Card.
 * A score card consists of 10 frames. Each frame consists of at least 2 throws.
 * 
 */

export class FrameScore {
    public static readonly DEFAULT_THROW_COUNT: number = 2;

    constructor (
        private throwValues: number[] = new Array(FrameScore.DEFAULT_THROW_COUNT),
        private scoreValue: number = 0
        ) {

    }

    set throws(throwValues: number[]) {
        this.throwValues = throwValues;
    }

    get throws(): number[] {
        return this.throwValues;
    }

    set score(score: number) {
        this.scoreValue = score;
    }

    get score(): number {
        return this.scoreValue;
    }
}

export class ScoreCard {
    private readonly DEFAULT_MAX_FRAMES: number = 10;
    private finalScoreValue: number = 0;
    private frameScores: FrameScore[] = [];

    constructor() {}

    public get length(): number {
        return this.frameScores.length;
    }

    public get finalScore(): number {
        return this.finalScoreValue;
    }

    public set finalScore(value: number) {
        this.finalScoreValue = value;
    }

    public addFrameScore(frameScore: FrameScore): void {
        this.frameScores.push(frameScore);
    }

    public setFrameScore(index: number, frameScore: FrameScore): void {
        this.frameScores[index] = frameScore;
    }

    public getFrameScore(index: number): FrameScore {
        return this.frameScores[index];
    }
}