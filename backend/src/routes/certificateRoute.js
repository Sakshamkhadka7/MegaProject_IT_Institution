import express from "express";
import { createCertificate, getAllCertificate, getMyCertificate } from "../controllers/certificateController.js";
import userMiddleware from "../middleware/authMiddleware.js";

const certifcateRoute=express.Router();

certifcateRoute.post("/createCertificate/:studentId/:courseId",createCertificate);
certifcateRoute.get("/getCertificate",userMiddleware,getMyCertificate);
certifcateRoute.get("/getAllCertificate",getAllCertificate);

export default certifcateRoute;