import dotenv from 'dotenv';

export class Environment {
    private static instance: Environment

    constructor() {
        dotenv.config();
    }

    public static getInstance(): Environment {
        if (!this.instance) {
            this.instance = new Environment()
        }

        return this.instance;
    }

    // The NETLIFY env variable is automagically set by Netlify system
    public get isNetlify(): boolean {
        return process.env.NETLIFY ? true : false;
    }

    public get apiPrefix(): string {
        return '.netlify/functions/';
        return this.isNetlify ? '.netlify/functions/' : '';
    }
}