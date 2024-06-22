import express from "express";
import { Schemas } from "../schemas/usersSchemas.js";
import { validateBody } from "../helpers/validateBody.js";
import { registration } from "../controllers/user/registration.js";
import { verifyEmail } from "../controllers/user/verifyEmail.js";
import { getUsersCountAndAvatar } from "../controllers/user/getUsersCountAndAvatar.js";
import { authorization } from "../controllers/user/authorization.js";
import { authenticate } from "../middleware/authenticate.js";
import { getCurrentUser } from "../controllers/user/getCurrentUser.js";

const userRouter = express.Router();

userRouter.post("/signup", validateBody(Schemas.registerSchema), registration)

userRouter.get('/verify/:verificationToken', verifyEmail);

userRouter.get('/happy', getUsersCountAndAvatar);

userRouter.post("/signin", validateBody(Schemas.loginSchema), authorization)

userRouter.get('/current', authenticate, getCurrentUser);

// userRouter.get("/logout", authenticate, logout);


export default userRouter;