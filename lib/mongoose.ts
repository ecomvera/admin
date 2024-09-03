import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  const start = Date.now();
  mongoose.set("strictQuery", true);
  mongoose.set("debug", false);

  if (!process.env.MONGODB_URI) {
    console.log("\x1b[31m", "Missing environment variable: 'MONGODB_URI'", "\n\x1b[0m");
    process.exit(0);
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
    console.log("\x1b[31m", "Error connecting to MongoDB", "\n\x1b[0m");
    console.log(error);
  }
  const duration = Date.now() - start;
  console.log("Database -", "Connection time:", duration, "ms");
};
