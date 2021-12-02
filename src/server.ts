import express from 'express';
import { Router, Application } from 'express';
import { Server } from 'net';
import { Server as OvernightServer } from '@overnightjs/core';
import Logger from 'jet-logger';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from './swagger';
//import expressListRoutes from 'express-list-routes';
const expressListRoutes = require('express-list-routes');
import http from 'http';

import { ApiHealthController, BowlingScoreController, SwaggerController } from './controllers';
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
//      this.app.use('/.netlify/functions/api-docs', swaggerUi.serve);
//      this.app.use(this.getSwaggerRoute(), swaggerUi.serve);
//      express.Router().use('/netlify', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    private getSwaggerRoute(): string {
        let apiPrefix = Environment.getInstance().apiPrefix;

        if (apiPrefix.startsWith('.')) {
            apiPrefix = '\\' + apiPrefix;
        }

        const swaggerRoute: string = '/' + apiPrefix + 'api-docs';

        Logger.Imp('Swagger Route: ' + swaggerRoute);

        return swaggerRoute;
    }

    /**
     * Set's up the controllers used for the health check
     * as well as calculating the bowing scores.
     */
     private setupControllers(): void {
        const ctlrInstances = [
            new ApiHealthController(),
            new BowlingScoreController(),
            new SwaggerController()
        ];

        super.addControllers(ctlrInstances);

      //this.app.get('/.netlify/functions/api-docs', swaggerUi.setup(swaggerDocument));

        expressListRoutes(this.app);
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
        }).on('error', (err) => {
            Logger.Err('Express startup error:\n' + err);
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
