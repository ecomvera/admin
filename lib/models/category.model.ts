import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  isOffer: { type: Boolean },
  wearType: { type: String },
  parentId: { type: String },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
  products: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

// add unique constraint
categorySchema.index({ slug: 1, parentId: 1 }, { unique: true });

const Category = mongoose.models?.Category || mongoose.model("Category", categorySchema);
export default Category;
