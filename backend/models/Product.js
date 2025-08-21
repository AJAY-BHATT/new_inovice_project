import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  userId: String,
  name: String,
  price: Number,
  qty: Number
});

export default mongoose.model("Product", productSchema);
