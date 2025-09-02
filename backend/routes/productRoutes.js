const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all products
router.get("/", (req, res) => {
  db.query("SELECT * FROM products", (err, data) => {
    if (err) return res.status(500).json("Database Error");
    res.json(data);
  });
});

// Add product
router.post("/", (req, res) => {
  const {
    productName,
    productDescription,
    price,
    imageURL,
    stock,
    category_id,
  } = req.body;

  db.query(
    "INSERT INTO products (productName, productDescription, price, imageURL, stock, category_id) VALUES (?, ?, ?, ?, ?, ?)",
    [productName, productDescription, price, imageURL, stock, category_id],
    (err, result) => {
      if (err) return res.status(500).json("Insert Error: " + err.message);
      res.json({ status: "Success", product_id: result.insertId });
    }
  );
});

module.exports = router;
