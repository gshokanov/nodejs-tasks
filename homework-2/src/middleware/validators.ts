import { RequestHandler } from 'express';
import { userSchema, autoSuggestListSchema } from '../schemas/user.schema';
import { groupSchema } from '../schemas/group.schema';

export const userValidator: RequestHandler = (req, res, next) => {
    const user = req.body;
    const { error } = userSchema.validate(user, {
        abortEarly: false
    });
    if (error) {
        return res.status(400).json(error.details);
    }
    next();
};

export const autoSuggestValidator: RequestHandler = (req, res, next) => {
    const options = req.query;
    const { error, value } = autoSuggestListSchema.validate(options, {
        abortEarly: false
    });
    if (error) {
        return res.status(400).json(error.details);
    }
    req.query = value;
    next();
};

export const groupValidator: RequestHandler = (req, res, next) => {
    const group = req.body;
    const { error } = groupSchema.validate(group, {
        abortEarly: false
    });
    if (error) {
        return res.status(400).json(error.details);
    }
    next();
};
