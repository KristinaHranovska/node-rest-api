import express from "express";
import { authenticate } from "../middleware/authenticate.js";
import { addWater, getWater } from '../controllers/waterController.js';

const waterRouter = express.Router();

waterRouter.post('/water', authenticate, addWater);
waterRouter.get('/water', authenticate, getWater);

export default waterRouter;