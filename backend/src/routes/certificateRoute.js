import express from "express";
import { createCertificate, getAllCertificate, getMyCertificate } from "../controllers/certificateController.js";

const certifcateRoute=express.Router();

certifcateRoute.post("/createCertificate",createCertificate);
certifcateRoute.get("/getCertificate",getMyCertificate);
certifcateRoute.get("/getAllCertificate",getAllCertificate);

export default certifcateRoute;