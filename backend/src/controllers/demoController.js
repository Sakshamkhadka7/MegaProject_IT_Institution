import Demo from "../models/demo.js";
import ApiError from "../utils/apiError.js";
import ApiResponse from "../utils/apiSuccess.js";
import asyncHandler from "../utils/asyncHandler.js";

export const bookDemo = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { courses, date, timeSlot } = req.body;

  const alreadyBooked = await Demo.findOne({
    userId,
    courses,
    date,
    timeSlot,
  });
  if (alreadyBooked) {
    return res.status(409).json(new ApiResponse(409, "Already Booked"));
  }

  const slotTaken = await Demo.findOne({
    courses,
    date,
    timeSlot,
  });

  if (slotTaken) {
    return res
      .status(409)
      .json(new ApiResponse(409, "This slot is already taken"));
  }

  const booking = await Demo.create({
    userId,
    courses,
    date,
    timeSlot,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Demo booked successfully", booking));
});

const ALL_SLOTS = ["10:00 AM", "2:00 PM", "4:00 PM"];

export const getAvailableSlot = asyncHandler(async (req, res) => {
  const courseId = req.params.id;
  const date = req.query;
  if (!date) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Date query paramater is required"));
  }

  const bookings = await Demo.find({ courses: courseId, date: date });
  const bookingsSLots = bookings.map((b) => b.timeSlot);
  const availableSLot = ALL_SLOTS.filter(
    (slots) => !bookingsSLots.includes(slots),
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Available slots fetched", availableSLot));
});

export const getAllDemo = asyncHandler(async (req, res) => {
  const adminId = req.user.role;
  if (adminId != "Admin") {
    throw new ApiError(401, "Unauthorized to access");
  }
  const allDemo = await Demo.find();
  if (!allDemo) {
    throw new ApiError(401, "No demo founds");
  }
  return res.status(200).json(200, "All demo fetched", allDemo);
});
