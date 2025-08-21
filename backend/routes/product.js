import express from "express";
import jwt from "jsonwebtoken";
import Product from "../models/Product.js";

const router = express.Router();

const auth = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ error: "Invalid token" });
  }
};

router.post("/", auth, async (req, res) => {
  const { name, price, qty } = req.body;
  const newProduct = new Product({ userId: req.user.id, name, price, qty });
  await newProduct.save();
  res.json(newProduct);
});

router.get("/", auth, async (req, res) => {
  const products = await Product.find({ userId: req.user.id });
  res.json(products);
});

export default router;
