import jwt from 'jsonwebtoken';
import HttpError from "../../helpers/HttpError.js";
import { User } from "../../models/user.js";
import "dotenv/config";

const { SECRET_KEY, FRONTEND_URL } = process.env;

export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({ verificationToken: token });

        if (!user) {
            throw HttpError(404, "User not found");
        }

        if (user.isVerified) {
            const token = jwt.sign({ id: user._id }, SECRET_KEY, { expiresIn: '1d' });
            return res.redirect(`${FRONTEND_URL}/verify-email?token=${token}`);
        }

        user.isVerified = true;
        await user.save();

        const payload = { id: user._id };
        const tokenjwt = jwt.sign(payload, SECRET_KEY, { expiresIn: '1d' });

        await User.findByIdAndUpdate(user._id, { token: tokenjwt });

        return res.redirect(`${FRONTEND_URL}/verify-email?token=${tokenjwt}`);
    } catch (error) {
        next(error);
    }
};
