const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all orders
router.get("/", (req, res) => {
  const sql = `
    SELECT o.order_id, o.user_id, o.total, o.created_at, o.orderstatus,
       oi.order_item_id, oi.product_id, oi.quantity, oi.price
FROM orders o
INNER JOIN order_items oi ON o.order_id = oi.order_id
  `;
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json("Database Error");
    res.json(data);
  });
});

// Add order
router.post("/", (req, res) => {
  const { user_id, items } = req.body;
  // items = array of { product_id, quantity, price }

  // Step 1: Insert into orders
  db.query(
    "INSERT INTO orders (user_id) VALUES (?)",
    [user_id],
    (err, result) => {
      if (err) return res.status(500).json("Insert Order Error");

      const orderId = result.insertId;

      // Step 2: Insert items into order_items
      const orderItems = items.map((item) => [
        orderId,
        item.product_id,
        item.quantity,
        item.price,
      ]);

      db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?",
        [orderItems],
        (err2) => {
          if (err2) return res.status(500).json("Insert Order Items Error");
          res.json({ status: "Success", order_id: orderId });
        }
      );
    }
  );
});
module.exports = router;
