import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    syllabus: [
      {
        type: String,
        trim: true,
      },
    ],

    duration: {
      type: String,
      required: true,
    },

    fee: {
      type: Number,
      required: true,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },

    enrollmentDeadline: {
      type: Date,
    },

    prerequisites: {
      type: String,
      default: "No prerequisites",
    },

    thumbnail: {
      type: String,
      required: true,
    },

    totalLectures: {
      type: Number,
      default: 0,
    },

    totalVideoDuration: {
      type: Number,
      default: 0,
    },

    isPublished: {
      type: Boolean,
      default: false,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;