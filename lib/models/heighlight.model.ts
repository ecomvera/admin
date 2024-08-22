import mongoose from "mongoose";

const heighlightSchema = new mongoose.Schema({
  product: {
    type: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    required: true,
  },
  design: {
    type: String,
  },
  fit: {
    type: String,
  },
  neck: {
    type: String,
  },
  sleeve: {
    type: String,
  },
  washCare: {
    type: String,
  },
});

const Heighlight = mongoose.models?.heighlight || mongoose.model("Heighlight", heighlightSchema);
export default Heighlight;
