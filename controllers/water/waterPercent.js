import HttpError from "../../helpers/HttpError.js";
import { User } from "../../models/user.js"
import waterRecord from "../../models/waterRecord.js";



export const calculateWaterStats = async (req, res, next) => {

    try {
        const id = req.user.id;

        const user = await User.findById(id);

        if (!user) {
            return next(HttpError(404));
        }


        const dailyWaterRecords = await waterRecord.find({
            id: id,
            date: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) } 
        });
    

        const dailyWaterSum = dailyWaterRecords.reduce((total, record) => total + record.amount, 0);

        const difference = user.dailyWaterNorm - dailyWaterSum;

        const percentComplete = (dailyWaterSum / user.dailyWaterNorm) * 100;

        res.status(200).send({dailyWaterSum, difference, percentComplete });

    } catch (error) {
        next(error); 
    }
};

