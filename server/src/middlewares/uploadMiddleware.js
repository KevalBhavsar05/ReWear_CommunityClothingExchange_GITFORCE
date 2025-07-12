import multer from "multer";
import path from "path";
import fs from "fs";

// Define storage logic
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Get user ID from authenticated user or request body
    const userId = req.user?._id || req.body.owner;
    
    if (!userId) {
      return cb(new Error("User not authenticated or owner ID missing"));
    }
    
    const folderPath = `uploads/${userId}`;

    // Create user folder if not exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    
    console.log(`Uploading to folder: ${folderPath}`);
    cb(null, folderPath);
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `product-${uniqueSuffix}${ext}`);
  }
});

// Filter for images only
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);
  
  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed!"), false);
  }
};

// Init upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 5 * 1024 * 1024, // Max 5MB
    files: 5 // Max 5 files
  },
});

export default upload;
