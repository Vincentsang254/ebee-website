const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const uuidv4 = require("uuid").v4;

// 🔧 Configure Cloudinary
cloudinary.config({
  cloud_name: "vincentsang",
  api_key: "455286944547629",
  api_secret: "764okYVYwP9WOp5iXMKS7Oxbr7c",
});

const storage = multer.memoryStorage();

const imageUploadUtil = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file, {
      resourse_type: "auto",
     })
     return result
  }catch(error) {
    res.status(500).json({status: false, message: error.message });
  
  }
}


const upload = multer({ storage });

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
