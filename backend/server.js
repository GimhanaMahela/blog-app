require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const { errorHandler, notFound } = require("./middlewares/error.middleware");

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Import routes
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/posts.routes");

// Initialize DB and Server
const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");

    // Database connection
    const db = await require("./config/db")();

    // Routes
    app.use("/api/auth", authRoutes);
    app.use("/api/posts", postRoutes);

    // Test route
    app.get("/api/test", (req, res) => {
      res.json({
        message: "API is working",
        dbStatus: mongoose.connection.readyState,
        dbName: mongoose.connection?.name,
      });
    });

    // 404 handler
    app.use(notFound);

    // Error handler
    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server initialization failed:", error.message);
    process.exit(1);
  }
};

startServer();
