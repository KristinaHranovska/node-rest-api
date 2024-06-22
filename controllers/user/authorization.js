import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { User } from '../../schemas/user.js';
import HttpError from "../../helpers/HttpError.js";

const { SECRET_KEY } = process.env;

export const authorization = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            throw HttpError(401, "Email or password is wrong");
        }

        if (!user.isVerified) {
            throw HttpError(401, "Email is not verified");
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            throw HttpError(401, "Email or password is wrong");
        }

        const payload = {
            id: user._id,
        }

        const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
        await User.findByIdAndUpdate(user._id, { token })

        res.json({
            email: user.email,
            subscription: user.subscription,
            token
        })

    } catch (error) {
        next(error)
    }
}