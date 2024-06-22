import { User } from "../../schemas/user.js"

export const getUsersCount = async (req, res, next) => {
    try {
        const userCont = await User.countDocuments({ isVerified: { $ne: false } });
        res.status(200).json({ count: userCont })
    } catch (error) {
        next(error)
    }
}

