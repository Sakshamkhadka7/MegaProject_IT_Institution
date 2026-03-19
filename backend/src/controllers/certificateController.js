import Certificate from "../models/certificate.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createCertificate = asyncHandler(async (req, res) => {
  const { studentId, courseId, title, descriptions, founderSign } = req.body;

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

export const getMyCertificate=asyncHandler(async(req,res)=>{

  const studentId=req.user._id;
  if(!studentId){
    throw new ApiError(401,"Id couldnot found");
  }
  const certifcate=await Certificate.findById({_id:studentId}).populate("courses","title");
  if(!certifcate){
    throw new ApiError(401,"Couldnot found certificate");
  }
  return res.status(200).json(new ApiResponse(200,"Certificate fetched successfully",certifcate));

})


