import express from "express";
import { Schemas } from "../schemas/usersSchemas.js";
import { validateBody } from "../helpers/validateBody.js";
import { registration } from "../controllers/user/registration.js";
import { verifyEmail } from "../controllers/user/verifyEmail.js";
import { getUsersCountAndAvatar } from "../controllers/user/getUsersCountAndAvatar.js";
import { authorization } from "../controllers/user/authorization.js";
import { authenticate } from "../middleware/authenticate.js";
import { getCurrentUser } from "../controllers/user/getCurrentUser.js";
import { logout } from "../controllers/user/logout.js";
import { refreshTokens } from "../controllers/user/refreshTokens.js";

const userRouter = express.Router();

userRouter.post("/signup", validateBody(Schemas.registerSchema), registration)

userRouter.get('/verify/:verificationToken', verifyEmail);

userRouter.get('/happy', getUsersCountAndAvatar);

userRouter.post("/signin", validateBody(Schemas.loginSchema), authorization)

userRouter.get('/profile', authenticate, getCurrentUser);

userRouter.post("/logout", authenticate, logout);

userRouter.post("/refresh-tokens", authenticate, refreshTokens);

export default userRouter;