import express from 'express';
import { Server } from 'net';
import { Server as OvernightServer } from '@overnightjs/core';
import Logger from 'jet-logger';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger';

import { ApiHealthController, BowlingScoreController } from './controllers';

export class ApiServer extends OvernightServer {
    private expressServer!: Server;

    constructor() {
        super(true);  // setting showLogs to true

        this.setupExpress();
        this.setupControllers();
    }

    private setupExpress(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
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
        this.expressServer = this.app.listen(port, () => {
            Logger.Imp('Server listening on port: ' + port);
        });
    }

    public stop(): void {
        this.expressServer.close(() => {
            Logger.Imp('Closing Server');
        });
    }
}
