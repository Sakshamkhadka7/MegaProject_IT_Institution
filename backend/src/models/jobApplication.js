import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
  job: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
  },
  coverLetter: {
    type: String,
  },
  resume: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Accepted", "Pending", "Rejected"],
  },
  appliedAt: {
    type: Date,
    default: Date.now(),
  },
});

const Application = mongoose.model("Application", applicationSchema);
export default Application;
