import express from "express";

import {
    addWaterRecord, 
    updateWaterRecord,
    deleteWaterRecord,
    getDailyWaterRecord,
    getMonthlyWaterRecord
} from "../controllers/water/waterRecordController.js";
import { calculateWaterStats } from "../controllers/water/waterPercent.js"

const waterRouter = express.Router();


waterRouter.post("/", addWaterRecord);
waterRouter.patch("/:id/amount", updateWaterRecord);
waterRouter.delete("/:id", deleteWaterRecord);
waterRouter.get("/daily/:date", getDailyWaterRecord);
waterRouter.get("/monthly/:year/:month", getMonthlyWaterRecord);
waterRouter.get("/stats/", calculateWaterStats);

export default waterRouter;