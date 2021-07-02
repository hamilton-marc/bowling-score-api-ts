import { Request, Response } from 'express';
import { Controller, Get } from '@overnightjs/core';
import { StatusCodes } from 'http-status-codes';

import Logger from 'jet-logger';

/**
 * Simple path to be able to tell whether or not the API is up and running.
 * The format of the JSON corresponds to a proposed standard.
 *
 */
@Controller('api')
export class ApiHealthController {
    @Get()
    public getMessage(req: Request, res: Response): Response {
        return res.status(StatusCodes.OK).json({ status: 'pass' });
    }
}
