/**
 * This class encapsulates and represents the throws that a player
 * makes during the course of a game.
 * A score card consits of 10 frames. Each frame contains 2 throws,
 * except for the 10th frame which contains an extra bonus throw
 * for a total of 3 throws.
 * 
 * The implementation is backed by a simple array with methods to get
 * the values for each frame.
 */
export class ThrowTally {
    public static readonly MAX_FRAMES: number = 10;
    public static readonly MAX_PINS: number = 10;

    // 10 frames * 2 throws + the potential for 1 extra in frame 10
    public static readonly MAX_THROWS: number = 10 * 2 + 1;

    constructor(
        private throws: number[] = new Array(ThrowTally.MAX_THROWS).fill(0)
    ) {}

    public getFrame(index: number): Array<number> {
        const start: number = index * 2;
        let end: number = start + 2;

        if (index + 1 === ThrowTally.MAX_FRAMES) {
            end = start + 3;
        }

        let frameSet: number[] = this.throws.slice(start, end);

        return frameSet;
    }

    public getThrowFromFrame(frameIndex: number, throwIndexInFrame: number): number {
        const value = this.getFrame(frameIndex)[throwIndexInFrame];

        return value;
    }

    public setThrowInFrame(frameIndex: number, throwIndexInFrame: number, pinCount: number) {
        this.throws[frameIndex * 2 + throwIndexInFrame] = pinCount;
    }

    public getThrow(throwIndex: number): number {
        return (this.throws[throwIndex]);
    }

    public setThrow(throwIndex: number, pinCount: number) {
        this.throws[throwIndex] = pinCount;
    }
}