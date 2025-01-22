import express from "express";
import {
  createVideo,
  deleteVideo,
  getVideos,
  updateVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/", getVideos);
videoRouter.post("/", createVideo);
videoRouter.patch("/", updateVideo);
videoRouter.delete("/", deleteVideo);

export default videoRouter;
