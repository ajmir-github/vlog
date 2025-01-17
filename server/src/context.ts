import { ErrorResponse } from "./ErrorHandling";
import createContext from "./utils/createContext";

export const PublicContext = createContext((request) => {
  return {
    token: request.headers.authorization,
    file: request.file,
    files: request.files,
  };
});

export const PrivateContext = PublicContext.use(async ({ token }) => {
  if (!token) throw new ErrorResponse("UNAUTHORIZED", "You are not signed in");
  return {
    auth: true,
  };
});
