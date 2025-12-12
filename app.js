const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./utils/db");

// Load environment variables from .env file
dotenv.config();

console.log(`[APP] ${new Date().toISOString()} - Starting Wedding Backend API...`);
console.log(`[APP] ${new Date().toISOString()} - Environment variables loaded`);
console.log(`[APP] ${new Date().toISOString()} - Port: ${process.env.PORT || 5000}`);
console.log(`[APP] ${new Date().toISOString()} - MongoDB URI: ${process.env.MONGO_URI}`);

const app = express();

// Connect to MongoDB
console.log(`[APP] ${new Date().toISOString()} - Connecting to MongoDB...`);
connectDB();

// Middleware
app.use(express.json()); // Body parser for JSON
app.use(cors()); // Enable CORS

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[APP] ${new Date().toISOString()} - ${req.method} ${req.originalUrl} - Request received`);
  console.log(`[APP] ${new Date().toISOString()} - Request headers:`, JSON.stringify(req.headers, null, 2));
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`[APP] ${new Date().toISOString()} - Request body:`, JSON.stringify(req.body, null, 2));
  }

  // Override res.json to log responses
  const originalJson = res.json;
  res.json = function (data) {
    console.log(`[APP] ${new Date().toISOString()} - Response status: ${res.statusCode}`);
    console.log(`[APP] ${new Date().toISOString()} - Response body:`, JSON.stringify(data, null, 2));
    return originalJson.call(this, data);
  };

  next();
});

// Root route
app.get("/", (req, res) => {
  console.log(`[APP] ${new Date().toISOString()} - Root endpoint accessed`);
  res.send("Welcome to the Wedding Planner Backend API!");
});

// Routes
const authRoutes = require("./routes/authRoutes");
const orgRoutes = require("./routes/orgRoutes");

console.log(`[APP] ${new Date().toISOString()} - Registering routes...`);

// Register routes with correct paths
app.use("/admin", authRoutes);
app.use("/org", orgRoutes);

console.log(`[APP] ${new Date().toISOString()} - Routes registered: /admin, /org`);

// 404 handler
app.use("*", (req, res) => {
  console.log(`[APP] ${new Date().toISOString()} - 404 - Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ msg: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(`[APP] ${new Date().toISOString()} - Server error:`, err.stack);
  res.status(500).json({ msg: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`[APP] ${new Date().toISOString()} - Server running on port ${PORT}`);
  console.log(`[APP] ${new Date().toISOString()} - API is ready to accept requests`);
  console.log(`[APP] ${new Date().toISOString()} - Available endpoints:`);
  console.log(`[APP] ${new Date().toISOString()} -   POST /org/create`);
  console.log(`[APP] ${new Date().toISOString()} -   GET /org/get/:name`);
  console.log(`[APP] ${new Date().toISOString()} -   PUT /org/update/:name`);
  console.log(`[APP] ${new Date().toISOString()} -   DELETE /org/delete/:name`);
  console.log(`[APP] ${new Date().toISOString()} -   POST /admin/login`);
});
