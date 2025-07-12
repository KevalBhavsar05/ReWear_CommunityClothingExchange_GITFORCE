import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Import models
import User from "./src/models/user.js";
import Item from "./src/models/item.js";

const connectDb = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/rewear";
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

const populateData = async () => {
  try {
    console.log("🚀 Starting database population...");
    
    // Connect to database
    await connectDb();
    
    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    
    // Create admin user
    const hashedPassword = await bcrypt.hash("password123", 10);
    const adminUser = new User({
      name: "Admin User",
      email: "admin@rewear.com",
      password: hashedPassword,
      points: 100,
      city: "New York",
      country: "USA",
      isAdmin: true
    });
    
    const savedAdmin = await adminUser.save();
    console.log("✅ Created admin user:", savedAdmin.email);
    
    // Create regular user
    const regularUser = new User({
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      points: 75,
      city: "Los Angeles",
      country: "USA"
    });
    
    const savedUser = await regularUser.save();
    console.log("✅ Created regular user:", savedUser.email);
    
    // Create a points item
    const pointsItem = new Item({
      title: "Summer Floral Dress",
      description: "Beautiful floral print dress perfect for summer events.",
      category: "Dresses",
      type: "Points",
      size: "S",
      condition: "Like New",
      images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"],
      points: 30,
      owner: savedUser._id,
      isAvailable: true,
      isApproved: true,
      tags: ["floral", "summer", "dress"],
      location: {
        city: "Los Angeles",
        country: "USA"
      }
    });
    
    await pointsItem.save();
    console.log("✅ Created points item");
    
    // Create a swap item
    const swapItem = new Item({
      title: "Vintage Denim Jacket",
      description: "Classic blue denim jacket in excellent condition.",
      category: "Outerwear",
      type: "Swap",
      size: "M",
      condition: "Good",
      images: ["https://images.unsplash.com/photo-1578587018452-892bcefd5b22?w=400"],
      points: 0,
      owner: savedUser._id,
      isAvailable: true,
      isApproved: false, // Pending approval
      tags: ["vintage", "denim", "jacket"],
      location: {
        city: "Los Angeles",
        country: "USA"
      }
    });
    
    await swapItem.save();
    console.log("✅ Created swap item (pending approval)");
    
    console.log("✅ Database population completed successfully!");
    console.log("\n📊 Test Data:");
    console.log(`- Admin: admin@rewear.com (password: password123)`);
    console.log(`- User: john@example.com (password: password123)`);
    console.log(`- Points item available for redemption`);
    console.log(`- Swap item pending admin approval`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error populating database:", error);
    process.exit(1);
  }
};

populateData(); 