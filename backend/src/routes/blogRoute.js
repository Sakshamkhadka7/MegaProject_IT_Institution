import express from "express";
import userMiddleware from "../middleware/authMiddleware.js";
import { createBlog, deleteBlog, getBlog, updateBlog } from "../controllers/blogController.js";

const blogRouter=express.Router();

blogRouter.post("/createBlog",userMiddleware,createBlog);
blogRouter.put("/updateBlog/:blogId",updateBlog);
blogRouter.delete("/deleteBlog/:blogId",deleteBlog);
blogRouter.get("/getBlog",getBlog);

export default blogRouter;