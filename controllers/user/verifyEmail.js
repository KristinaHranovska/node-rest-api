import jwt from 'jsonwebtoken';
import HttpError from "../../helpers/HttpError.js";
import { User } from "../../models/user.js";
import "dotenv/config";

const { SECRET_KEY, FRONTEND_URL, REFRESH_SECRET_KEY } = process.env;

export const verifyEmail = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken });

        if (!user) {
            throw HttpError(404, "User not found");
        }

        const payload = { id: user._id };
        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '30m' });
        const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: '7d' });

        if (user.isVerified) {
            return res.redirect(`${FRONTEND_URL}/tracker`);
        }

        user.isVerified = true;
        await user.save();

        await User.findByIdAndUpdate(user._id, { token, refreshToken });

        return res.redirect(`${FRONTEND_URL}/verify-email?token=${token}&refreshToken=${refreshToken}`);

    } catch (error) {
        next(error);
    }
};
