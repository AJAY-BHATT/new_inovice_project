import express from "express";
import jwt from "jsonwebtoken";
import Product from "../models/Product.js";
import PDFDocument from "pdfkit";

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

router.get("/download", auth, async (req, res) => {
  const products = await Product.find({ userId: req.user.id });
  const doc = new PDFDocument();
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");
  doc.pipe(res);
  doc.fontSize(20).text("Invoice", { align: "center" });
  doc.moveDown();
  products.forEach(p => {
    doc.fontSize(14).text(`${p.name} - ${p.qty} x ${p.price} = ${p.qty * p.price}`);
  });
  doc.end();
});

export default router;
