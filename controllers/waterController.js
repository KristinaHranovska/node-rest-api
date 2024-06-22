import HttpError from "../helpers/HttpError.js";
import { Water } from "../schemas/water.js";

// Контролер для додавання запису про воду
export const addWater = async (req, res, next) => {
    try {
        const { _id: owner } = req.user;

        if (!req.body) {
            throw HttpError(400, 'Amount is required');
        }

        const newWater = await Water.create({ ...req.body, owner });

        res.status(201).json(newWater);
    } catch (error) {
        next(error);
    }
};

// Контролер для отримання записів про воду
export const getWater = async (req, res, next) => {
    try {
        const { _id: owner } = req.user;
        const waterEntries = await Water.find({ owner });

        res.status(200).json(waterEntries);
    } catch (error) {
        next(error);
    }
};
