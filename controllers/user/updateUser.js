import HttpError from "../../helpers/HttpError.js";
import { User } from "../../models/user.js";
import cloudinary from "../../config/cloudinaryConfig.js";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const updateUser = async (req, res, next) => {
    try {
        const { _id } = req.user;
        const { name, email, gender, weight, dailyActivityTime, dailyWaterNorm } = req.body;

        const updateData = { name, email, gender, weight, dailyActivityTime, dailyWaterNorm };

        if (req.file) {
            const filePath = path.join(__dirname, '../../tmp', req.file.filename);
            const result = await cloudinary.uploader.upload(filePath, {
                folder: 'AquaTrack',
                public_id: `${_id}-avatar`,
                overwrite: true,
                transformation: [{ width: 200, height: 200, crop: "fill" }]
            });
            updateData.avatar = result.secure_url;
            await fs.unlink(filePath);
        }

        const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });

        if (!updatedUser) {
            return next(HttpError(404, "User not found"));
        }

        res.json(updatedUser);
    } catch (error) {
        next(error);
    }
};
