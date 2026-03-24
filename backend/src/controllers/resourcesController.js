import Resources from "../models/resources.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createResources = asyncHandler(async (req, res) => {
  const instructorId = req.user._id;
  const fileUrl = req.file.filename;
  const { title, link, coursesId } = req.body;
  if (!title || !coursesId) {
    throw new ApiError(401, "All fields are mandatory");
  }

  const resources = await Resources.create({
    courses: coursesId,
    title,
    fileUrl,
    link,
    uploadedBy: instructorId,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Resources created successfully", resources));
});

export const getResourcesByCourse = asyncHandler(async (req, res) => {
  const courseId = req.params;
  if (!courseId) {
    throw new ApiError(401, "Id couldnot found");
  }

  const resources = await Resources.findById({ courses: courseId });
  if (resources.length === 0) {
    throw new ApiError(401, "No resources found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Resources fetched", resources));
});

export const deleteResources = asyncHandler(async (req, res) => {
  const resourcesId = req.params.id;
  const user = req.user.role;
  const instructorId = req.user._id;
  const resources = await Resources.findById({ _id: resourcesId });
  if (!resources) {
    throw new ApiError(401, "Resources not found");
  }

  if (user !== "Instructor" || !resources.uploadedBy.equals(instructorId)) {
    throw new ApiError(401, "Unauthorzied to delete");
  }
  await resources.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, "Resources deleted sucessfully"));
});
