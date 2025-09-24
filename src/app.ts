import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./app/routes";
import notFound from "./app/middleware/notFound";

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:4000"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", router);

// app.use(globalErrorHandler);

app.use(notFound);

export default app;
