import mongoose from "mongoose";

const courseSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  descriptions: {
    type: String,
    required: true,
  },
  syllabus: [
    {
      type: String,
      required: true,
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
  },

  level: {
    type: String,
    enum: ["Beginner", "Intermediate", "Advanced"],
    default: "Beginner",
  },
  enrollmentDeadline: {
    type: String,
    required: true,
  },
  prerequisities: {
    type: String,
    default: "Everyone can learn all courses",
  },
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
