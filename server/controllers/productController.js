import { imageUploadUtil, deleteImageUtil } from '../utils/cloudinary.js';
import Products from '../models/Products.js';
import Ratings from '../models/Ratings.js';
import Users from '../models/Users.js';
import { Op } from 'sequelize';

// 🟢 Create Product
export const createProducts = async (req, res) => {
  try {
    const { name, desc, price, category } = req.body;
    const userId = req.user.id;

    // Validation
    if (!name || !desc || !price || !category) {
      return res.status(400).json({ status: false, message: 'All fields are required' });
    }

    if (isNaN(price)) {
      return res.status(400).json({ status: false, message: 'Price must be a valid number' });
    }

    if (!req.file) {
      return res.status(400).json({ status: false, message: 'An image is required' });
    }

    // Upload Image
    let uploadedResponse;
    try {
      uploadedResponse = await imageUploadUtil(req.file);
    } catch (uploadError) {
      return res.status(500).json({ status: false, message: 'Image upload failed' });
    }
    
    const imageUrl = uploadedResponse.secure_url;

    // Create Product
    const product = await Products.create({
      name,
      desc,
      price,
      category,
      userId,
      imageUrl,
    });

    res.status(200).json({ message: 'Product created successfully', product });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// 🔴 Delete Product
export const deleteProducts = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Products.findByPk(productId);
    if (!product) return res.status(404).json({ status: false, message: 'Product not found' });

    // Check if user has permission to delete (admin or the product owner)
    if (product.userId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ status: false, message: 'You do not have permission to delete this product' });
    }

    const publicId = product.imageUrl.split('/').pop().split('.')[0];
    await deleteImageUtil(publicId);

    await Products.destroy({ where: { id: productId } });

    res.status(200).json({ status: true, message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// 🟡 Update Product
export const updateProducts = async (req, res) => {
  const productId = req.params.productId;
  const { name, desc, price, category } = req.body;

  try {
    const product = await Products.findByPk(productId);
    if (!product) return res.status(404).json({ status: false, message: 'Product not found' });

    // Check if user has permission to update (admin or the product owner)
    if (product.userId !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ status: false, message: 'You do not have permission to update this product' });
    }

    let updatedImageUrl = product.imageUrl;

    if (req.file) {
      const publicId = product.imageUrl.split('/').pop().split('.')[0];
      await deleteImageUtil(publicId);

      let uploadResponse;
      try {
        uploadResponse = await imageUploadUtil(req.file);
      } catch (uploadError) {
        return res.status(500).json({ status: false, message: 'Image upload failed' });
      }

      updatedImageUrl = uploadResponse.secure_url;
    }

    await Products.update(
      { name, desc, price, category, imageUrl: updatedImageUrl },
      { where: { id: productId } }
    );

    res.status(200).json({ status: true, message: 'Product updated successfully', product });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// 🟢 Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Products.findAll({
      attributes: { exclude: ['userId'] },
      include: [
        {
          model: Ratings,
          as: 'ratings',
          include: {
            model: Users,
            as: 'user',
            attributes: ['name'],
          },
        },
      ],
    });


    res.status(200).json({ status: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// 🟢 Get Product by ID
export const getProductById = async (req, res) => {
  const productId = req.params.productId;

  try {
    const product = await Products.findOne({
      where: { id: productId },
      include: [
        {
          model: Ratings,
          as: 'ratings',
          include: {
            model: Users,
            as: 'user',
            attributes: ['name'],
          },
        },
      ],
    });

    if (!product) {
      return res.status(404).json({ status: false, message: 'Product not found' });
    }

    res.status(200).json({ status: true, data: product });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// 🔍 Search Products by Name
export const searchProducts = async (req, res) => {
  const { name, price, category, desc } = req.body;

  try {
    const searchConditions = {};

    if (name) searchConditions.name = { [Op.like]: `%${name}%` };
    if (price) searchConditions.price = { [Op.eq]: price };
    if (category) searchConditions.category = { [Op.like]: `%${category}%` };
    if (desc) searchConditions.desc = { [Op.like]: `%${desc}%` };

    const products = await Products.findAll({ where: searchConditions });

    if (products.length === 0) {
      return res.status(404).json({ status: false, message: 'No products found' });
    }

    res.status(200).json({ status: true, data: products });
  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ status: false, message: error.message });
  }
};