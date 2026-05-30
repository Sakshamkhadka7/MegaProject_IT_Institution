import express from "express";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/apiError.js";
import Student from "../models/student.js";
import Order from "../models/order.js";
import ApiResponse from "../utils/apiSuccess.js";
import { v4 as uuidv4 } from "uuid";

export const createOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { course } = req.body;
  const transactionUuid = uuidv4();

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
    return res
      .status(200)
      .json(
        new ApiResponse(
          400,
          "Pending order already exists for this course",
          existingOrder,
        ),
      );
  }

  const order = await Order.create({
    user: userId,
    course,
    transactionUuid,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, "Order created successfully", order));
});

export const getMyPendingOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const pendingOrder = await Order.findOne({
    user: userId,
    paymentStatus: "PENDING",
  }).populate("course.coursesId");

  if (!pendingOrder) {
    return res
      .status(200)
      .json(new ApiResponse(200, "No pending order found", null));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Pending order found", pendingOrder));
});

export const updateOrder = asyncHandler(async (req, res) => {
  const { transactionUuid } = req.params;

  const { paymentStatus } = req.body;

  const order = await Order.findOne({
    transactionUuid,
  });

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // already complete
  if (order.paymentStatus === "COMPLETE") {
    const completedOrder = await Order.findById(order._id).populate(
      "course.coursesId"
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Order already completed",
          completedOrder
        )
      );
  }

  order.paymentStatus = paymentStatus;

  await order.save();

  const updatedOrder = await Order.findById(order._id).populate(
    "course.coursesId"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Order updated successfully",
        updatedOrder
      )
    );
});

export const regenerateTransactionUuid = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // only pending orders can regenerate uuid
  if (order.paymentStatus !== "PENDING") {
    throw new ApiError(
      400,
      "Only pending orders can regenerate transaction UUID",
    );
  }

  order.transactionUuid = uuidv4();

  await order.save();

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Transaction UUID regenerated successfully", order),
    );
});

export const getAllOrders = asyncHandler(async (req, res) => {
  const role = req.user.role;

  if (role !== "Instructor" && role !== "Admin") {
    throw new ApiError(401, "Not authorized to take orders");
  }

  const orders = await Order.find()
    .populate({
      path: "user",
      select: "fullName email",
    })
    .populate({
      path: "course.coursesId",
      select: "title fee thumbnail",
    });

  if (!orders || orders.length === 0) {
    throw new ApiError(404, "No orders found");
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
