import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import Student from "../models/student.js";
import Order from "../models/order.js";
import ApiResponse from "../utils/apiSuccess.js";

export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { course } = req.body;

  
  if (!userId || !course || course.length === 0) {
    throw new ApiError(400, "Course data is required");
  }


  const user = await Student.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }


  const courseIds = course.map((c) => c.coursesId);

  
  const existingOrder = await Order.findOne({
    user: userId,
    paymentStatus: "PENDING",
    "course.coursesId": { $in: courseIds },
  });

  if (existingOrder) {
    return res.status(400).json(
      new ApiResponse(
        400,
        "Pending order already exists for this course",
        existingOrder
      )
    );
  }


  const order = await Order.create({
    user: userId,
    course,
  });

  return res.status(201).json(
    new ApiResponse(
      201,
      "Order created successfully",
      order
    )
  );
});

export const updateOrder = asyncHandler(async (req, res) => {
  const { statusId } = req.params;
  const { paymentStatus } = req.body;
  const order = await Order.findById(statusId);
  if (!order) {
    throw new ApiError(401, "Order Id not found");
  }

  const update = await Order.findByIdAndUpdate(
    { _id: statusId },
    { paymentStatus: paymentStatus },
    { new: true },
  );

  return res
    .status(200)
    .json(new ApiResponse(200, "Order status updated successfully", update));
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const role = req.user.role;
  if (role !== "Instructor" && role !== "Admin") {
    throw new ApiError(401, "Not authorized to take orders");
  }

  const orders = await Order.find();
  if (orders.length == 0) {
    throw new ApiError(401, "No orders found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "All orders fetched successfully", orders));
});

export const getMyOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId }).populate(
    "course.coursesId",
  );

  if (!orders || orders.length === 0) {
    throw new ApiError(404, "No orders found for this user");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "My orders fetched successfully", orders));
});
