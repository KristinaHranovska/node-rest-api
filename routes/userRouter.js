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
import { updateUser } from "../controllers/user/updateUser.js";
import upload from "../middleware/multerConfig.js";
import { googleAuth, googleRedirect } from "../controllers/user/googleAuthController.js";
import { updateUserPassword } from "../controllers/user/updateUserPassword.js";
import { forgotPassword } from "../controllers/user/forgotPassword.js";

const userRouter = express.Router();

userRouter.post("/signup", validateBody(Schemas.registerSchema), registration)

userRouter.get('/verify/:verificationToken', verifyEmail);

userRouter.get('/happy', getUsersCountAndAvatar);

userRouter.post("/signin", validateBody(Schemas.loginSchema), authorization)

userRouter.get('/profile', authenticate, getCurrentUser);

userRouter.post("/logout", authenticate, logout);

userRouter.post("/refresh-tokens", authenticate, refreshTokens);

userRouter.patch("/update", authenticate, upload.single('avatar'), updateUser);

userRouter.patch("/reset", validateBody(Schemas.passwordSchema), updateUserPassword);

userRouter.post("/forgot", validateBody(Schemas.emailSchema), forgotPassword);

userRouter.get("/google", googleAuth);

userRouter.get("/google-redirect", googleRedirect);

export default userRouter;
