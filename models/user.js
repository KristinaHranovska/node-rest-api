import { Schema, model } from 'mongoose';
import { genderEnum, validationEmail } from "../helpers/constants.js";
import mongooseError from '../helpers/mongooseError.js';

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
        default: "https://res.cloudinary.com/dntbkzhtq/image/upload/v1718990428/defaultAvatar.png"
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

export const User = model("user", userSchema);