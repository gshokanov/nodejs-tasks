import { RequestHandler } from 'express';
import * as jwt from 'jsonwebtoken';
import { config } from '../config/config';

export const jwtAuthorization: RequestHandler = (req, res, next) => {
    const { authorization } = req.headers;
    if (typeof authorization === 'undefined') {
        return res.sendStatus(401);
    }
    jwt.verify(authorization, config.secret, (err, decoded) => {
        if (err) {
            return res.sendStatus(403);
        }
        next();
    });
};
