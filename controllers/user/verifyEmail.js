import { User } from "../../schemas/user.js";
import HttpError from "../../helpers/HttpError.js";

export const verifyEmail = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken });

        if (!user) {
            throw HttpError(404, "User not found");
        }

        if (user.isVerified) {
            return res.status(200).json({ message: "Email is already verified" });
        }

        user.isVerified = true;
        await user.save();

        res.status(200).json({ message: "Email verified successfully" });
    } catch (error) {
        next(error);
    }
};