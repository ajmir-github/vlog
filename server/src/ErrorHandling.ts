import { NextFunction, Request, Response } from "express";
import {
  simplifyValidationError,
  ValidationErrors,
} from "./utils/simplifyZodError";
import { env } from "process";
import { ZodError } from "zod";

export const ERROR_CODES = {
  BAD_REQUEST: 400, // 400
  INTERNAL_SERVER_ERROR: 500,
  UNAUTHORIZED: 401, // 401
  FORBIDDEN: 403, // 403
  NOT_FOUND: 404, // 404
  METHOD_NOT_SUPPORTED: 405, // 405
  TIMEOUT: 408, // 408
  CONFLICT: 409, // 409
  PRECONDITION_FAILED: 412, // 412
  PAYLOAD_TOO_LARGE: 413, // 413
  UNPROCESSABLE_CONTENT: 422, // 422
  TOO_MANY_REQUESTS: 429, // 429
  CLIENT_CLOSED_REQUEST: 499, // 499
} as const;

type ERROR_CODES = typeof ERROR_CODES;
type ERROR_CODES_BY_NAME = keyof ERROR_CODES;
type ERROR_CODES_BY_STATUS = ERROR_CODES[keyof ERROR_CODES];

export class ErrorResponse extends Error {
  status: ERROR_CODES_BY_STATUS;
  code: ERROR_CODES_BY_NAME;
  details?: ValidationErrors;
  constructor(
    errorCode: ERROR_CODES_BY_NAME,
    message?: string,
    details?: ValidationErrors
  ) {
    super(message);
    this.code = errorCode;
    this.status = ERROR_CODES[errorCode];
    this.details = details;
  }
  get() {
    return {
      status: this.status,
      data: {
        code: this.code,
        details: this.details,
        message: this.message,
      },
    };
  }
}

export const handleErrors = (
  error: any,
  requset: Request,
  response: Response,
  next: NextFunction
) => {
  if (error instanceof ErrorResponse) {
    const { data, status } = error.get();
    response.status(status).json(data);
    return;
  }
  if (error instanceof ZodError) {
    const { data, status } = new ErrorResponse(
      "BAD_REQUEST",
      "Invalid entries provided!",
      simplifyValidationError(error)
    ).get();
    response.status(status).json(data);
    return;
  }
  if (env.ENV_MODE === "development") console.log(error);
  if (error instanceof Error) {
    const { data, status } = new ErrorResponse(
      "INTERNAL_SERVER_ERROR",
      (env.ENV_MODE === "development" && error.message) || "Unexpected Error!"
    ).get();
    response.status(status).json(data);
    return;
  }
  throw error;
};
