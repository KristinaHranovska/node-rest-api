import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import HttpError from "../../helpers/HttpError.js";
import { User } from "../../models/user.js";
import "dotenv/config";

const { SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

export const authorization = async (req, res, next) => {
    try {
        const { email, password, avatar } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw HttpError(400, "Email or password is wrong");
        }

        if (!user.isVerified) {
            throw HttpError(400, "Email is not verified");
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            throw HttpError(400, "Email or password is wrong");
        }

        const payload = {
            id: user._id,
        }

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "30m" });
        const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, { expiresIn: "30d" });
        await User.findByIdAndUpdate(user._id, { token, refreshToken })

        res.json({
            email: user.email,
            token,
            refreshToken,
            name: user.name,
            avatar,
            message: `Welcome back, ${user.name} to the AquaTrack!`
        })

    } catch (error) {
        next(error)
    }
}