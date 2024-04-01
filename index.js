import express from "express";
import indexRoutes from "./Core/AccessRoutes/index.js";
import { connectDB } from "./Core/Database/databaseConfig/database.configuration.js";
import morgan from "morgan";
const app = express();
const PORT = 4200;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));
//  Middleware to check server status
const serverStatusMiddleware = (req, res, next) => {
  if (req.path === "/") {
    return res.status(200).json({
      status: "active",
      message: "Server is active and working perfectly",
    });
  } else {
    next();
  }
};

app.use(serverStatusMiddleware);

app.use("/", indexRoutes);

connectDB().then(() => {
  app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
