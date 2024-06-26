import Joi from 'joi';
import { validationEmail } from '../helpers/constants.js';

const registerSchema = Joi.object({
    email: Joi.string().pattern(validationEmail).required().messages({
        'string.email': 'Invalid email format'
    }),
    password: Joi.string().min(6).max(22).required(),
    name: Joi.string().required(),
});

const loginSchema = Joi.object({
    email: Joi.string().pattern(validationEmail).required().messages({
        'string.email': 'Invalid email format'
    }),
    password: Joi.string().min(6).max(22).required(),
});

const emailSchema = Joi.object({
    email: Joi.string().pattern(validationEmail).required().messages({
        'string.email': 'Invalid email format'
    })
})
const passwordSchema = Joi.object({
    resetToken: Joi.string().required(),
    password: Joi.string().min(6).max(22).required(),
})

export const Schemas = {
    registerSchema,
    loginSchema,
    emailSchema,
    passwordSchema
};
