/**
 * This class encapsulates and represents the concept of a score card.
 * A score card consits of 10 frames. Each frame contains 2 throws,
 * except for the 10th frame which contains an extra bonus throw
 * for a total of 3 throws.
 * 
 * The implementation is backed by a simple array with methods to get
 * the values for each frame.
 */
export class ScoreCard {
    public static EMPTY_THROW: number = -1;
    public static MAX_FRAMES: number = 10;

    // 10 frames * 2 throws + the potential for 1 extra in frame 10
    public static MAX_THROWS: number = 10 * 2 + 1;

    private throws: number[] = new Array(ScoreCard.MAX_THROWS).fill(ScoreCard.EMPTY_THROW);

    constructor() {}

    public getFrame(index: number): Array<number> {
        const start: number = index * 2;
        let end: number = start + 2;
        let frameSet: number[] = this.throws.slice(start, end);

        return frameSet;
    }

    public getThrow(throwIndex: number): number {
        return (this.throws[throwIndex]);
    }

    public setThrow(throwIndex: number, pinCount: number) {
        this.throws[throwIndex] = pinCount;
    }
}