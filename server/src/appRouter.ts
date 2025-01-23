import express from "express";
import authRouter from "./routes/authRoutes";
import selfRouter from "./routes/selfRoutes";
import commentRouter from "./routes/commnetRoutes";
import postRouter from "./routes/postRoutes";
import userRouter from "./routes/userRoutes";

const appRouter = express.Router();

appRouter.use("/auth", authRouter);
appRouter.use("/self", selfRouter);
appRouter.use("/users", userRouter);
appRouter.use("/posts", postRouter);
appRouter.use("/comments", commentRouter);

export default appRouter;
