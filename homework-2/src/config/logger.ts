import * as winston from 'winston';
import { config } from './config';

export const logger = winston.createLogger({
    level: config.logLevel,
    format: winston.format.json(),
    defaultMeta: {
        service: 'rest-api'
    },
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});
