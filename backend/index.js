import express from "express";
import dotenv from "dotenv";
import connectDb from "./src/config/db.js";
import studentRoute from "./src/routes/studentRoute.js";
import cookieParser from "cookie-parser";

const app = express();
dotenv.config();

const PORT = process.env.PORT;
app.use(express.json());
app.use(cookieParser());

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Port is listening at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongo db connection error", err);
  });

app.use("/api/v1/student", studentRoute);
