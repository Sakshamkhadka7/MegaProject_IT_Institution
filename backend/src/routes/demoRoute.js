import express from "express";
import userMiddleware from "../middleware/authMiddleware.js";
import {
  bookDemo,
  getAllDemo,
  getAvailableSlot,
} from "../controllers/demoController.js";

const DemoRouter = express.Router();

DemoRouter.post("/bookDemo", userMiddleware, bookDemo);
DemoRouter.get("/getAvailableSLot/:id", userMiddleware, getAvailableSlot);
DemoRouter.get("/getAllDemo", userMiddleware, getAllDemo);

export default DemoRouter;
