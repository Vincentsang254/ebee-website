import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

// 🔧 Configure Cloudinary
cloudinary.config({
  cloud_name: "vincentsang",
  api_key: "455286944547629",
  api_secret: "764okYVYwP9WOp5iXMKS7Oxbr7c",
});

// 🖼️ Multer Memory Storage (Storing file in memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// 🔄 Image Upload Function (using multer memory storage)
export const imageUploadUtil = async (file) => {
  try {
    const result = await cloudinary.v2.uploader.upload_stream(
      {
        public_id: uuidv4(), // Generate unique ID for the file
        folder: "products",   // Define folder on Cloudinary
      },
      (error, result) => {
        if (error) {
          throw new Error(`Image upload failed: ${error.message}`);
        }
        return result; // Return result if upload is successful
      }
    );
    
    // Upload the file buffer to Cloudinary
    result.end(file.buffer);  // The file buffer from multer memory storage
  } catch (error) {
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

// 🗑️ Image Delete Utility Function
export const deleteImageUtil = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Error deleting image: ${error.message}`);
  }
};

export { upload };
