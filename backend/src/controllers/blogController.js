import Blog from "../models/blog.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createBlog=asyncHandler(async(req,res)=>{
    const {title,content,category}=req.body;
    const author=req.user._id;
    const image=req.file.filename;
    if(!title || !content || !category){
        throw new ApiError(401,"All fields are mandatory");
    }
    const blogExists=await Blog.find({title:title,content:content});
    if(blogExists){
        throw new ApiError(401,"Blog already exists");
    }

    const blog=await Blog.create({
        title,
        content,
        image:image,
        author:author,
        category
    })

    return res.status(201).json(new ApiResponse(201,"Blog created successfully",blog));

})