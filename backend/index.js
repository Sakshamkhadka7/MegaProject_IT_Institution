import express from "express";
import dotenv from "dotenv";
import connectDb from "./src/config/db.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Port is listening at ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Mongo db connection error", err);
  });
