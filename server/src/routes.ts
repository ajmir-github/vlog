import express from "express";
import authRouter from "./routes/authRoutes";

const appRouter = express.Router();

// auth routes
appRouter.post("/auth", authRouter);

// user routes
// post routes
// comment routes

export default appRouter;
