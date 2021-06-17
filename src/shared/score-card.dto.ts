export interface FrameScoreDTO {
    throwValues: number[];
    score: number;
}

export interface ScoreCardDTO {
    length: number;
    frameScores: FrameScoreDTO[];
    finalScore: number;
}