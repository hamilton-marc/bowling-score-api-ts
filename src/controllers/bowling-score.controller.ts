import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { StatusCodes } from 'http-status-codes';
import Logger from 'jet-logger';
import { BowlingScoreCalculator } from '../services';
import { ScoreCard, ThrowTally } from '../models';

@Controller('api/score')
export class BowlingScoreController {
    constructor(
        private readonly bowlingCalcSvc: BowlingScoreCalculator = new BowlingScoreCalculator()
    ) {}

    @Get()
    private async getScoreCard(req: Request, res: Response): Promise<Response> {
        try {
            Logger.Info('BowlingScoreController::getScoreCard()');

            const scoreCard: ScoreCard = this.bowlingCalcSvc.computeScoreCard(new ThrowTally([6]));

            //ToDo: map score card to a DTO if necessary

            return res.status(StatusCodes.OK).json(scoreCard);
        } catch (err) {
            return this.handleError(err, res);
        }
    }

    private handleError(err: any, res: Response): Response {
        Logger.Err(err, true);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: err.message
        });
    }
}
