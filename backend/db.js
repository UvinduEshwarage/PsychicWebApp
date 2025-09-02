const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "psychicdb",
});

db.connect((err) => {
  if (err) {
    console.error("Database Connection Failed:", err);
    throw err;
  }
  console.log(" MySQL Connected...");
});

module.exports = db;
