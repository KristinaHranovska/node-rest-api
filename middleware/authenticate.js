import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import { User } from "../models/user.js";
import "dotenv/config";

const { SECRET_KEY } = process.env;

export const authenticate = async (req, res, next) => {
    if (req.path === '/users/refresh-tokens') {
        return next();
    }

    const { authorization = "" } = req.headers;
    const [bearer, token] = authorization.split(" ");

    if (bearer !== "Bearer") {
        return next(HttpError(401, "Not authorized"));
    }

    try {
        const { id } = jwt.verify(token, SECRET_KEY);
        const user = await User.findById(id);

        if (!user || user.token !== token || !user.token) {
            return next(HttpError(401, "Not authorized"));
        }

        req.user = user;
        next();
    } catch (error) {
        next(HttpError(401, "Not authorized"));
    }
};
