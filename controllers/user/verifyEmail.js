import HttpError from "../../helpers/HttpError.js";
import { TRACKER_URL } from "../../helpers/constants.js";
import { User } from "../../models/user.js";

export const verifyEmail = async (req, res, next) => {
    try {
        const { verificationToken } = req.params;
        const user = await User.findOne({ verificationToken });

        if (!user) {
            throw HttpError(404, "User not found");
        }

        if (user.isVerified) {
            return res.redirect(TRACKER_URL);
        }

        user.isVerified = true;
        await user.save();

        res.redirect(TRACKER_URL);
    } catch (error) {
        next(error);
    }
};