import { RequestHandler } from 'express';
import * as Joi from '@hapi/joi';
import { userSchema, autoSuggestListSchema } from '../schemas/user.schema';
import { groupSchema } from '../schemas/group.schema';
import { loginSchema } from '../schemas/login.schema';

const enum ValidationTarget {
    Body,
    QueryParams
};

function createValidator(schema: Joi.Schema, target = ValidationTarget.Body): RequestHandler {
    return (req, res, next) => {
        let parsedTarget: any;
        switch (target) {
            case ValidationTarget.Body:
                parsedTarget = req.body;
                break;
            case ValidationTarget.QueryParams:
                parsedTarget = req.query;
                break;
        }
        const { error } = schema.validate(parsedTarget, {
            abortEarly: false
        });
        if (error) {
            return res.status(400).json(error.details);
        }
        next();
    }
}

export const userValidator = createValidator(userSchema);
export const autoSuggestValidator = createValidator(autoSuggestListSchema, ValidationTarget.QueryParams);
export const groupValidator = createValidator(groupSchema);
export const loginValidator = createValidator(loginSchema);
