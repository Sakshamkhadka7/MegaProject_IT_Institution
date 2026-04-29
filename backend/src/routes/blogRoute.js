import express from "express";
import userMiddleware from "../middleware/authMiddleware.js";
import { createBlog, deleteBlog, getBlog, updateBlog } from "../controllers/blogController.js";
import upload from "../middleware/upload.js";

const blogRouter=express.Router();

blogRouter.post("/createBlog",userMiddleware,upload.single("image"),createBlog);
blogRouter.put("/updateBlog/:blogId",upload.single("image"),updateBlog);
blogRouter.delete("/deleteBlog/:blogId",deleteBlog);
blogRouter.get("/getBlog",getBlog);

export default blogRouter;  