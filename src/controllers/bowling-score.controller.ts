import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { StatusCodes } from 'http-status-codes';
import Logger from 'jet-logger';
import { BowlingScoreCalculator } from '../services';
import { FrameScore, ScoreCard, ThrowTally } from '../models';
import { FrameScoreDTO, ScoreCardDTO } from '../shared/score-card.dto';
import { BowlingScoreError } from '../shared/BowlingScoreError.error';

@Controller('api/score')
export class BowlingScoreController {
    constructor(
        private readonly bowlingCalcSvc: BowlingScoreCalculator = new BowlingScoreCalculator()
    ) {}

    @Get()
    public async getScoreCard(req: Request, res: Response): Promise<Response> {
        try {
            Logger.Info('BowlingScoreController::getScoreCard()');
            Logger.Info('Query: ' + JSON.stringify(req.query));

            const throwTally: ThrowTally = this.mapInputToThrowTally(req);
/*
            const throws: string[] = req.query.throws ? req.query.throws.toString().split(',') : ['0'];
            const throwValues: number[] = throws.map((pins: string) => Number.parseInt(pins));
*/
            const scoreCard: ScoreCard = this.bowlingCalcSvc.computeScoreCard(throwTally);
            const scoreCardDto: ScoreCardDTO = this.mapScoreCardToDTO(scoreCard);

            return res.status(StatusCodes.OK).json(scoreCardDto);
        } catch (err) {
            return this.handleError(err, res);
        }
    }

    private mapInputToThrowTally(req: Request): ThrowTally {
        if (!req.query || !req.query.throws ||
            !req.query.throws.length) {
            throw new BowlingScoreError('Invalid input. No bowling throws were provided. ' +
                                        'Use a "throws" query parameter with a comma delimited ' +
                                        'set of throw values indicating the number of pins ' +
                                        'knocked down for each throw.');
        }

        const throws: string[] = req.query.throws ? req.query.throws.toString().split(',') : ['0'];
        let throwValues: number[];

        if (throws.length > ThrowTally.MAX_THROWS) {
            throw new BowlingScoreError('Invalid input. The maximum number of throws allowed per game ' +
                                        'is ' + ThrowTally.MAX_THROWS);
        }

        throwValues = throws.map((pinsStr: string) => {
            const bowlingError = new BowlingScoreError(`Invalid input. Only numeric values between 0 and ${ThrowTally.MAX_PINS} ` +
                                                        'are allowed, indicating the number of pins that were knocked down for ' +
                                                        'each throw.');

            // Check to make sure the string is an integer
            // unfortunately, using a cryptic regular expression
            if (!/^\d+$/.test(pinsStr)) {
                throw bowlingError;
            }

            const pins: number = Number.parseInt(pinsStr);

            if (pins === NaN || pins < 0 || pins > ThrowTally.MAX_PINS) {
                throw bowlingError;
            }

            return pins;
        });


        return new ThrowTally(throwValues);
    }

    private mapScoreCardToDTO(scoreCard: ScoreCard): ScoreCardDTO {
        const scoreCardDto: ScoreCardDTO = {
            length: scoreCard.length,
            frameScores: this.mapFrameScoresToDtos(scoreCard.getFrameScores()),
            finalScore: scoreCard.finalScore
        }

        return scoreCardDto;
    }

    private mapFrameScoresToDtos(frameScores: FrameScore[]): FrameScoreDTO[] {
        const frameScoreDtos: FrameScoreDTO[] = frameScores.map( frameScore => {
            const frameScoreDto: FrameScoreDTO = {
                throwValues: frameScore.throws,
                score: frameScore.score
            }

            return frameScoreDto;
        });

        return frameScoreDtos;
    }

    private handleError(err: Error, res: Response): Response {
        Logger.Err(err, true);

        let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

        if (err instanceof BowlingScoreError) {
            statusCode = StatusCodes.BAD_REQUEST;
        }

        return res.status(statusCode).json({
            error: err.message
        });
    }
}
