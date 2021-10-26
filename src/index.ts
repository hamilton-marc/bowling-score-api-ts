import { Environment } from './environment';
import { ApiServer } from './server';

const apiServer = new ApiServer();
let serverlessHandler = null;

if (Environment.getInstance().isNetlify) {
    let serverless = require('serverless-http'); 
    serverlessHandler = serverless(apiServer.expressApp);
}
else{
    apiServer.start();
}

export const handler = serverlessHandler;

