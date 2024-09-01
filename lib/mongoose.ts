import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  const start = Date.now();
  mongoose.set("strictQuery", false);

  if (!process.env.MONGODB_URI) {
    throw new Error("Invalid/Missing environment variable: 'MONGODB_URI'");
  }

  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);

    //register all models
    if (!mongoose.models.Product) mongoose.model("Product", new mongoose.Schema({}));
    if (!mongoose.models.Category) mongoose.model("Category", new mongoose.Schema({}));
    if (!mongoose.models.Attribute) mongoose.model("Attribute", new mongoose.Schema({}));

    isConnected = true;
    console.log("MongoDB connected!");
  } catch (error: any) {
    console.log("Error connecting to MongoDB");
    console.log(error);
  }
  const duration = Date.now() - start;
  console.log("Database -", "Connection time:", duration, "ms");
};
