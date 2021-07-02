import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { StatusCodes } from 'http-status-codes';
import Logger from 'jet-logger';
import { BowlingScoreCalculator } from '../services';
import { FrameScore, ScoreCard, ThrowTally } from '../models';
import { FrameScoreDTO, ScoreCardDTO } from '../shared/score-card.dto';
import { BowlingScoreError } from '../shared/BowlingScoreError.error';

/**
 * The bowling score controller is the entry point to the API. There's really only 1
 * HTTP method (GET) which is used as there is no state persistence required for this
 * project.
 * 
 * The consumer of the web service will initiate a request containing a comma delimited
 * set of "throws" (max of 21) and then an object is returned representing the score card
 * 
 */
@Controller('api/score')
export class BowlingScoreController {
    constructor(
        private readonly bowlingCalcSvc: BowlingScoreCalculator = new BowlingScoreCalculator()
    ) {}

    /**
     * This method responds to an HTTP GET, expecting a "throws" parameter containing
     * a comma delimited set of consective bowling throws.
     *
     * @param req express request object
     * @param res express response object
     * @returns the response wrapped in a Promise
     */
    @Get()
    public async getScoreCard(req: Request, res: Response): Promise<Response> {
        try {
            Logger.Info('BowlingScoreController::getScoreCard()');
            Logger.Info('Query: ' + JSON.stringify(req.query));

            const throwTally: ThrowTally = this.mapInputToThrowTally(req);

            const scoreCard: ScoreCard = this.bowlingCalcSvc.computeScoreCard(throwTally);
            const scoreCardDto: ScoreCardDTO = this.mapScoreCardToDTO(scoreCard);

            return res.status(StatusCodes.OK).json(scoreCardDto);
        } catch (err) {
            return this.handleError(err, res);
        }
    }

    /**
     * Takes the query parameter we received as input, parses it,
     * validates it and maps it to a ThrowTally object
     * 
     * @param req - the incoming express request
     * @returns a ThrowTally object containing all of the bowling throws
     */
    private mapInputToThrowTally(req: Request): ThrowTally {
        if (!req.query || !req.query.throws ||
            !req.query.throws.length) {
            throw new BowlingScoreError('Invalid input. No bowling throws were provided. ' +
                                        'Use a "throws" query parameter with a comma delimited ' +
                                        'set of throw values indicating the number of pins ' +
                                        'knocked down for each throw.');
        }

        const throws: string[] = req.query.throws.toString().split(',');
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

    /**
     * Translates our ScoreCard object to a ScoreCardDTO interface used to pass
     * the ScoreCard info back to the consumer of this service.
     * 
     * @param scoreCard 
     * @returns a ScoreCardDTO
     */
    private mapScoreCardToDTO(scoreCard: ScoreCard): ScoreCardDTO {
        const scoreCardDto: ScoreCardDTO = {
            length: scoreCard.length,
            frameScores: this.mapFrameScoresToDtos(scoreCard.getFrameScores()),
            finalScore: scoreCard.finalScore
        }

        return scoreCardDto;
    }

    /**
     * Maps the scores that were calculated for each frame into a corresponding
     * DTO interface so this can be passsed back to the service consumer.
     *
     * @param frameScores - an array of FrameScore objects to be translated
     * @returns a corresponding array of FrameScoreDTOs
     */
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

    /**
     * If any sort of error happens during processing, process it appproapriately.
     * 
     * @param err - error
     * @param res - express response object
     * @returns express response object
     */
    private handleError(err: Error, res: Response): Response {
        let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

        if (err instanceof BowlingScoreError) {
            statusCode = StatusCodes.BAD_REQUEST;
        }
        else {
            Logger.Err(err, true);
        }

        return res.status(statusCode).json({
            error: err.message
        });
    }
}
