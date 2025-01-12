import cloudinary from 'cloudinary';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid'; // Importing uuid for generating unique public_id

// Configure cloudinary
cloudinary.v2.config({
  cloud_name: "vincentsang",
  api_key: "455286944547629",
  api_secret: "764okYVYwP9WOp5iXMKS7Oxbr7c",
});

// Set up multer for file storage (in memory storage for image uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('image'); // Change 'image' to the form field name if needed

// Function to handle file upload to Cloudinary
export const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.v2.uploader.upload(file.buffer, {
      public_id: uuidv4(),
      folder: "products",  // Specify the folder on Cloudinary where images will be stored
      resource_type: 'auto', // Automatically determine resource type (image, video, etc.)
    });
    return result;  // Return the result from Cloudinary containing image URL, public ID, etc.
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to delete an image from Cloudinary using its public ID
export const deleteImageFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.v2.uploader.destroy(publicId);
    return result;  // Return result after deletion (confirmation)
  } catch (error) {
    throw new Error(error.message);
  }
};

// Exporting multer upload for use in routes
export { upload };
