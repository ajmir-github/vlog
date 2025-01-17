import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { env } from "../constants";

export const signToken = (payload: string) => {
  try {
    return jwt.sign(payload, env.SECRET_KEY);
  } catch (error: any) {
    return error as Error;
  }
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, env.SECRET_KEY) as string;
  } catch (error: any) {
    return error as jwt.VerifyErrors;
  }
};

export const hashPassword = (password: string) =>
  bcryptjs.hashSync(password, 10);
export const matchPassword = (password: string, hash: string) =>
  bcryptjs.compareSync(password, hash);
