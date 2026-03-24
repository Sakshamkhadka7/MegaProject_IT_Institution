import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrder,
} from "../controllers/orderController.js";

const orderRoute = express.Router();

orderRoute.post("/createOrder", createOrder);
orderRoute.get("/getAllOrders", getAllOrders);
orderRoute.get("/getOrderById/:id", getOrder);

export default orderRoute;
