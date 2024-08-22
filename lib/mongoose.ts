import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URI) {
    throw new Error("Invalid/Missing environment variable: 'MONGODB_URI'");
  }

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true;
    console.log("MongoDB connected!");
  } catch (error: any) {
    console.log("Error connecting to MongoDB");
    console.log(error);
  }
};
