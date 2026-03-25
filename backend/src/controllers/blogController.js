import Blog from "../models/blog.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createBlog = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;
  const author = req.user._id;
  const image = req.file?.filename;
  if (!title || !content || !category) {
    throw new ApiError(400, "All fields are mandatory");
  }
  const blogExists = await Blog.findOne({ title: title, content: content });
  if (blogExists) {
    throw new ApiError(401, "Blog already exists");
  }

  const blog = await Blog.create({
    title,
    content,
    image: image || null,
    author: author,
    category,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Blog created successfully", blog));
});

export const getBlog = asyncHandler(async (req, res) => {
  const blog = await Blog.find();
  if (blog.length===0) {
    throw new ApiError(404, "No blog found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Blog fetched successfully", blog));
});

export const updateBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }
  const { title, content, category } = req.body;
  const image = req.file?.filename;

   const updateData={};
   if(title) updateData.title=title;
   if(content) updateData.content=content;
   if(category) updateData.category=category;
   if(image) updateData.image=image;

   const blogUpdate=await Blog.findByIdAndUpdate(blogId,updateData,{
    new:true
   });


  return res
    .status(200)
    .json(new ApiResponse(200, "Blog updated successfully", blogUpdate));
});

export const deleteBlog = asyncHandler(async (req, res) => {
  const { blogId } = req.params;
  const blog = await Blog.findById(blogId);
  if (!blog) {
    throw new ApiError(404, "Blog not found");
  }

  const deleteBlog = await Blog.findByIdAndDelete(blogId);

  return res
    .status(200)
    .json(new ApiResponse(200, "Blog deleted successfully",deleteBlog));
});
