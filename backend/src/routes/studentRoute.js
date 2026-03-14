import express from "express";
import upload from "../middleware/upload.js";
import { login, logout, registerStudent } from "../controllers/studentController.js";

const studentRoute = express.Router();

studentRoute.post("/register", upload.single("avatar"), registerStudent);
studentRoute.post("/login",login);
studentRoute.get("/logout",logout);


export default studentRoute;
