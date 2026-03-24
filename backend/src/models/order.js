import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    course: [
      {
        coursesId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Courses",
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    paymentMethod: {
      type: String,
      default: "esewa",
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "COMPLETE", "CANCELLED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);
const Order = new mongoose.model("Order", orderSchema);
export default Order;
