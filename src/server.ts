import express from 'express';
import { Application } from 'express';
import { Server } from 'net';
import { Server as OvernightServer } from '@overnightjs/core';
import Logger from 'jet-logger';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger';

import { ApiHealthController, BowlingScoreController } from './controllers';
import { Environment } from './environment';

/**
 * This class is responsible for setting up and configuring
 * express to be used as the server for our API
 */
export class ApiServer extends OvernightServer {
    private expressServer!: Server;

    constructor() {
        super(true);  // setting showLogs to true

        this.setupExpress();
        this.setupControllers();
    }

    /**
     * Boilerplate configuration of Express with the addition of a route
     * for our swagger documentation.
     */
    private setupExpress(): void {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use('/' + Environment.getInstance().apiPrefix + 'api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
    }

    /**
     * Set's up the controllers used for the health check
     * as well as calculating the bowing scores.
     */
     private setupControllers(): void {
        const ctlrInstances = [
            new ApiHealthController(),
            new BowlingScoreController()
        ];

        super.addControllers(ctlrInstances);
    }

    /**
     * Returns the instance of the express app
     */
    public get expressApp(): Application {
        return this.app;
    }

    /**
     * Starts the express server
     */
     public start(port: number = 3000): void {
        this.expressServer = this.app.listen(port, () => {
            Logger.Imp('Server listening on port: ' + port);
        });
    }

    /**
     * Stops the express server
     */
     public stop(): void {
        this.expressServer.close(() => {
            Logger.Imp('Closing Server');
        });
    }
}
