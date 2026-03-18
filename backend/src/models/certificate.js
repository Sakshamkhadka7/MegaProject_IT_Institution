import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    courses: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
    title: {
      type: String,
      required: true,
    },
    descriptions: {
      type: String,
      required: true,
    },
    issuedAt: {
      type: Date,
      default: Date.now(),
    },
    founderSign: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;
