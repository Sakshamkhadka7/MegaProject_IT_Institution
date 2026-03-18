import Certificate from "../models/certificate.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createCertificate=asyncHandler(async(req,res)=>{

    const {studentId,courseId,title,descriptions,founderSign}=req.body;

    if(!studentId || !courseId ||!title ||!descriptions ||!founderSign ){
        throw new ApiError(401,"All fields are mandatory");
    }

    const certificate=await Certificate.create({
        student:studentId,
        courses:courseId,
        title:title,
        descriptions:descriptions,
        founderSign:founderSign
    })

return res.status(200).json(new ApiResponse(200,"Certificate created successfully",certificate));

})