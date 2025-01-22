import express from "express";
import { deleteSelf, getSelf, updateSelf } from "../controllers/selfController";

const selfRouter = express.Router();

// get self
selfRouter.get("/", getSelf);

// update self
selfRouter.patch("/", updateSelf);

// delete self
selfRouter.delete("/", deleteSelf);

export default selfRouter;
