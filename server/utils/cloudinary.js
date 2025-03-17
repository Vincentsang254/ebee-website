const cloudinary = require("cloudinary").v2;
const multer = require("multer");
require("dotenv").config(); // Load environment variables

// 🔧 Configure Cloudinary
cloudinary.config({
  cloud_name: "vincentsang",
  api_key: "455286944547629",
  api_secret: "764okYVYwP9WOp5iXMKS7Oxbr7c",
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// 📤 Cloudinary Upload Utility
const imageUploadUtil = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file,{
      upload_preset: "ebee", // 👈 Use your preset name
      resource_type: "auto",
    } );
    return result;
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error(error.message); // ✅ Properly throw error
  }
};


const deleteImageUtil = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    
    res.status(500).json({status: false, message: error.message });
  }
};

const getPublicIdFromUrl = (imageUrl) => {
  const urlParts = imageUrl.split("/");
  return urlParts[urlParts.length - 1].split(".")[0];
};

module.exports = {
  upload,
  imageUploadUtil,
  deleteImageUtil,
  getPublicIdFromUrl,
};
