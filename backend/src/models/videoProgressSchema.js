import mongoose from "mongoose";

const videoProgressSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },

    lecture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lecture",
    },

    watchedSeconds: {
      type: Number,
      default: 0,
    },

    isCompleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const VideoProgress = mongoose.model(
  "VideoProgress",
  videoProgressSchema
);

export default VideoProgress;