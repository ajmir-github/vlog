import express from "express";
import { env, PublicDirectory } from "./constants";
import cors from "cors";
import { handleErrors } from "./ErrorHandling";
import appRouter from "./routes";

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "*",
  })
);
app.use(express.static(PublicDirectory));
app.use(appRouter);
app.use(handleErrors);

app.listen(env.PORT, () =>
  console.log(`Server is listening on port: ${env.PORT}`)
);
