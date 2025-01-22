import express from "express";
import authRouter from "./routes/authRoutes";
import selfRouter from "./routes/selfRoutes";
import commentRouter from "./routes/commnetRoutes";
import videoRouter from "./routes/videoRoutes";
import userRouter from "./routes/userRoutes";

const appRouter = express.Router();

appRouter.use("/auth", authRouter);
appRouter.use("/self", selfRouter);
appRouter.use("/users", userRouter);
appRouter.use("/videos", videoRouter);
appRouter.use("/comments", commentRouter);

export default appRouter;
