import bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import "dotenv/config";

import HttpError from "../../helpers/HttpError.js";
import renderTemplate from "../../helpers/renderTemplate.js";
import sendEmail from "../../helpers/sendEmail.js";
import { User } from "../../models/user.js";

const { BASE_URL } = process.env;

export const registration = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;
        const user = await User.findOne({ email });
        const verificationToken = uuidv4();

        if (user) {
            throw HttpError(409, "Email already in use");
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ ...req.body, password: hashPassword, verificationToken });

        const verifyLink = `${BASE_URL}/users/verify/${verificationToken}`;
        const emailHtml = await renderTemplate('verifyEmail', { verifyLink });

        const verifyEmail = {
            to: email,
            subject: "Verify your email",
            html: emailHtml
        }

        await sendEmail(verifyEmail);

        res.status(201).json({
            name,
            email: newUser.email,
            message: "User registered successfully. Please check your email to verify your account."
        });
    }
    catch (error) {
        next(error)
    }
}