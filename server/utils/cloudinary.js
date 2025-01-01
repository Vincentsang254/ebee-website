import cloudinary from "cloudinary";
import multer from "multer";

// Configure cloudinary
cloudinary.v2.config({
  cloud_name: "vincentsang",
  api_key: "455286944547629",
  api_secret: "764okYVYwP9WOp5iXMKS7Oxbr7c",
});

// Set up multer storage in memory
const storage = multer.memoryStorage();

// Image upload utility function using cloudinary upload stream
const imageUploadUtil = async (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      }
    ).end(file.buffer); // Ensure to send the file buffer
  });
};

// Set up multer upload instance
const upload = multer({ storage });

export { upload, imageUploadUtil };  // Export the upload and imageUploadUtil functions
