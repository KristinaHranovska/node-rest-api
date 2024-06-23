import jwt from 'jsonwebtoken';
import { User } from "../../models/user.js";
import HttpError from "../../helpers/HttpError.js";

const { SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

export const refreshTokens = async (req, res, next) => {
    try {
        const { token: oldToken, refreshToken: oldRefreshToken } = req.user;

        try {
            jwt.verify(oldToken, SECRET_KEY);
        } catch (error) {
            return next(HttpError(401, "Refresh token is invalid or expired"));
        }

        try {
            jwt.verify(oldRefreshToken, REFRESH_SECRET_KEY);
        } catch (error) {
            throw HttpError(401, "Refresh token is invalid or expired");
        }

        const payload = { id: req.user._id };
        const newToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "15m" });
        const newRefreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: "7d" });

        await User.findByIdAndUpdate(req.user._id, { token: newToken, refreshToken: newRefreshToken });

        res.json({
            token: newToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        next(error);
    }
}
