import express from "express";
import dotenv from "dotenv";
import connectDb from "./src/config/db.js";
import studentRoute from "./src/routes/studentRoute.js";
import cookieParser from "cookie-parser";
import courseRoute from "./src/routes/courseRoute.js";
import assigmentRouter from "./src/routes/assigmentRoute.js";
import certifcateRoute from "./src/routes/certificateRoute.js";
import orderRoute from "./src/routes/orderRoute.js";
import progressRouter from "./src/routes/progressRoute.js";
import jobRouter from "./src/routes/jobRoute.js";
import blogRouter from "./src/routes/blogRoute.js";


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
app.use("/api/v1/course",courseRoute);
app.use("/api/v1/assigment",assigmentRouter);
app.use("/api/v1/certificate",certifcateRoute);
app.use("/api/v1/order",orderRoute);
app.use("/api/v1/progress",progressRouter);
app.use("/api/v1/job",jobRouter)
app.use("/api/v1/blog",blogRouter)

