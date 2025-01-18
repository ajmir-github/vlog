import express from "express";
import { env, PublicDirectory } from "./constants";
import cors from "cors";
import { handleErrors, handleNotFoundError } from "./ErrorHandling";
import appRouter from "./routes";

const app = express();
app.use(
  cors({
    origin: "*",
    methods: "*",
  })
);
app.use(express.json());
app.use(express.static(PublicDirectory));
app.use(appRouter);

app.use(handleNotFoundError);
app.use(handleErrors);

app.listen(env.PORT, () =>
  console.log(`Server is listening on port: ${env.PORT}`)
);
