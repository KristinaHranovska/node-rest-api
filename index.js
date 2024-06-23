import express from "express";
import morgan from "morgan";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import swaggerDocument from './swagger.js';
import swaggerUi from 'swagger-ui-express';
import userRouter from "./routes/userRouter.js";

import waterRecord from "./routes/waterRecord.js";

const app = express();
const { DB_HOST, PORT } = process.env;

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/users', userRouter);

app.use("/water", waterRecord);

app.use((_, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    const { status = 500, message = "Server error" } = err;
    res.status(status).json({ message });
});
  
mongoose.set('strictQuery', true);

mongoose.connect(DB_HOST)
    .then(() => {
        app.listen(PORT, () => {
            console.log("Database connection successful");
        });
    })
    .catch(error => {
        console.log(error.message);
        process.exit(1);
    });