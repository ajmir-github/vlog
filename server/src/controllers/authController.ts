import { z } from "zod";
import { PublicContext } from "../context";
import { validateBody } from "../middlewares/validator";
import database from "../utils/database";
import { ErrorResponse } from "../ErrorHandling";
import onlyUniqueEmail from "../middlewares/onlyUniqueEmail";
import { hashPassword, matchPassword, signToken } from "../utils/encryption";

// sign in
export const signIn = PublicContext.use(
  validateBody(
    z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })
  )
).resolve(async (context) => {
  const { email, password } = context.body;
  // get the user
  const user = await database.user.findUnique({ where: { email } });
  if (!user) throw ErrorResponse.customBadInput("email", "Email not found!");
  // mactch the password
  const passwordMatch = matchPassword(password, user.password);
  if (!passwordMatch)
    throw ErrorResponse.customBadInput("password", "Password not matched");
  // create a token
  const token = signToken(user.email);
  return { token, user };
});
// sign up
const signUp = PublicContext.use(
  validateBody(
    z.object({
      email: z.string().email(),
      name: z.string().min(3),
      password: z.string().min(6).transform(hashPassword),
    })
  )
)
  .use(onlyUniqueEmail)
  .resolve(async (context) => {
    const user = await database.user.create({
      data: {
        ...context.body,
      },
    });
  });
// get auth
// deactivate
