const { imageUploadUtil, deleteImageUtil, getPublicIdFromUrl } = require("../utils/cloudinary");
const { Users, Products, Ratings } = require("../models");
const { Op } = require("sequelize");

const handleImageUpload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: false, message: "No file uploaded" });
    }

    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = `data:${req.file.mimetype};base64,${b64}`;

    console.log("Uploading to Cloudinary...");
    const result = await imageUploadUtil(url);
    console.log("Cloudinary Response:", result);

    res.status(200).json({ status: true, message: "Image uploaded successfully", result });
  } catch (error) {
    console.error("Upload Error:", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};



const createProducts = async (req, res) => {
  try {
    const { name, desc, price, userId } = req.body;
    // const userId = 1;//from frontend

    if (!userId) {
      return res.status(400).json({ status: false, message: "Kindly login first" });
    }
    if (!name) {
      return res.status(400).json({ status: false, message: "Name is required" });
    }
    if (!desc) {
      return res.status(400).json({ status: false, message: "Description is required" });
    }
    if (!price) {
      return res.status(400).json({ status: false, message: "Price is required" });
    }


    if (isNaN(price)) {
      return res.status(400).json({ status: false, message: "Price must be a valid number" });
    }


    console.log("Uploading image to Cloudinary...");
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    if (!b64) {
      return res.status(400).json({ status: false, message: "No file uploaded b64" });  
      }
    const fileData = `data:${req.file.mimetype}:base64,${b64}`;

    if (!fileData) {
      return res.status(400).json({ status: false, message: "No file uploaded file data" });
    }

    const result = await imageUploadUtil(fileData);
    
    if (!result) {
      return res.status(400).json({ status: false, message: "No file uploaded result" });
    }

    const imageUrl = result.secure_url; // ✅ Use Cloudinary URL

    const product = await Products.create({
      name,
      desc,
      price,
      userId,
      imageUrl,
    });

    res.status(200).json({ status: true, message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product from productController.js:", error?.message);
    res.status(500).json({ status: false, message: error.message });
  }
};

const deleteProducts = async (req, res) => {
  const productId = req.params.productId;

  if (!productId || isNaN(productId)) {
    return res.status(400).json({ status: false, message: "Invalid product ID" });
  }

  try {
    const product = await Products.findByPk(productId);
    if (!product) return res.status(404).json({ status: false, message: "Product not found" });

    // // Ensure only the owner or an admin can delete
    // if (product.userId !== req.user.id && req.user.userType !== "Admin") {
    //   return res.status(403).json({ status: false, message: "Unauthorized action" });
    // }

    // Extract Cloudinary Public ID
    const publicId = getPublicIdFromUrl(product.imageUrl);
    console.log("Extracted Public ID:", publicId);

    // Delete from Cloudinary
    try {
      await deleteImageUtil(publicId);
    } catch (error) {
      return res.status(500).json({ status: false, message: error.message });
    }

    // Delete product from database
    await Products.destroy({ where: { id: productId } });

    res.status(200).json({ status: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateProducts = async (req, res) => {
  try {
    const productId = req.params.productId;
    const { name, desc, price } = req.body;
    const product = await Products.findByPk(productId);

    if (!product) return res.status(404).json({ status: false, message: "Product not found" });
    if (!name || !desc || !price) return res.status(400).json({ status: false, message: "All fields are required" });

    let updatedImageUrl = product.imageUrl;

    if (req.file) {
      try {
        console.log("File received:", req.file); // Debugging

        const publicId = getPublicIdFromUrl(product.imageUrl);
        if (publicId) await deleteImageUtil(publicId); // Delete old image if exists

        const uploadResponse = await imageUploadUtil(req.file);
        updatedImageUrl = uploadResponse.secure_url;
      } catch (error) {
        console.error("Error updating product image:", error.message);
        return res.status(500).json({ status: false, message: `Image update failed: ${error.message}` });
      }
    }

    await product.update({ name, desc, price, imageUrl: updatedImageUrl });

    res.status(200).json({ status: true, message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Using findAndCountAll to get both data and total count for pagination
    const { count, rows: products } = await Products.findAndCountAll({
      attributes: { exclude: ["userId"] },
      include: [
        {
          model: Ratings,
          as: "ratings",
          include: {
            model: Users,
            as: "user",
            attributes: ["name"],
          },
        },
      ],
      offset,
      limit,
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      status: true,
      data: products,
      currentPage: page,
      totalPages: Math.ceil(count / limit),
      hasMore: offset + products.length < count,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};


// 🟢 Get Product by ID
const getProductById = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Products.findOne({
      where: { id: productId },
      include: [
        {
          model: Ratings,
          as: "ratings",
          include: {
            model: Users,
            as: "user",
            attributes: ["name"],
          },
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ status: false, message: "Product not found" });
    }

    res.status(200).json({ status: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// 🔍 Search Products by Name
const searchProducts = async (req, res) => {
  const { name, price, desc } = req.body;

  try {
    const searchConditions = {};

    if (name) searchConditions.name = { [Op.like]: `%${name}%` };
    if (price) searchConditions.price = { [Op.eq]: price };

    if (desc) searchConditions.desc = { [Op.like]: `%${desc}%` };

    const products = await Products.findAll({ where: searchConditions });

    if (products.length === 0) {
      return res.status(404).json({ status: false, message: "No products found" });
    }

    res.status(200).json({ status: true, data: products });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createProducts,
  getProducts,
  searchProducts,
  getProductById,
  updateProducts,
  deleteProducts,
  handleImageUpload
};
