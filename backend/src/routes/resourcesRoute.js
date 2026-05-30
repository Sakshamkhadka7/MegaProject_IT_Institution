import express from "express";
import userMiddleware from "../middleware/authMiddleware.js";
import { createResources, deleteResources, getResourcesByCourse } from "../controllers/resourcesController.js";
import upload from "../middleware/upload.js";
import uploadCloudinary from "../middleware/uploadMiddleware.js";



const resourcesRouter=express.Router();

resourcesRouter.post("/createResource",userMiddleware,uploadCloudinary.single("fileUrl"),createResources);
resourcesRouter.get("/getResources/:courseId",getResourcesByCourse);
resourcesRouter.delete("/deleteResources/:resourcesId",userMiddleware,deleteResources);

export default resourcesRouter;