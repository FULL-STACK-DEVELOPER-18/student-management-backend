import express from "express";
import cors from "cors";
import config from "./config/config.js";
import connectDB from "./config/db.config.js";
import morgan from "morgan";
import http from "http";
import errorHandler from "./middleware/errorHandler.js";
import router from "./router.js";

const app = express();
const server = http.createServer(app);

app.disable("x-powered-by");

connectDB();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: "*" }));

app.use("/api/students", router.studentsRoute);

app.use(errorHandler);

server.listen(config.port, () => {
  console.log(`Server is running on port http://localhost:${config.port}`);
});

process.on("uncaughtException", function (err) {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", function (err) {
  console.error("Unhandled Rejection:", err);
});
