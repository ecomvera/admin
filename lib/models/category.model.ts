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
  parentId: {
    type: String,
  },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
});

const Category = mongoose.models?.category || mongoose.model("Category", categorySchema);
export default Category;
