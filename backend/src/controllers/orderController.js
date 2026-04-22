import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import Student from "../models/student.js";
import Order from "../models/order.js";
import ApiResponse from "../utils/apiSuccess.js";

export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { course } = req.body;

  const existingOrder = await Order.findOne({
    user: userId,
    paymentStatus: "PENDING",
  });

  if (existingOrder) {
    return res
      .status(400)
      .json(new ApiResponse(400, "Order already existed", existingOrder));
  }

  if (!userId || !course) {
    throw new ApiError(401, "All fields are mandatory");
  }
  const user = await Student.findById(userId);
  if (!user) {
    throw new ApiError(401, "User no found");
  }

  const order = await Order.create({
    user: userId,
    course,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "Order created successfully", order));
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
  const orders = await Order.find();
  if (orders.length == 0) {
    throw new ApiError(401, "No orders found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "All orders fetched successfully", orders));
});

export const getMyOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("course")

    return res.status(200).json({
      success: true,
      data: orders,
    });

  } catch (error) {
    console.log("GET ORDER ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
