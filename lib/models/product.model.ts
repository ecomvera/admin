import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  mrp: {
    type: Number,
    required: true,
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  images: { type: [{ key: String, url: String, publicId: String }], required: true },
  material: {
    type: String,
    required: true,
  },
  sizes: {
    type: [String],
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  inStock: {
    type: Boolean,
  },
  isNewArrival: {
    type: Boolean,
  },
  isBestSeller: {
    type: Boolean,
  },
  attributes: { type: [{ key: String, value: String }], required: true },
});

const Product = mongoose.models?.Product || mongoose.model("Product", productSchema);
export default Product;
