import mongoose from "mongoose";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

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

const populateUsers = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    
    const hashedPassword = await bcrypt.hash("password123", 10);
    
    const users = [
      {
        name: "Admin User",
        email: "admin@rewear.com",
        password: hashedPassword,
        points: 100,
        city: "New York",
        country: "USA",
        isAdmin: true
      },
      {
        name: "John Doe",
        email: "@example.com",
        password: hashedPassword,
        points: 75,
        city: "Los Angeles",
        country: "USA"
      },
      {
        name: "Jane Smith",
        email: "jane@example.com",
        password: hashedPassword,
        points: 50,
        city: "Chicago",
        country: "USA"
      },
      {
        name: "Mike Johnson",
        email: "mike@example.com",
        password: hashedPassword,
        points: 25,
        city: "Miami",
        country: "USA"
      },
      {
        name: "Sarah Wilson",
        email: "sarah@example.com",
        password: hashedPassword,
        points: 80,
        city: "Seattle",
        country: "USA"
      }
    ];
    
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    return createdUsers;
  } catch (error) {
    console.error("Error creating users:", error);
    throw error;
  }
};

const populateItems = async (users) => {
  try {
    // Clear existing items
    await Item.deleteMany({});
    
    const items = [
      {
        title: "Vintage Denim Jacket",
        description: "Classic blue denim jacket in excellent condition. Perfect for layering.",
        category: "Outerwear",
        type: "Swap",
        size: "M",
        condition: "Good",
        images: ["https://images.unsplash.com/photo-1578587018452-892bcefd5b22?w=400"],
        points: 0,
        owner: users[1]._id, // John Doe
        isAvailable: true,
        isApproved: false, // Pending approval
        tags: ["vintage", "denim", "jacket"],
        location: {
          city: "Los Angeles",
          country: "USA"
        }
      },
      {
        title: "Summer Floral Dress",
        description: "Beautiful floral print dress perfect for summer events.",
        category: "Dresses",
        type: "Points",
        size: "S",
        condition: "Like New",
        images: ["https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400"],
        points: 30,
        owner: users[2]._id, // Jane Smith
        isAvailable: true,
        isApproved: true,
        tags: ["floral", "summer", "dress"],
        location: {
          city: "Chicago",
          country: "USA"
        }
      },
      {
        title: "Leather Boots",
        description: "High-quality leather boots with minimal wear.",
        category: "Shoes",
        type: "Swap",
        size: "M",
        condition: "Good",
        images: ["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400"],
        points: 0,
        owner: users[3]._id, // Mike Johnson
        isAvailable: true,
        isApproved: false, // Pending approval
        tags: ["leather", "boots", "winter"],
        location: {
          city: "Miami",
          country: "USA"
        }
      },
      {
        title: "Silk Blouse",
        description: "Elegant silk blouse suitable for professional settings.",
        category: "Tops",
        type: "Points",
        size: "L",
        condition: "New",
        images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400"],
        points: 45,
        owner: users[4]._id, // Sarah Wilson
        isAvailable: true,
        isApproved: true,
        tags: ["silk", "blouse", "professional"],
        location: {
          city: "Seattle",
          country: "USA"
        }
      },
      {
        title: "Cargo Pants",
        description: "Comfortable cargo pants with multiple pockets.",
        category: "Bottoms",
        type: "Swap",
        size: "XL",
        condition: "Fair",
        images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"],
        points: 0,
        owner: users[1]._id, // John Doe
        isAvailable: true,
        isApproved: true,
        tags: ["cargo", "pants", "casual"],
        location: {
          city: "Los Angeles",
          country: "USA"
        }
      },
      {
        title: "Designer Handbag",
        description: "Stylish designer handbag in great condition.",
        category: "Accessories",
        type: "Points",
        size: "One Size",
        condition: "Like New",
        images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400"],
        points: 60,
        owner: users[2]._id, // Jane Smith
        isAvailable: true,
        isApproved: false, // Pending approval
        tags: ["designer", "handbag", "luxury"],
        location: {
          city: "Chicago",
          country: "USA"
        }
      },
      {
        title: "Winter Scarf",
        description: "Warm wool scarf perfect for cold weather.",
        category: "Accessories",
        type: "Swap",
        size: "One Size",
        condition: "Good",
        images: ["https://images.unsplash.com/photo-1520903920245-2d6d925d5c4c?w=400"],
        points: 0,
        owner: users[3]._id, // Mike Johnson
        isAvailable: true,
        isApproved: true,
        tags: ["winter", "scarf", "wool"],
        location: {
          city: "Miami",
          country: "USA"
        }
      },
      {
        title: "Running Shoes",
        description: "Comfortable running shoes with good support.",
        category: "Shoes",
        type: "Points",
        size: "L",
        condition: "Good",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"],
        points: 35,
        owner: users[4]._id, // Sarah Wilson
        isAvailable: true,
        isApproved: true,
        tags: ["running", "shoes", "athletic"],
        location: {
          city: "Seattle",
          country: "USA"
        }
      }
    ];
    
    const createdItems = await Item.insertMany(items);
    console.log(`✅ Created ${createdItems.length} items`);
    return createdItems;
  } catch (error) {
    console.error("Error creating items:", error);
    throw error;
  }
};

const main = async () => {
  try {
    console.log("🚀 Starting database population...");
    
    // Connect to database
    await connectDb();
    
    // Populate users
    const users = await populateUsers();
    
    // Populate items
    await populateItems(users);
    
    console.log("✅ Database population completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`- ${users.length} users created`);
    console.log(`- Admin user: admin@rewear.com (password: password123)`);
    console.log(`- Regular users: john@example.com, jane@example.com, mike@example.com, sarah@example.com`);
    console.log(`- All users have password: password123`);
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error populating database:", error);
    process.exit(1);
  }
};

main(); 