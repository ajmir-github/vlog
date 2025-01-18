import { z } from "zod";
import { PrivateContext, PublicContext } from "../context";
import { validateBody } from "../middlewares/validator";
import database from "../utils/database";
import { ErrorResponse } from "../ErrorHandling";
import onlyUniqueEmail from "../middlewares/onlyUniqueEmail";
import { hashPassword, matchPassword, signToken } from "../utils/encryption";
import { UserRole } from "@prisma/client";

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
  const token = signToken(user.id);
  return { token, user };
});
// sign up
export const signUp = PublicContext.use(
  validateBody(
    z.object({
      email: z.string().email(),
      name: z.string().min(3),
      bio: z.string(),
      password: z.string().min(6).transform(hashPassword),
    })
  )
)
  .use(onlyUniqueEmail)
  .resolve(async (context) => {
    // create user
    const user = await database.user.create({
      data: {
        ...context.body,
        role: UserRole.user,
      },
    });
    // create a token
    const token = signToken(user.id);
    return { token, user };
  });
// get auth
export const getAuth = PrivateContext.resolve((context) => context.auth);
// deactivate
export const deactivateUser = PrivateContext.resolve(async (context) => {
  await database.user.update({
    where: { id: context.auth.id },
    data: {
      role: UserRole.deactivated,
    },
  });
  return "User deactivated!";
});

export const updateSelfUser = PrivateContext.use(
  validateBody(
    z
      .object({
        email: z.string().email(),
        name: z.string().min(3),
        bio: z.string(),
        password: z.string().min(6).transform(hashPassword),
      })
      .partial()
  )
)
  .use(onlyUniqueEmail)
  .resolve(async (context) => {
    const user = await database.user.update({
      where: { id: context.auth.id },
      data: context.body,
    });
    return { user };
  });
