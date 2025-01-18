import { Handler, NextFunction, Request, Response } from "express";
import {
  customValidationError,
  simplifyValidationError,
} from "./utils/simplifyZodError";
import { env } from "process";
import { ZodError } from "zod";

export const ErrorResponse = {
  badInput(error: ZodError) {
    return new ServerResposne(400, simplifyValidationError(error));
  },
  customBadInput(path: string, message: string) {
    return new ServerResposne(400, customValidationError(path, message));
  },
  notFound(message: string = "Resource not found!") {
    return new ServerResposne(404, message);
  },
  unautheticated(
    message: string = "Access denied due to lack of authetication!"
  ) {
    return new ServerResposne(401, message);
  },
  unauthorized(
    message: string = "Access denied due to lack of authorization!"
  ) {
    return new ServerResposne(401, message);
  },
} as const;
export class ServerResposne<Data> {
  status: number;
  data: Data;
  constructor(status: number, data: Data) {
    this.status = status;
    this.data = data;
  }
}

export const handleNotFoundError: Handler = (request, response, next) => {
  next(ErrorResponse.notFound("URL not found!"));
};

export const handleErrors = (
  error: any,
  requset: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof ServerResposne) {
    response.status(error.status).json(error.data);
    return;
  }

  if (env.ENV_MODE === "development") console.log(error);
  if (error instanceof Error) {
    response.status(500).json({ message: "Server failed!" });
    return;
  }
  throw error;
};
