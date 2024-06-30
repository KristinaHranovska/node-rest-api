import mongoose from "mongoose";
import { nanoid } from "nanoid";
import moment from "moment-timezone";

import WaterRecord from "../../models/waterRecord.js";
import { User } from "../../models/user.js";
import HttpError from "../../helpers/HttpError.js";
import {
  addWaterRecordSchema,
  dateSchema,
  monthYearSchema,
  updateWaterRecordSchema,
} from "../../schemas/waterRecordSchema.js";

export const addWaterRecord = async (req, res, next) => {
  const { amount, hours, minutes } = req.body;
  const owner = req.user.id;

  let recordDate;

  const userTimezone = req.headers["timezone"] || "UTC";

  if (hours !== undefined && minutes !== undefined) {
    const now = moment().tz(userTimezone);

    recordDate = now.set({
      hour: hours,
      minute: minutes,
      second: 0,
      millisecond: 0,
    });
  } else {
    recordDate = moment().tz(userTimezone);
  }

  const record = {
    amount: amount,
    date: recordDate.toDate(),
    owner: owner,
  };

  const { error, value } = addWaterRecordSchema.validate(record);

  if (error) {
    return next(HttpError(400, error.message));
  }

  try {
    const newWaterRecord = await WaterRecord.create(record);

    res
      .status(201)
      .send({ newWaterRecord, message: "Water record succesfully added" });
  } catch (error) {
    next(error);
  }
};

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

    if (existingRecord.owner.toString() !== req.user.id) {
      return next(HttpError(404));
    }

    const updatedWaterRecord = {
      amount: amount !== undefined ? amount : existingRecord.amount,
    };

    const { error, value } =
      updateWaterRecordSchema.validate(updatedWaterRecord);
    if (error) {
      return next(HttpError(400, error.message));
    }

    const newWaterRecord = await updateAmount(id, updatedWaterRecord, {
      new: true,
    });

    res
      .status(200)
      .json({ newWaterRecord, message: "Water record succesfully updated" });
  } catch (error) {
    next(error);
  }
};

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

    if (record.owner.toString() !== req.user.id) {
      return next(HttpError(403, "Access denied"));
    }

    const deletedRecord = await WaterRecord.findByIdAndDelete(id);

    res
      .status(200)
      .send({ deletedRecord, message: "Water record succesfully deleted" });
  } catch (error) {
    next(error);
  }
};

export const getDailyWaterRecord = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { date } = req.params;

    const user = await User.findById(userId);

    if (!user) {
      return next(HttpError(404, "User not found"));
    }

    const { error, value } = dateSchema.validate(req.params);

    if (error) {
      return next(HttpError(400, error.message));
    }

    const userTimezone = req.headers["timezone"] || "UTC";

    const startOfDay = moment.tz(date, userTimezone).startOf("day").toDate();
    const endOfDay = moment.tz(date, userTimezone).endOf("day").toDate();

    const records = await WaterRecord.find({
      owner: userId,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    const totalAmountForDay = records
      .reduce((acc, record) => acc + record.amount, 0)
      .toFixed(2);

    const percentComplete = Math.floor(
      (totalAmountForDay / user.dailyWaterNorm) * 100
    );

    res.json({ totalAmountForDay, percentComplete: percentComplete >= 100 ? 100 : percentComplete, records });
  } catch (error) {
    next(error);
  }
};

export const getMonthlyWaterRecord = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return next(HttpError(404, "User not found"));
    }

    const userTimezone = req.headers["timezone"] || "UTC";

    const year = parseInt(req.params.year) || new Date().getFullYear();
    const month = parseInt(req.params.month) - 1 || new Date().getMonth();

    const startOfMonth = moment
      .tz({ year, month, day: 1 }, userTimezone)
      .startOf("day");
    const endOfMonth = moment
      .tz({ year, month, day: 1 }, userTimezone)
      .endOf("month")
      .endOf("day");

    const utcStartOfMonth = startOfMonth.clone().utc();
    const utcEndOfMonth = endOfMonth.clone().utc();

    const waterRecords = await WaterRecord.find({
      owner: userId,
      date: { $gte: utcStartOfMonth.toDate(), $lte: utcEndOfMonth.toDate() },
    });

    const groupedByDay = waterRecords.reduce((acc, record) => {
      const localDate = moment.tz(record.date, userTimezone);
      const day = localDate.format("YYYY-MM-DD");

      if (!acc[day]) {
        acc[day] = 0;
      }

      acc[day] += record.amount;
      return acc;
    }, {});

    const daysInMonth = [];

    for (let day = 1; day <= endOfMonth.date(); day++) {
      const date = moment.tz({ year, month, day }, userTimezone);
      const formattedDate = date.format("YYYY-MM-DD");
      const totalAmount = groupedByDay[formattedDate] || 0;
      const percentComplete = (totalAmount / user.dailyWaterNorm) * 100;

      daysInMonth.push({
        id: nanoid(),
        day: formattedDate,
        totalAmount: totalAmount.toFixed(2),
        percentComplete: percentComplete.toFixed(2),
      });
    }

    const totalWaterForMonth = waterRecords.reduce(
      (sum, record) => sum + record.amount,
      0
    );

    res.status(200).send({
      totalWaterForMonth: totalWaterForMonth.toFixed(2),
      daysInMonth: daysInMonth,
    });
  } catch (error) {
    next(error);
  }
};

function convertToUserTimezone(date, timezone) {
  return new Date(date.toLocaleString("en-US", { timeZone: timezone }));
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
