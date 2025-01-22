import { Handler, NextFunction, Request, Response } from "express";

type PromiseLike<T> = T | Promise<T>;

export default function createContext<Context extends {}>(
  contextFactory: (request: Request) => PromiseLike<Context>
) {
  // keep chain with use
  function use<NewContext extends {}>(
    middleware: (context: Context, request: Request) => PromiseLike<NewContext>
  ) {
    const handle = async (request: Request) => {
      const context = await contextFactory(request);
      const newContext = await middleware(context, request);
      return { ...context, ...newContext };
    };
    return createContext(handle);
  }
  // stop chaining
  function resolve<Data>(
    resolve: (context: Context, request: Request) => PromiseLike<Data>
  ): Handler {
    return async function (request, response, next) {
      try {
        const context = await contextFactory(request);
        const data = await resolve(context, request);
        response.json(data);
      } catch (error: any) {
        next(error);
      }
    };
  }

  return {
    use,
    resolve,
  };
}

export type inferContext<T> = T extends {
  resolve: (handler: (context: infer Context, request: any) => any) => any;
}
  ? Context
  : never;
