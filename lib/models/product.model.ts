import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
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
  parentCategory: {
    type: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    required: true,
  },
  subCategory: {
    type: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    required: true,
  },
  image: {
    type: [String],
    required: true,
  },
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
    required: true,
  },
  isNewArrival: {
    type: Boolean,
  },
  isBestSeller: {
    type: Boolean,
  },
  keyHeighlights: {
    type: { type: mongoose.Schema.Types.ObjectId, ref: "Heighlight" },
    required: true,
  },
});
