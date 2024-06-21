import bcrypt from "bcrypt";

import { User } from "../../schemas/user.js"
import HttpError from "../../helpers/HttpError.js";

export const registration = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user) {
            throw HttpError(409, "Email already in use");
        }

        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ ...req.body, password: hashPassword });

        res.status(201).json({
            email: newUser.email,
            token: newUser.token,
        })
    }
    catch (error) {
        next(error)
    }
}