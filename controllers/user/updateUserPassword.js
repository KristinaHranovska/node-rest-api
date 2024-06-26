import bcrypt from "bcrypt";
import "dotenv/config";

import HttpError from "../../helpers/HttpError.js";
import { User } from "../../models/user.js";

export const updateUserPassword = async (req, res, next) => {
    try {
        const { resetToken, password } = req.body;

        if (!resetToken) {
            throw HttpError(400, "Token is required");
        }

        const user = await User.findOne({ resetToken, resetTokenExpiry: { $gt: Date.now() } });

        if (!user) {
            throw HttpError(400, "Invalid or expired token");
        }

        const hashPassword = await bcrypt.hash(password, 10);

        user.password = hashPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();

        res.status(200).json({
            message: "Password has been reset successfully"
        });

    } catch (error) {
        next(error);
    }
};
