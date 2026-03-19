import mongoose from "mongoose";

const resourcesSchema = new mongoose.Schema(
  {
    courses: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    title: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
    },
    link: {
      type: String,
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
  },
  {
    timestamps: true,
  },
);
