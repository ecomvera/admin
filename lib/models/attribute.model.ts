import mongoose from "mongoose";

const attributeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
});

const Attribute = mongoose.models?.Attribute || mongoose.model("Attribute", attributeSchema);
export default Attribute;
