const express = require("express");
const router = express.Router();
const db = require("../db");

// Signup
router.post("/signup", (req, res) => {
  const sql =
    "INSERT INTO users (name, email, password, contact, address) VALUES (?)";
  const values = [
    req.body.name,
    req.body.email,
    req.body.password,
    req.body.contact,
    req.body.address,
  ];

  db.query(sql, [values], (err, result) => {
    if (err) {
      console.error("Insert Error:", err);
      return res.status(500).json("Database Error");
    }

    const newUserId = result.insertId;
    const sqlRole =
      "INSERT INTO roles (user_id, roleStatus, description) VALUES (?, 'user', 'Standard user')";
    db.query(sqlRole, [newUserId], (err2) => {
      if (err2) {
        console.error("Role Insert Error:", err2);
        return res
          .status(500)
          .json({ status: "Error", message: "Role Insert Failed" });
      }

      return res.status(200).json({
        status: "Success",
        message: "User Created Successfully",
        user_id: newUserId,
      });
    });
  });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;
  const sql = `
    SELECT users.user_id, users.name, users.email, users.contact, users.address, roles.roleStatus
    FROM users
    LEFT JOIN roles ON users.user_id = roles.user_id
    WHERE users.email = ? AND users.password = ?
  `;

  db.query(sql, [email, password], (err, data) => {
    if (err) return res.status(500).json("Database Error");

    if (data.length > 0) {
      const user = data[0];
      return res.status(200).json({
        status: "Success",
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        contact: user.contact,
        address: user.address,
        roleStatus: user.roleStatus || "user",
      });
    } else {
      return res
        .status(401)
        .json({ status: "Fail", message: "Invalid email or password" });
    }
  });
});

// Get user by ID
router.get("/:user_id", (req, res) => {
  const sql = "SELECT * FROM users WHERE user_id = ?";
  db.query(sql, [req.params.user_id], (err, data) => {
    if (err)
      return res.status(500).json({ status: "Error", message: "DB Error" });
    if (data.length > 0) return res.status(200).json(data[0]);
    return res.status(404).json({ status: "Error", message: "User not found" });
  });
});

module.exports = router;
