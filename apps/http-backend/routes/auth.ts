import { Router } from "express";
import { signupRequest } from "../services/auth/signup";
import { loginRequest } from "../services/auth/login";
import { commonMiddleware } from "../middleware/common";
import { meRequest } from "../services/auth/me";

export const authRouter = Router();

authRouter.post("/signup", signupRequest)
authRouter.post("/login", loginRequest)
authRouter.post("/me", commonMiddleware ,meRequest)
