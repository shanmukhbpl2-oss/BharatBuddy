import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI not found in .env");
    }

    console.log("🔄 Connecting to MongoDB...");
    const connectPromise = mongoose.connect(mongoUri, { 
      connectTimeoutMS: 5000,
      socketTimeoutMS: 5000 
    });

    // Set a timeout for MongoDB connection
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("MongoDB connection timeout")), 8000)
    );

    await Promise.race([connectPromise, timeoutPromise]);

    console.log("✅ MongoDB connected successfully");
    return mongoose.connection;
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.log("⚠️ Continuing without database - API will work but data won't be saved");
    // Don't exit - let the server continue without DB
  }
};

export default mongoose;
