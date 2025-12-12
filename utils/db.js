const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log(`[DB] ${new Date().toISOString()} - Attempting to connect to MongoDB...`);
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`[DB] ${new Date().toISOString()} - MongoDB Connected successfully`);
    console.log(`[DB] ${new Date().toISOString()} - Database: ${mongoose.connection.name}`);
    console.log(`[DB] ${new Date().toISOString()} - Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
  } catch (err) {
    console.error(`[DB] ${new Date().toISOString()} - MongoDB Connection Error:`, err.message);
    console.error(`[DB] ${new Date().toISOString()} - Full error:`, err);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;
