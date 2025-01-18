import createContext from "./utils/createContext";
import { ErrorResponse } from "./ErrorHandling";
import { verifyToken } from "./utils/encryption";
import database from "./utils/database";

export const PublicContext = createContext((request) => {
  const token =
    request.headers.authorization &&
    request.headers.authorization.replace("Bearer ", "");
  return {
    token,
    file: request.file,
    files: request.files,
  };
});

export const PrivateContext = PublicContext.use(async ({ token }) => {
  // verify the token
  if (!token) throw ErrorResponse.unautheticated("Please sign in first!");

  const verification = verifyToken(token);
  if (verification instanceof Error)
    throw ErrorResponse.unautheticated(verification.message);

  // get the user
  const user = await database.user.findUnique({ where: { id: verification } });
  if (!user)
    throw ErrorResponse.unautheticated("This user does not exist anymore!");
  return {
    auth: user,
  };
});
