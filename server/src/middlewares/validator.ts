import { ZodSchema } from "zod";
import { ErrorResponse } from "../ErrorHandling";
import { simplifyValidationError } from "../utils/simplifyZodError";
import { Request } from "express";

export function validateBody<Body>(validator: ZodSchema<Body>) {
  return function (context: any, request: Request) {
    const validation = validator.safeParse(request.body);
    if (!validation.success) throw ErrorResponse.badInput(validation.error);
    return {
      body: validation.data,
    };
  };
}
export function validateParams<Params>(validator: ZodSchema<Params>) {
  return function (context: any, request: Request) {
    const validation = validator.safeParse(request.params);
    if (!validation.success) throw ErrorResponse.badInput(validation.error);
    return {
      params: validation.data,
    };
  };
}
export function validateQuery<Query>(validator: ZodSchema<Query>) {
  return function (context: any, request: Request) {
    const validation = validator.safeParse(request.query);
    if (!validation.success) throw ErrorResponse.badInput(validation.error);
    return {
      query: validation.data,
    };
  };
}
