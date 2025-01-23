import { z } from "zod";
import { validateBody, validateParams } from "../middlewares/validator";

export const validatePostParams = validateParams(
  z.object({ postId: z.string() })
);

export const validateCreatePost = validateBody(
  z.object({
    title: z.string(),
    tags: z.array(z.string()),
    description: z.string(),
    playlistId: z.string().optional(),
  })
);

export const validateUpdatePost = validateBody(
  z
    .object({
      title: z.string(),
      tags: z.array(z.string()),
      description: z.string(),
      playlistId: z.string(),
      video: z.string(),
    })
    .partial()
);
