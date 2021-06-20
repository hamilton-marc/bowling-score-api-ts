export class BowlingScoreError extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, BowlingScoreError.prototype);
    }
}

export class InvalidPinCombinationError extends Error {
    constructor(frameIndex: number) {
        super('Invalid number of pins thrown for frameIndex = ' + frameIndex);

        Object.setPrototypeOf(this, InvalidPinCombinationError.prototype);
    }
}