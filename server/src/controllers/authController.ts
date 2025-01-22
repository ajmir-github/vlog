import { PublicContext } from "../context";
import database from "../utils/database";
import { ErrorResponse } from "../ErrorHandling";
import onlyUniqueEmail from "../middlewares/onlyUniqueEmail";
import { matchPassword, signToken } from "../utils/encryption";
import { signInValidator, signUpValidator } from "../validators/authValidator";

// sign in

export const signIn = PublicContext.use(signInValidator).resolve(
  async (context) => {
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
  }
);

// sign up
export const signUp = PublicContext.use(signUpValidator)
  .use(onlyUniqueEmail)
  .resolve(async (context) => {
    // create user
    const user = await database.user.create({
      data: context.body,
    });
    // create a token
    const token = signToken(user.id);
    return { token, user };
  });
