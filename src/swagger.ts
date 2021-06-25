import { apiHealth } from './docs';
import { bowlingScore } from './docs';

export const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        version: '0.0.1',
        title: 'Bowling Score API Documentation',
        description: 'API documentation for the Bowling Score API',
        termsOfService: '',
        contact: {
            name: 'Marc Hamilton',
            email: 'unionhills@cox.net',
            url: ''
        },
        license: {
            name: 'Apache 2.0',
            url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
        }
    },
    tags: [
        {
            name: 'Bowling Scores API'
        }
    ],
    paths: {
        "/api": apiHealth,
        "/api/score": bowlingScore
    }
};
