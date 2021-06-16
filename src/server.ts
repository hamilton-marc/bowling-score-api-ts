import express from 'express';
import { Server } from '@overnightjs/core';
import Logger from 'jet-logger';
import { BowlingScoreCalculator } from './services';
import { ApiHealthController, BowlingScoreController } from './controllers';

export class ApiServer extends Server {
    constructor() {
        super(true);  // setting showLogs to true

        this.setupExpress();
        this.setupControllers();
    }

    private setupExpress(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private setupControllers(): void {
        const ctlrInstances = [
            new ApiHealthController(),
            new BowlingScoreController()
        ];

        super.addControllers(ctlrInstances);
    }
/*
    public get expressApp(): Application {
        return this.app;
    }
*/
    public start(port: number = 3000): void {
        this.app.listen(port, () => {
            Logger.Imp('Server listening on port: ' + port);
        })
    }
}
