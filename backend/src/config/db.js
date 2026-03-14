import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongoose connected successfully");
  } catch (error) {
    console.log("Error occured in a mongoose connection", error);
  }
};

export default connectDb;
