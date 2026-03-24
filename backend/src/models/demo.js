import mongoose from "mongoose";

const demoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    courses: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Courses",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Demo = mongoose.model("Demo", demoSchema);
export default Demo;
