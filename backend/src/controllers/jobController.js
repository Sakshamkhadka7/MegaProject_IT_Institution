import Job from "../models/job.js";
import Application from "../models/jobApplication.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createJob = asyncHandler(async (req, res) => {
  const adminId = req.user?._id;
  if (req.user.role !== "Admin") {
    throw new ApiError(403, "Not authorized to upload a job");
  }
  const { title, company, location, position, description } = req.body;
  if (!title || !company || !location || !position || !description) {
    throw new ApiError(400, "All fields are mandatory");
  }

  const jobExists = await Job.find({
    title: title,
    company: company,
    position: position,
  });

  if (jobExists) {
    throw new ApiError(400, "Job already exists");
  }

  const job = await Job.create({
    title,
    company,
    location,
    position,
    description,
    postedBy: adminId,
  });

  return res.status(200).json(new ApiResponse(200, "Job created successfully"));
});

export const getAllJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find();
  if (jobs.length === 0) {
    throw new ApiError(404, "No job founds");
  }

  res.status(200).json(new ApiResponse(200, "All jobs fetched successfully"));
});

export const deleteJobs = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  if (req.user.role !== "Admin") {
    throw new ApiError(403, "Not authorized to upload a job");
  }
  const job = await Job.findByIdAndDelete(jobId);
  if (!job) {
    throw new ApiError(404, "Job not found");
  }

  return res.status(200).json(new ApiResponse(200, "Job deleted successfully"));
});

export const updateJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  if (req.user.role !== "Admin") {
    throw new ApiError(403, "Not authorized to upload a job");
  }
  const { title, company, location, position, description } = req.body;
  const job = await Job.findById(jobId);
  if (!job) {
    throw new ApiError(401, "Job couldnot found");
  }

  const updateJob = await Job.findByIdAndUpdate(
    IdleDeadline,
    {
      title,
      company,
      location,
      position,
      description,
    },
    {
      new: true,
    },
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Job updated successfully", updateJob));
});

export const jobApply = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const userId = req.user._id;
  const {coverLetter} = req.body;
  const alreadyApplied = await Application.findOne({
    applicant: userId,
    job: jobId, 
  });
  if (alreadyApplied) {
    throw new ApiError(403, "Already applied to this job by this user");
  }

  const resume = req.file.filename;

  if (!resume) {
    throw new ApiError(403, "Resume is mandatory to apply this job");
  }

  const application = await Application.create({
    applicant: userId,
    job: jobId,
    coverLetter: coverLetter,
    resume: resume,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Job applied successfull"), application);
});

export const getMyApplication=asyncHandler(async(req,res)=>{

  const userId=req.user._id;
  const application=await Application.findOne({applicant:userId});
  if(!application){
    throw new ApiError(404,"No application founds");
  }

  return res.status(200).json(new ApiResponse(200,"Application fetched successfully"));

})
