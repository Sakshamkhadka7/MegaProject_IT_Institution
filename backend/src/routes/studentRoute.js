import express from "express";
import upload from "../middleware/upload.js";
import { registerStudent } from "../controllers/studentController.js";

const studentRoute = express.Router();

studentRoute.post("/register", upload.single("avatar"), registerStudent);

export default studentRoute;
