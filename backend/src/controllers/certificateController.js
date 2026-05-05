import Certificate from "../models/certificate.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createCertificate = asyncHandler(async (req, res) => {
  const { title, descriptions, founderSign } = req.body;
  const {studentId}=req.params;
  const {courseId}=req.params;
  

  if (!studentId || !courseId || !title || !descriptions || !founderSign) {
    throw new ApiError(401, "All fields are mandatory");
  }

  const certificate = await Certificate.create({
    student: studentId,
    courses: courseId,
    title: title,
    descriptions: descriptions,
    founderSign: founderSign,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Certificate created successfully", certificate),
    );
});

export const getMyCertificate = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const certificates = await Certificate.find({ student: studentId })
    .populate("courses", "title");

  if (!certificates.length) {
    throw new ApiError(404, "No certificates found");
  }

  return res.status(200).json(
    new ApiResponse(200, "Certificates fetched successfully", certificates)
  );
});

export const getAllCertificate = asyncHandler(async (req, res) => {
  const certifcate = await Certificate.find()
    .populate("student", "name email")
    .populate("course", "title");

  if (certifcate.length === 0) {
    throw new ApiError(401, "No certificate found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "All certificate fetched ", certifcate));
});
