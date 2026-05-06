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
import reviewRouter from "./src/routes/reviewRoute.js";
import resourcesRouter from "./src/routes/resourcesRoute.js";
import cors from "cors";
import DemoRouter from "./src/routes/demoRoute.js";
import contactRouter from "./src/routes/contactRoute.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT;
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "https://it-institution-frontend.vercel.app",
       "https://it-admin-sepia.vercel.app",
       "https://it-instructor.vercel.app",
       "https://it-student-phi.vercel.app"
    ],
    credentials: true,
  }),
);

app.use(cookieParser());

app.use("/image", express.static("public/images"));

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
app.use("/api/v1/course", courseRoute);
app.use("/api/v1/assignment", assigmentRouter);
app.use("/api/v1/demo", DemoRouter);
app.use("/api/v1/certificate", certifcateRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/progress", progressRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/blog", blogRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/resources", resourcesRouter);
app.use("/api/v1/contact", contactRouter);
