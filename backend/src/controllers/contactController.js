import Contact from "../models/contact.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const createContact = asyncHandler(async (req, res) => {
  const { name, email, purpose, message } = req.body;

  if (!name || !email || !purpose || !message) {
    throw new ApiError(401, "All fields are required");
  }

  const contact = await Contact.create({
    name,
    email,
    purpose,
    message,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Contact created successfully"));
});

export const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.find();

  if (!contact || contact.length === 0) {
    return res
      .status(200)
      .json(new ApiResponse(200, [], "No contact form available"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Contact forms fetched successfully",contact));
});