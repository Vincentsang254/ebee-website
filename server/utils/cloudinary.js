
import cloudinary from "cloudinary";
import multer from "multer";

// Configure cloudinary
cloudinary.v2.config({
  cloud_name: "vincentsang",
  api_key: "455286944547629",
  api_secret: "764okYVYwP9WOp5iXMKS7Oxbr7c",
});

// 🔄 Upload Function
export const upload = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      public_id: uuidv4(),
      folder: "products",
    });
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Image upload utility function
export const imageUploadUtil = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { resource_type: 'auto' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    ).end(file.buffer);
  });
};

// Image delete utility function
export const deleteImageUtil = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Error deleting image: ${error.message}`);
  }
};
