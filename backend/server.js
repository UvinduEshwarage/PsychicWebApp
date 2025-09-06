const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/ordersRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const checkoutRoute = require("./routes/checkout");

const app = express();
app.use(cors());
app.use(express.json());

const port = 5000;

// Routes
app.use("/users", userRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);
app.use("/categories", categoryRoutes);
app.use("/checkout", checkoutRoute);
app.listen(port, () => {
  console.log(` Server running on port ${port}`);
});
