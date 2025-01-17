import { z } from "zod";
import { PublicContext } from "../context";
import { validateBody } from "../middlewares/validator";

// sign in
export const signIn = PublicContext.use(
  validateBody(
    z.object({ email: z.string().email(), password: z.string().min(6) })
  )
).resolve(() => {});
// sign up
// get auth
// deactivate
