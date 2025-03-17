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
    return res.status(500).json({ status: false, message: "Error uploading image" });
  }
};



const createProducts = async (req, res) => {
  try {
    const { name, desc, price, category } = req.body;
    const userId = 1;//from frontend

    if (!name || !desc || !price || !category) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

    if (isNaN(price)) {
      return res.status(400).json({ status: false, message: "Price must be a valid number" });
    }

    const product = await Products.create({
      name,
      desc,
      price,
      category,
      userId,
      imageUrl,
    });

    res.status(200).json({ status: true, message: "Product created successfully", product });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// 🔴 Delete Product
const deleteProducts = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Products.findByPk(productId);
    if (!product) return res.status(404).json({ status: false, message: "Product not found" });

    if (product.userId !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ status: false, message: "You do not have permission to delete this product" });
    }

    // Extract Cloudinary Public ID
    const publicId = getPublicIdFromUrl(product.imageUrl);

    await deleteImageUtil(publicId);
    await Products.destroy({ where: { id: productId } });

    res.status(200).json({ status: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// 🟡 Update Product
const updateProducts = async (req, res) => {
  const productId = req.params.productId;
  const { name, desc, price, category } = req.body;

  try {
    const product = await Products.findByPk(productId);
    if (!product) return res.status(404).json({ status: false, message: "Product not found" });

    if (product.userId !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ status: false, message: "You do not have permission to update this product" });
    }

    let updatedImageUrl = product.imageUrl;

    if (req.file) {
      try {
        const publicId = getPublicIdFromUrl(product.imageUrl);
        await deleteImageUtil(publicId);

        const uploadResponse = await imageUploadUtil(req.file);
        updatedImageUrl = uploadResponse.secure_url;
      } catch (error) {
        console.error("Error updating product image:", error.message);
        return res.status(500).json({ status: false, message: `Image update failed: ${error.message}` });
      }
    }

    await Products.update(
      { name, desc, price, category, imageUrl: updatedImageUrl },
      { where: { id: productId } }
    );

    res.status(200).json({ status: true, message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// 🟢 Get All Products
const getProducts = async (req, res) => {
  try {
    const products = await Products.findAll({
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
    });

    res.status(200).json({ status: true, data: products });
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
  const { name, price, category, desc } = req.body;

  try {
    const searchConditions = {};

    if (name) searchConditions.name = { [Op.like]: `%${name}%` };
    if (price) searchConditions.price = { [Op.eq]: price };
    if (category) searchConditions.category = { [Op.like]: `%${category}%` };
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
