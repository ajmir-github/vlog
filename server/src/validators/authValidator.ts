import { z } from "zod";
import { validateBody } from "../middlewares/validator";
import { hashPassword } from "../utils/encryption";

export const signInValidator = validateBody(
  z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })
);

export const signUpValidator = validateBody(
  z.object({
    email: z.string().email(),
    password: z.string().min(6).transform(hashPassword),
    name: z.string().min(3),
    bio: z.string(),
  })
);
