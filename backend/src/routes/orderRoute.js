import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrder,
  updateOrder,
} from "../controllers/orderController.js";
import userMiddleware from "../middleware/authMiddleware.js";

const orderRoute = express.Router();

orderRoute.post("/createOrder", userMiddleware,createOrder);
orderRoute.put("/updateOrder/:statusId",userMiddleware,updateOrder);
orderRoute.get("/getAllOrders",userMiddleware, getAllOrders);
orderRoute.get("/getMyOrder",userMiddleware ,getMyOrder);

export default orderRoute;
