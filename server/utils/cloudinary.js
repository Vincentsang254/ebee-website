const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const uuidv4 = require("uuid").v4;

// 🔧 Configure Cloudinary
cloudinary.config({
  cloud_name: "vincentsang",
  api_key: "455286944547629",
  api_secret: "764okYVYwP9WOp5iXMKS7Oxbr7c",
});

// 🖼️ Multer Memory Storage (Storing file in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔄 Image Upload Function (Fixed & Improved)
const imageUploadUtil = (file) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: uuidv4(),
        folder: "products",
      },
      (error, result) => {
        if (error) {
          return reject(new Error(`Image upload failed: ${error.message}`));
        }
        resolve(result);
      }
    );
    uploadStream.end(file.buffer); // Upload buffer data
  });
};

// 🗑️ Image Delete Utility Function
const deleteImageUtil = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Error deleting image: ${error.message}`);
  }
};

// Extract Cloudinary Public ID from Image URL
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
