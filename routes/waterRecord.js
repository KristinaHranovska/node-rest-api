import express from "express";

import {
    addWaterRecord, 
    updateWaterRecord,
    deleteWaterRecord,
    getDailyWaterRecord,
    getMonthlyWaterRecord,
    calculateWaterStats
}from "../controllers/water/waterRecordController.js";


const waterRouter = express.Router();
const jsonParser = express.json();


waterRouter.post("/", jsonParser, addWaterRecord);
waterRouter.patch("/:id/amount", jsonParser, updateWaterRecord);
waterRouter.delete("/:id", deleteWaterRecord);
waterRouter.get("/daily/:date", jsonParser, getDailyWaterRecord);
waterRouter.get("/monthly/:year/:month", jsonParser, getMonthlyWaterRecord);
waterRouter.get("/percentage", calculateWaterStats);//

export default waterRouter;