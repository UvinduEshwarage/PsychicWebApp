const express = require("express");
const router = express.Router();
const db = require("../db"); // MySQL connection

// Checkout Route
router.post("/", (req, res) => {
  const { user_id, cart } = req.body;

  if (!user_id || !cart || cart.length === 0) {
    return res.status(400).json({ error: "Invalid request" });
  }

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });

    // 1. Create order
    const createOrder = `INSERT INTO orders (user_id, total) VALUES (?, 0)`;
    db.query(createOrder, [user_id], (err, result) => {
      if (err)
        return db.rollback(() => res.status(500).json({ error: err.message }));

      const orderId = result.insertId;

      // 2. Prepare order items
      let total = 0;
      const orderItems = cart.map((item) => {
        total += item.price * item.quantity;
        return [orderId, item.id, item.quantity, item.price];
      });

      // 3. Insert into order_items
      db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?",
        [orderItems],
        (err) => {
          if (err)
            return db.rollback(() =>
              res.status(500).json({ error: err.message })
            );

          // 4. Update product stock
          const stockUpdates = cart.map((item) => {
            return new Promise((resolve, reject) => {
              db.query(
                "UPDATE products SET stock = stock - ? WHERE product_id = ? AND stock >= ?",
                [item.quantity, item.id, item.quantity],
                (err, result) => {
                  if (err) return reject(err);
                  if (result.affectedRows === 0) {
                    return reject(
                      new Error(`Not enough stock for product ${item.id}`)
                    );
                  }
                  resolve();
                }
              );
            });
          });

          Promise.all(stockUpdates)
            .then(() => {
              // 5. Update total in orders
              db.query(
                "UPDATE orders SET total = ? WHERE order_id = ?",
                [total, orderId],
                (err) => {
                  if (err)
                    return db.rollback(() =>
                      res.status(500).json({ error: err.message })
                    );

                  db.commit((err) => {
                    if (err)
                      return db.rollback(() =>
                        res.status(500).json({ error: err.message })
                      );

                    res.json({ message: "Order placed successfully", orderId });
                  });
                }
              );
            })
            .catch((error) => {
              db.rollback(() => {
                res.status(400).json({ error: error.message });
              });
            });
        }
      );
    });
  });
});

module.exports = router;
