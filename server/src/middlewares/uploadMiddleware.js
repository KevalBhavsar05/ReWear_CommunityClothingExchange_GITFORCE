import multer from "multer";
import path from "path";
import fs from "fs";

// Define storage logic
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.query.owner; // 🧠 `owner` must be sent from frontend
    const folderPath = `uploads/${userId}`;

    // Create user folder if not exists
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }
    console.log(userId);
    

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
  if (extName) cb(null, true);
  else cb(new Error("Only image files are allowed!"));
};

// Init upload
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
});

export default upload;
