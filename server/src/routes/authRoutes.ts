import express from "express";
import { signIn, signUp } from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/sign-in", signIn);
authRouter.post("/sign-up", signUp);

export default authRouter;
