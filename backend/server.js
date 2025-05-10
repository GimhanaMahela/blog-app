require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const http = require("http"); // Add this for Socket.IO
const { errorHandler, notFound } = require("./middlewares/error.middleware");
const socketio = require("socket.io"); // Add Socket.IO

const app = express();

// Middlewares
app.use(
  cors({
    origin: "http://localhost:3000", // Move CORS config here
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Create HTTP server for Socket.IO
const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Socket.IO connection handler
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Join a specific post room
  socket.on("joinPost", (postId) => {
    socket.join(postId);
    console.log(`Socket ${socket.id} joined post ${postId}`);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Make io accessible to routes
app.set("io", io);

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
    server.listen(PORT, () => {
      // Changed from app.listen to server.listen
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server initialization failed:", error.message);
    process.exit(1);
  }
};

startServer();
