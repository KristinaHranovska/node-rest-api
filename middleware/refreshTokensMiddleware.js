import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import "dotenv/config";

const { REFRESH_SECRET_KEY } = process.env;

export const refreshTokensMiddleware = async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(HttpError(401, "Refresh token is required"));
    }

    try {
        const decoded = jwt.decode(refreshToken);
        if (!decoded) {
            return next(HttpError(401, "Refresh token is invalid"));
        }

        console.log("Decoded token:", decoded);

        jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err, payload) => {
            if (err) {
                console.error("Token verification error:", err);
                return next(HttpError(401, "Refresh token is invalid or expired"));
            }

            console.log("Verified payload:", payload);
            req.userId = payload.id;
            next();
        });
    } catch (error) {
        console.error("Error in refreshTokensMiddleware:", error);
        next(HttpError(401, "Refresh token is invalid or expired"));
    }
};
