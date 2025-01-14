
import { v2 as cloudinary } from "cloudinary";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";

// 🔧 Configure Cloudinary
cloudinary.config({
  cloud_name: "vincentsang",
  api_key: "455286944547629",
  api_secret: "764okYVYwP9WOp5iXMKS7Oxbr7c",
});


// 🖼️ Multer Storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: {
    folder: "products",
    public_id: (req, file) => uuidv4(),
  },
});

export const upload = multer({ storage });

// 🔄 Upload Function
export const imageUploadUtil = async (file) => {
  try {
    const result = await cloudinary.v2.uploader.upload(file.path, {
      public_id: uuidv4(),
      folder: "products",
    });
    return result;
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
