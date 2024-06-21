import { Schema, model } from 'mongoose';
import Joi from 'joi';
import mongooseError from '../helpers/mongooseError.js';

const validationEmail = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
const genderEnum = ["woman", "man"];

const userSchema = new Schema({
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        match: validationEmail,
        unique: true,
    },
    name: {
        type: String,
        default: "User",
    },
    gender: {
        type: String,
        enum: genderEnum,
        default: "woman",
    },
    weight: {
        type: Number,
        default: 0,
    },
    dailyActivityTime: {
        type: String,
        default: "00:00",
    },
    dailyWaterNorm: {
        type: Number,
        default: 1.5,
    },
    avatarURL: {
        type: String,
    },
    token: {
        type: String,
        default: null,
    },
    refreshToken: {
        type: String,
        default: null,
    },
}, { versionKey: false, timestamps: true });

userSchema.post('save', mongooseError);

const registerSchema = Joi.object({
    email: Joi.string().pattern(validationEmail).required(),
    password: Joi.string().min(6).max(22).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().pattern(validationEmail).required(),
    password: Joi.string().min(6).max(22).required(),
});

export const Schemas = {
    registerSchema,
    loginSchema,
};
export const User = model("user", userSchema);