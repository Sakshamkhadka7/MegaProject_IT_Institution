import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrder,
} from "../controllers/orderController.js";
import userMiddleware from "../middleware/authMiddleware.js";

const orderRoute = express.Router();

orderRoute.post("/createOrder", userMiddleware,createOrder);
orderRoute.get("/getAllOrders",userMiddleware, getAllOrders);
orderRoute.get("/getOrderById/:id",userMiddleware ,getOrder);

export default orderRoute;
