import mongoose from "mongoose";

const blogSchema =new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  category: {
    type: String,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
},{
    timestamps:true
})

const Blog=mongoose.model("Blog",blogSchema);
export default Blog
