import express from "express";
import { signIn } from "./controllers/authController";

const appRouter = express.Router();

// auth routes
appRouter.post("/auth/sign-in", signIn);
// user routes
// post routes
// comment routes

export default appRouter;
