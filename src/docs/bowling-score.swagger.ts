import { ThrowTally } from "../models";

export const bowlingScore = {
    get: {
        tags: ['BowlingScore'],
        description: "Returns a scorecard based on a set of bowling throws.",
        operationId: 'getBowlingScore',
        parameters: [
            {
                in: "query",
                name: "throws",
                type: "array",
                collectionFormat: "csv",
                required: true,
                items: {
                    type: "integer"
                }
            }
        ],
        responses: {
            "200": {          
                description: "Returns a scorecard based on a set of bowling throws.",
                "content": {
                    "application/json": {
                        schema: {
                            type: "object",
                            properties: {
                                length: {
                                    type: "integer",
                                    maximum: ThrowTally.MAX_FRAMES,
                                    description: "The number of frames"
                                },
                                frameScores: {
                                    type: "array",
                                    items: {
                                        type: "object",
                                        properties: {
                                            throwValues: {
                                                type: "array",
                                                items: {
                                                    type: "integer"
                                                }
                                            },
                                            score: {
                                                type: "integer"
                                            }
                                        }
                                    }
                                },
                                finalScore: {
                                    type: "integer",
                                    description: "The final score of the game"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
} 