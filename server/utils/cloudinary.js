
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

// 🔧 Configure Cloudinary
cloudinary.config({
  cloud_name: "vincentsang",
  api_key: "455286944547629",
  api_secret: "764okYVYwP9WOp5iXMKS7Oxbr7c",
});

// 🖼 Multer Storage
const storage = multer.memoryStorage();
export const upload = multer({ storage });

// 🔄 Image Upload Utility Function
export const imageUploadUtil = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: "auto", public_id: uuidv4(), folder: "products" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(file.buffer);
  });
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
