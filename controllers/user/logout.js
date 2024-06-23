import HttpError from "../../helpers/HttpError.js";
import { User } from "../../models/user.js";

export const logout = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const user = await User.findByIdAndUpdate(_id, { token: "" });

        if (!user) {
            return next(HttpError(404, "User not found"));
        }

        res.json({ message: "You have successfully exited" });
    } catch (error) {
        next(error)
    }
}