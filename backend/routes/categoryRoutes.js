const express = require("express");
const router = express.Router();
const db = require("../db");

// Get all categories
router.get("/", (req, res) => {
  db.query("SELECT * FROM category", (err, data) => {
    if (err) return res.status(500).json("Database Error");
    res.json(data);
  });
});

// Add category
router.post("/", (req, res) => {
  const { name } = req.body;
  db.query(
    "INSERT INTO category (category_name) VALUES (?)",
    [name],
    (err, result) => {
      if (err) return res.status(500).json("Insert Error");
      res.json({ status: "Success", category_id: result.insertId });
    }
  );
});

// Update category
router.put("/:id", (req, res) => {
  const { name } = req.body;
  db.query(
    "UPDATE category SET category_name = ? WHERE category_id = ?",
    [name, req.params.id],
    (err, result) => {
      if (err) return res.status(500).json("Update Error");
      res.json({ status: "Success" });
    }
  );
});

module.exports = router;
