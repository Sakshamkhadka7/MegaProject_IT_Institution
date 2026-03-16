import mongoose from "mongoose";

const assignmentSubmission = new mongoose.Schema(
  {
    assignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    courses: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    submittedFile: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
    status: {
      type: String,
      enum: ["Submitted", "Reviewed"],
      default: "Submitted",
    },
    instructorFeedBack: {
      type: String,
    },
    score: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  },
);

const AssignmentSubmission=mongoose.model("AssignmentSubmission",assignmentSubmission);

export default AssignmentSubmission;
