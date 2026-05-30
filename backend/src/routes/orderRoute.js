import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrder,
  getMyPendingOrder,
  regenerateTransactionUuid,
  updateOrder,
} from "../controllers/orderController.js";
import userMiddleware from "../middleware/authMiddleware.js";

const orderRoute = express.Router();

orderRoute.post("/createOrder", userMiddleware,createOrder);

// orderRoute.post("/payment-session",userMiddleware);


orderRoute.put("/updateOrder/:transactionUuid",userMiddleware,updateOrder);
orderRoute.get("/getAllOrders",userMiddleware, getAllOrders);
orderRoute.get("/getMyOrder",userMiddleware ,getMyOrder);
orderRoute.get("/myPendingOrder",userMiddleware,getMyPendingOrder)
orderRoute.put("/regenerateTransaction/:orderId",userMiddleware,regenerateTransactionUuid)

export default orderRoute;
