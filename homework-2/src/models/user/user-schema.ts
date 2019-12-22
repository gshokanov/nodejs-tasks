import * as Joi from '@hapi/joi';

export const userSchema = Joi.object({
    login: Joi.string().required(),
    password: Joi.string().alphanum().required(),
    age: Joi.number().min(4).max(130).required()
});

export const autoSuggestListSchema = Joi.object({
    loginSubstring: Joi.string().required(),
    limit: Joi.number().min(1).default(10)
});
