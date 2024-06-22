import { Schema, model } from 'mongoose';
import Joi from 'joi';
import mongooseError from '../helpers/mongooseError.js';
import { genderEnum, validationEmail } from '../helpers/constants.js';



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
        default: "https://res.cloudinary.com/dntbkzhtq/image/upload/v1718990428/11zon_cropped_yhd2pt.png"
    },
    token: {
        type: String,
        default: null,
    },
    refreshToken: {
        type: String,
        default: null,
    },
    verificationToken: {
        type: String,
        default: null,
    },
    isVerified: {
        type: Boolean,
        default: false,
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

const emailSchema = Joi.object({
    email: Joi.string().pattern(validationEmail).required(),
})

export const Schemas = {
    registerSchema,
    loginSchema,
    emailSchema
};

export const User = model("user", userSchema);