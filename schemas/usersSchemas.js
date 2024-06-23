import Joi from 'joi';
import { validationEmail } from '../helpers/constants.js';

const registerSchema = Joi.object({
    email: Joi.string().pattern(validationEmail).required(),
    password: Joi.string().min(6).max(22).required(),
    name: Joi.string().required(),
});

const loginSchema = Joi.object({
    email: Joi.string().pattern(validationEmail).required(),
    password: Joi.string().min(6).max(22).required(),
});

const emailSchema = Joi.object({
    email: Joi.string().pattern(validationEmail).required(),
})

export const Schemas = {
    registerSchema,
    loginSchema,
    emailSchema
};
