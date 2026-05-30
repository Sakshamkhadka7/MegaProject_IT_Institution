import express from "express";
import userMiddleware from "../middleware/authMiddleware.js";
import { createBlog, deleteBlog, getBlog, updateBlog } from "../controllers/blogController.js";
import upload from "../middleware/upload.js";
import uploadCloudinary from "../middleware/uploadMiddleware.js";




const blogRouter=express.Router();

blogRouter.post("/createBlog",userMiddleware,uploadCloudinary.single("image"),createBlog);
blogRouter.put("/updateBlog/:blogId",uploadCloudinary.single("image"),updateBlog);
blogRouter.delete("/deleteBlog/:blogId",deleteBlog);
blogRouter.get("/getBlog",getBlog);

export default blogRouter;  