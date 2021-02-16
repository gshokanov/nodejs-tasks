import * as Joi from '@hapi/joi';
import { permissions } from '../types/permission';

export const groupSchema = Joi.object({
    name: Joi.string().required(),
    permissions: Joi.array().items(Joi.string().valid(...permissions)).required()
});
