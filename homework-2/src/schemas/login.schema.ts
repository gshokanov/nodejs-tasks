import * as Joi from '@hapi/joi';

export const loginSchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().required()
});
