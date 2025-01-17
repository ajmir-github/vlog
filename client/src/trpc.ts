import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../backend/src";

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:4001/trpc",
      headers() {
        console.log("Requested headers!");
        return {
          authorization: localStorage.getItem("token") || undefined,
        };
      },
    }),
  ],
});

trpc.getPosts.query();
export default trpc;
