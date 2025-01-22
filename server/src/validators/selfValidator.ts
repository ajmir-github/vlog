import { z } from "zod";
import { validateBody } from "../middlewares/validator";
import { hashPassword } from "../utils/encryption";

export const updateSelfValidator = validateBody(
  z
    .object({
      email: z.string().email(),
      name: z.string().min(3),
      bio: z.string(),
      password: z.string().min(6).transform(hashPassword),
    })
    .partial()
);
