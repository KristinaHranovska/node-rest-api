import mongoose from "mongoose";
import moment from 'moment-timezone';

import WaterRecord from "../../models/waterRecord.js"
import HttpError from "../../helpers/HttpError.js"
import { 
    addWaterRecordSchema, 
    dateSchema, 
    monthYearSchema, 
    updateWaterRecordSchema 
} from "../../schemas/waterRecordSchema.js";




export const addWaterRecord = async (req, res, next) => {

    const { amount, hours, minutes  } = req.body;


    let recordDate;

    const userTimezone = req.headers['timezone'] || 'UTC';

    if (hours !== undefined && minutes !== undefined) {
        const now = moment().tz(userTimezone); 
        
        recordDate = now.set({
            hour: hours,
            minute: minutes,
            second: 0,
            millisecond: 0
        });

    } else {

        recordDate = moment().tz(userTimezone); 
    }


    const record = {
        amount: amount,
        date: recordDate.toDate(),
        // owner: req.user.id//
    };
 
    const { error, value } = addWaterRecordSchema.validate(record);

    if (error) {
        return next(HttpError(400, error.message));
    }


    try {
        const newWaterRecord = await WaterRecord.create(record);

        res.status(201).send(newWaterRecord);

    } catch (error) {
        next(error);
    }

}



export const updateWaterRecord = async (req, res, next) => {
     
    try {

        const { id } = req.params;
        const { amount } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(HttpError(400, "Invalid ID format"));
        }

        if (amount === undefined) {
            return next(HttpError(400, "Missing field amount"));
        }

        
        const existingRecord = await WaterRecord.findById(id);
        if (!existingRecord) {
            return next(HttpError(404));
        }


        // if (existingRecord.owner.toString() !== req.user.id) {
        //     return next(HttpError(404));
       
        // }  


        const updatedWaterRecord = {
            amount: amount !== undefined ? amount : existingRecord.amount
        };


        const { error, value } = updateWaterRecordSchema.validate(updatedWaterRecord);
        if (error) {
            return next(HttpError(400, error.message));
        }

        
        const newWaterRecord = await updateAmount(id, updatedWaterRecord, { new: true });

        res.status(200).json(newWaterRecord);

    } catch (error) {        
        next(error);
    }
}




export const deleteWaterRecord = async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(HttpError(400, "Invalid ID format"));
    }

    try {
        const record = await WaterRecord.findById(id);

        if (!record) {
            return next(HttpError(404));
        }

        // if (record.owner.toString() !== req.user.id) {
        //     return next(HttpError(403, "Access denied"));
        // }

        const deletedRecord = await WaterRecord.findByIdAndDelete(id);

        res.status(200).send(deletedRecord);
    } catch (error) {
        next(error);
    }
};



export const getDailyWaterRecord = async (req, res, next) => {
    try {

        const { error, value } = dateSchema.validate(req.params);

        if (error) {
            return next(new Error(`Invalid parameters: ${error.message}` ));
        }

    
        const { date } = req.params;
        const userTimezone = req.headers['timezone'] || 'UTC';

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const records = await WaterRecord.find({ 
            owner: req.user.id,
            date: {
                $gte: convertToUserTimezone(startOfDay, userTimezone),
                $lte: convertToUserTimezone(endOfDay, userTimezone)
            }
        });

        const totalAmount = records.reduce((acc, record) => acc + record.amount, 0);

        res.status(200).send({ totalAmount });
    } catch (error) {
        next(error);
    }
}


export const getMonthlyWaterRecord = async (req, res, next) => {
    try {

        const { error, value } = monthYearSchema.validate(req.params);

        if (error) {
            return next(new Error(`Invalid parameters: ${error.message}`));
        }


        const { year, month } = req.params;
        const userTimezone = req.headers['timezone'] || 'UTC';

        const startOfMonth = new Date(year, month - 1, 1);
        const endOfMonth = new Date(year, month, 0);
        endOfMonth.setHours(23, 59, 59, 999);


        const records = await WaterRecord.find({
            owner: req.user.id,
            date: {
                $gte: convertToUserTimezone(startOfMonth, userTimezone),
                $lte: convertToUserTimezone(endOfMonth, userTimezone)
            }
        });


        const totalAmount = records.reduce((acc, record) => acc + record.amount, 0);

        res.status(200).send({ totalAmount });

    } catch (error) {
        next(error);
    }
};




export const calculateWaterStats = async (req, res, next) => {

    const id = req.params;

    try {
        const user = await User.findById(id);// поставити правильного user i owner

        if (!user) {//
            return next(HttpError(404));
        }

        // отримання щоденної суми води 
        const dailyWaterSum = await getDailyWaterRecord(id); 

        // різниця
        const difference = user.dailyWaterNorm - dailyWaterSum;

        // відсоткі
        const percentComplete = (dailyWaterSum / user.dailyWaterNorm) * 100;

        res.status(200).json({dailyWaterSum, difference, percentComplete});

    } catch (error) {
        next(error);
    }
};// перевірити



function convertToUserTimezone(date, timezone) {
    return new Date(date.toLocaleString('en-US', { timeZone: timezone }));
}



const updateAmount = async (id, body) => {

    const existingRecord = await WaterRecord.findById(id);
    if (!existingRecord) {
        return next(HttpError(404));
    }


    existingRecord.amount = body.amount;

    await existingRecord.save();
    
    return existingRecord;
};


