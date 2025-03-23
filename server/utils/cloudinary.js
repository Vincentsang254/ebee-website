const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");
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

const imageUploadUtil = async (file) => {
  try {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          upload_preset: "ebee",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            reject(new Error(error.message));
          } else {
            resolve(result);
          }
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    throw new Error(error.message);
  }
};


const deleteImageUtil = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
    throw new Error("Failed to delete image from Cloudinary");
  }
};


const getPublicIdFromUrl = (imageUrl) => {
  try {
    const url = new URL(imageUrl); // Ensure it's a valid URL
    const pathParts = url.pathname.split("/"); // Get parts after domain
    const fileNameWithExt = pathParts.pop(); // Extract last part (filename)
    return fileNameWithExt.split(".")[0]; // Remove extension and return ID
  } catch (error) {
    console.error("Invalid Cloudinary URL:", error);
    return null; // Handle invalid URL gracefully
  }
};


module.exports = {
  upload,
  imageUploadUtil,
  deleteImageUtil,
  getPublicIdFromUrl,
};
