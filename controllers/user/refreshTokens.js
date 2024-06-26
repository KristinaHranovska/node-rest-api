import jwt from 'jsonwebtoken';
import { User } from "../../models/user.js";
import HttpError from "../../helpers/HttpError.js";
import "dotenv/config";

const { SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

export const refreshTokens = async (req, res, next) => {
    try {
        const { refreshToken: oldRefreshToken } = req.body;

        try {
            jwt.verify(oldRefreshToken, REFRESH_SECRET_KEY);
        } catch (error) {
            return next(HttpError(401, "Refresh token is invalid or expired"));
        }

        const { id } = jwt.decode(oldRefreshToken);
        const user = await User.findById(id);

        if (!user) {
            throw HttpError(404, "User not found");
        }

        const payload = { id: user._id };
        const newToken = jwt.sign(payload, SECRET_KEY, { expiresIn: "30m" });
        const newRefreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: "30d" });

        await User.findByIdAndUpdate(user._id, { token: newToken, refreshToken: newRefreshToken });

        res.json({
            token: newToken,
            refreshToken: newRefreshToken
        });
    } catch (error) {
        next(error);
    }
}
