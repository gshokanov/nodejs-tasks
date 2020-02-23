import { ErrorRequestHandler } from 'express';
import { logger } from '../config/logger';

function extractErrorMessage(err: Error | any): string {
    return typeof err === 'string'
    ? err
    : err?.message ?? JSON.stringify(err);
}

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
    const errorMessage = typeof err === 'string'
        ? err
        : err?.message ?? JSON.stringify(err);
    logger.error(errorMessage);
    res.sendStatus(500);
};

export function controllerErrorHandler(controllerName: string): ErrorRequestHandler {
    return (err, req, res, next) => {
        const errorMessage = extractErrorMessage(err);
        const { route, method, body, query } = req;
        const messages: Array<string> = [
            `Error in Controller: ${controllerName}`,
            `Route: ${route}`,
            `Method: ${method}`,
            `Body: ${JSON.stringify(body)}`,
            `Query params: ${JSON.stringify(query)}`
        ];
        messages.push(`Message: ${errorMessage}`);
        const message = messages.join(', ');
        logger.error(message);
        res.sendStatus(500);
    };
}
