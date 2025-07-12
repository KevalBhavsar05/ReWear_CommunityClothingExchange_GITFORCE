import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/rewear";
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    console.error("Please make sure MongoDB is running and MONGO_URI is set correctly");
    process.exit(1); // Exit process with failure
  }
};

export default connectDb;
