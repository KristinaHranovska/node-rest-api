import Joi from "joi";


export const addWaterRecordSchema = Joi.object({
    amount: Joi.number().required(),
    hours: Joi.number().integer().min(0).max(23).optional(),
    minutes: Joi.number().integer().min(0).max(59).optional(),
    date: Joi.date().optional(),
    owner: Joi.string()
});


export const updateWaterRecordSchema = Joi.object({
    amount: Joi.number().required()
});


 export const monthYearSchema = Joi.object({
    year: Joi.string().regex(/^\d{4}$/).required(),
    month: Joi.string().regex(/^(0?[1-9]|1[012])$/).required()
});


export const dateSchema = Joi.object({
    date: Joi.string().isoDate().required()
});