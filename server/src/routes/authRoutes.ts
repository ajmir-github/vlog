import express from "express";
import {
  getAuth,
  signIn,
  signUp,
  deactivateUser,
} from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/sign-in", signIn);
authRouter.post("/sign-up", signUp);
authRouter.get("/get-auth", getAuth);
authRouter.post("/deactivate", deactivateUser);

export default authRouter;
