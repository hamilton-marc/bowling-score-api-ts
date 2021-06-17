import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { StatusCodes } from 'http-status-codes';
import Logger from 'jet-logger';
import { BowlingScoreCalculator } from '../services';
import { FrameScore, ScoreCard, ThrowTally } from '../models';
import { FrameScoreDTO, ScoreCardDTO } from '../shared/score-card.dto';

@Controller('api/score')
export class BowlingScoreController {
    constructor(
        private readonly bowlingCalcSvc: BowlingScoreCalculator = new BowlingScoreCalculator()
    ) {}

    @Get()
    private async getScoreCard(req: Request, res: Response): Promise<Response> {
        try {
            Logger.Info('BowlingScoreController::getScoreCard()');
            Logger.Info('Query: ' + JSON.stringify(req.query));

            const throws: string[] = req.query.throws ? req.query.throws.toString().split(',') : ['0'];
            const throwValues: number[] = throws.map((pins: string) => Number.parseInt(pins));

            const scoreCard: ScoreCard = this.bowlingCalcSvc.computeScoreCard(new ThrowTally(throwValues));
            const scoreCardDto: ScoreCardDTO = this.mapScoreCardToDTO(scoreCard);

            return res.status(StatusCodes.OK).json(scoreCardDto);
        } catch (err) {
            return this.handleError(err, res);
        }
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

    private handleError(err: any, res: Response): Response {
        Logger.Err(err, true);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            error: err.message
        });
    }
}
