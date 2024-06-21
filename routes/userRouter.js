import express from "express";
import { Schemas } from "../schemas/user.js";
import { validateBody } from "../helpers/validateBody.js";
import { registration } from "../controllers/user/registration.js";
// import { authenticate } from "../middleware/authenticate.js";

const userRouter = express.Router();

userRouter.post("/signup", validateBody(Schemas.registerSchema), registration)

// userRouter.post("/signin", validateBody(Schemas.loginSchema), authorization)

// userRouter.get("/logout", authenticate, logout);

// userRouter.get('/current', authenticate, getCurrentUser);

export default userRouter;