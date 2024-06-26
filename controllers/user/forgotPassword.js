import { v4 as uuidv4 } from 'uuid';
import "dotenv/config";

import HttpError from "../../helpers/HttpError.js";
import renderTemplate from "../../helpers/renderTemplate.js";
import sendEmail from "../../helpers/sendEmail.js";
import { User } from "../../models/user.js";

const { FRONTEND_URL } = process.env;

export const forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw HttpError(400, "User with this e-mail address does not exist");
        }

        const resetToken = uuidv4();
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000;
        await user.save();

        const forgotPasswordLink = `${FRONTEND_URL}/reset?resetToken=${resetToken}`;
        const emailHtml = await renderTemplate('resetPassword', { forgotPasswordLink });

        const verifyEmail = {
            to: email,
            subject: "Password reset",
            html: emailHtml
        }

        await sendEmail(verifyEmail);

        res.status(201).json({
            message: "Password recovery email has been sent"
        });

    } catch (error) {
        next(error);
    }
};
