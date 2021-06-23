/**
 * Specialized error classes to be able to identify validation type issues
 * that may occur as a result of the input passed into the service.
 */

export class BowlingScoreError extends Error {
    constructor(message: string) {
        super(message);

        Object.setPrototypeOf(this, BowlingScoreError.prototype);
    }
}

export class InvalidPinCombinationError extends BowlingScoreError {
    constructor(frameIndex: number) {
        super('Invalid number of pins thrown for frameIndex = ' + frameIndex);

        Object.setPrototypeOf(this, InvalidPinCombinationError.prototype);
    }
}