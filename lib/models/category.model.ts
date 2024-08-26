import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  wearType: { type: String },
  parentId: { type: String },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const Category = mongoose.models?.Category || mongoose.model("Category", categorySchema);
export default Category;
