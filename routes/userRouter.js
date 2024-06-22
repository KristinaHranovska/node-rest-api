import express from "express";
import { Schemas } from "../schemas/user.js";
import { validateBody } from "../helpers/validateBody.js";
import { registration } from "../controllers/user/registration.js";
import { verifyEmail } from "../controllers/user/verifyEmail.js";
import { getUsersCount } from "../controllers/user/getUsersCount.js";
// import { authenticate } from "../middleware/authenticate.js";

const userRouter = express.Router();

userRouter.post("/signup", validateBody(Schemas.registerSchema), registration)

userRouter.get('/verify/:verificationToken', verifyEmail);

userRouter.get('/count', getUsersCount);

// userRouter.post("/signin", validateBody(Schemas.loginSchema), authorization)

// userRouter.get("/logout", authenticate, logout);

// userRouter.get('/current', authenticate, getCurrentUser);

export default userRouter;