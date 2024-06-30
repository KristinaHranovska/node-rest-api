import express from "express";

import {
    addWaterRecord,
    updateWaterRecord,
    deleteWaterRecord,
    getDailyWaterRecord,
    getMonthlyWaterRecord
} from "../controllers/water/waterRecordController.js";

const waterRouter = express.Router();


waterRouter.post("/", addWaterRecord);
waterRouter.put("/:id", updateWaterRecord);
waterRouter.delete("/:id", deleteWaterRecord);
waterRouter.get("/daily/:date", getDailyWaterRecord);
waterRouter.get("/monthly/:year/:month", getMonthlyWaterRecord);

export default waterRouter;