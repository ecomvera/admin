import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: true,
  },
});

const Attribute = mongoose.models?.Attribute || mongoose.model("Attribute", attributeSchema);
export default Attribute;
