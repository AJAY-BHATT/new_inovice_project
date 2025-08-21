import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";

import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/product.js";
import invoiceRoutes from "./routes/invoice.js";

dotenv.config();
const app = express();

// ✅ Restrict CORS to only your frontend
app.use(
  cors({
    origin: process.env.FRONTEND_URL, // e.g. https://invoice-frontend.onrender.com
    credentials: true,
  })
);

app.use(bodyParser.json());

// Routes
app.use("/auth", authRoutes);
app.use("/products", productRoutes);
app.use("/invoice", invoiceRoutes);

const PORT = process.env.PORT || 8080;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));
