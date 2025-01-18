import createContext from "./utils/createContext";
import { ErrorResponse } from "./ErrorHandling";

export const PublicContext = createContext((request) => {
  return {
    token: request.headers.authorization,
    file: request.file,
    files: request.files,
  };
});

export const PrivateContext = PublicContext.use(async ({ token }) => {
  if (!token) throw ErrorResponse.unautheticated("Please sign in first!");
  return {
    auth: true,
  };
});
