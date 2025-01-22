import { z } from "zod";
import { PrivateContext, PublicContext } from "../context";
import { validateBody, validateParams } from "../middlewares/validator";
import database from "../utils/database";
import { ErrorResponse } from "../ErrorHandling";
import { User } from "@prisma/client";

async function isAuthorizaed<
  Context extends { auth: User; params: { videoId: string } }
>(context: Context) {
  if (context.auth.role === "admin") return {};
  const video = await database.video.findUnique({
    where: { id: context.params.videoId },
  });
  if (!video) throw ErrorResponse.notFound("Video not found!");

  if (context.auth.id !== video.userId)
    throw ErrorResponse.unauthorized(
      "You are not allowed to change this video"
    );
  return {};
}

const validateVideoParams = validateParams(z.object({ videoId: z.string() }));

// get
export const getVideos = PublicContext.resolve(async () => {
  return await database.video.findMany();
});

// create
export const createVideo = PrivateContext.use(
  validateBody(z.object({ title: z.string(), description: z.string() }))
).resolve(async (context, request) => {
  const videoURL = "";
  const video = await database.video.create({
    data: {
      ...context.body,
      userId: context.auth.id,
      video: videoURL,
    },
  });
  return video;
});

// update
export const updateVideo = PrivateContext.use(validateVideoParams)
  .use(isAuthorizaed)
  .use(
    validateBody(
      z.object({ title: z.string(), description: z.string() }).partial()
    )
  )
  .resolve(async (context, request) => {
    const videoURL = "";
    const video = await database.video.update({
      where: { id: context.params.videoId },
      data: context.body,
    });
    return "Updated";
  });

// delete
export const deleteVideo = PrivateContext.use(validateVideoParams)
  .use(isAuthorizaed)
  .resolve(async (context) => {
    await database.video.delete({ where: { id: context.params.videoId } });
    return "Deleted!";
  });
