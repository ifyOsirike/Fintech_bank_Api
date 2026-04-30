require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db.js");

const authRoutes = require("./routes/authRoute.js");
const accountRoutes = require("./routes/accountRoute.js");
const transactionRoutes = require("./routes/transactionRoute.js");
const errorHandler = require("./middleware/errorHandler.js");

connectDB();

const app = express();

app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);

app.use(errorHandler);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});