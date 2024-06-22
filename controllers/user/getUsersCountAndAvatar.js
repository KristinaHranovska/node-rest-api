import { User } from "../../models/user.js";


export const getUsersCountAndAvatar = async (req, res, next) => {
    try {
        const userCont = await User.countDocuments({
            isVerified: {
                $ne: false
            }
        });

        const userAvatars = await User.distinct("avatarURL", {
            avatarURL: {
                $ne: "https://res.cloudinary.com/dntbkzhtq/image/upload/v1718990428/defaultAvatar.png"
            }
        });
        res.status(200).json({ count: userCont, avatars: userAvatars })
    } catch (error) {
        next(error)
    }
}

