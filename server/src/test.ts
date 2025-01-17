import { Handler, Request } from "express";

type PromiseLike<T> = T | Promise<T>;

export default function createContextAPI<Context extends object>(
  contextFactory: (request: Request) => PromiseLike<Context>
) {
  // keep chain with use
  function use<NewContext extends object>(
    middleware: (context: Context, request: Request) => PromiseLike<NewContext>
  ) {
    const handle = async (request: Request) => {
      const context = await contextFactory(request);
      const newContext = await middleware(context, request);
      return newContext;
    };
    return createContextAPI(handle);
  }
  // stop chaining
  function resolve<Data>(
    resolve: (context: Context, request: Request) => PromiseLike<Data>
  ): Handler {
    return async (request, response, next) => {
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
