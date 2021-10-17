import { ApiServer } from './server';
import dotenv from 'dotenv';

const apiServer = new ApiServer();
let serverlessHandler = null;

dotenv.config();

// The NETLIFY env variable is automagically set by Netlify system
if (process.env.NETLIFY) {
    let serverless = require('serverless-http'); 
    serverlessHandler = serverless(apiServer.expressApp);
}
else{
    apiServer.start();
}

export const handler = serverlessHandler;

