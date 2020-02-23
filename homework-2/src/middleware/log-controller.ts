import { RequestHandler } from 'express';
import { logger } from '../config/logger';
import { isLogLevelActive } from '../helpers/isLogLevelActive';
import { LogLevel } from '../types/log';

export function logController(controllerName: string): RequestHandler {
    return (req, res, next) => {
        if (!isLogLevelActive(LogLevel.Info)) {
            return next();
        }
        const { baseUrl, method, body, query } = req;
        const messages: Array<string> = [
            `Controller: ${controllerName}`,
            `Route: ${baseUrl}`,
            `Method: ${method}`,
            `Body: ${JSON.stringify(body)}`,
            `Query params: ${JSON.stringify(query)}`
        ];
        const message = messages.join(', ');
        logger.info(message);
        next();
    }
}
