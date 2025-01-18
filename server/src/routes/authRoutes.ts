import express from "express";
import {
  getAuth,
  signIn,
  signUp,
  deactivateUser,
  updateSelfUser,
} from "../controllers/authController";

const authRouter = express.Router();

authRouter.post("/sign-in", signIn);
authRouter.post("/sign-up", signUp);
// get and update
authRouter.get("/self", getAuth);
authRouter.patch("/self/deactivate", deactivateUser);
authRouter.patch("/self", updateSelfUser);

export default authRouter;
