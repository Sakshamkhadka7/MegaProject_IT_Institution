import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import Student from "../models/student.js";
import Order from "../models/order.js";
import ApiResponse from "../utils/apiSuccess.js";

export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const course = req.body;
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

  return res.status.json(new ApiResponse(200, "Order created successfully"));
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find();
  if (orders.length == 0) {
    throw new ApiError(401, "No orders found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "All orders fetched successfully"));
});

export const getOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  if (!orderId) {
    throw new ApiError(401, "Id could not found");
  }

  const order = await Order.findById(orderId);
  if (!order) {
    throw new ApiError(401, "No orders found");
  }

  return res.status(200).json(new ApiResponse(200, "Order has been fetched"));
});
