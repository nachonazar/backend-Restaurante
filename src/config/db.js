import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.info("MongoDB conectado");
  } catch (error) {
    console.error("Error conectando a MongoDB:", error);
    // Sin process.exit(1) — en Vercel serverless esto mata la función
  }
};

export default connectDB;