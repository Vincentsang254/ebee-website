import Sequelize from "sequelize";
import cloudinary from "../utils/cloudinary";
import { uploadImage, deleteImage } from "../utils/imageUtils";
import Products from "../models/Products.js";
import Ratings from "../models/Ratings.js";
import Users from "../models/Users.js";

export const createProducts = async (req, res) => {
    try {
        const { name, desc, price, category } = req.body;
        const userId = req.user.id;

        // Validate the input
        if (!name || !desc || !price || !category) {
            return res.status(400).json({
                status: 400,
                message: "All fields (name, desc, price, category) are required",
            });
        }

        // Check if the image is uploaded
        if (!req.file) {
            return res.status(400).json({
                status: 400,
                message: "An image is required",
            });
        }

        // Upload the image
        const uploadedResponse = await cloudinary.imageUploadUtil(req.file);
        const imageUrl = uploadedResponse.secure_url;

        // Create the product
        const product = await Products.create({
            name,
            desc,
            price,
            category,
            userId,
            imageUrl
        });

        res.status(200).json({
            message: "Product created successfully",
            product,
        });
    } catch (error) {
        console.error("Error creating product:", error);
        res.status(500).json({ status: 500, message: error.message });
    }
};

export const deleteProducts = async (req, res) => {
    const productId = req.params.productId;
    try {
        // Fetch the product by ID
        const product = await Products.findByPk(productId);

        // Check if product exists
        if (!product) {
            return res.status(404).json({ status: 404, message: "Product not found" });
        }

        // Handle the image deletion
        const imageUrl = product.imageUrl;
        if (imageUrl) {
            const publicId = imageUrl.split("/").pop().split(".")[0];

            try {
                const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);

                if (cloudinaryResponse.result !== "ok") {
                    console.error("Cloudinary image deletion failed:", cloudinaryResponse);
                    return res.status(500).json({ status: 500, message: "Error deleting image from Cloudinary" });
                }
            } catch (cloudinaryError) {
                console.error("Error deleting image from Cloudinary:", cloudinaryError.message);
                return res.status(500).json({ status: 500, message: "Error deleting image from Cloudinary" });
            }
        }

        // Delete the product from the database
        await Products.destroy({ where: { id: productId } });

        res.status(204).send(); // No Content for successful deletion
    } catch (error) {
        console.error("Error deleting product:", error.message);
        res.status(500).json({ status: 500, message: error.message });
    }
};

export const updateProducts = async (req, res) => {
    const productId = req.params.productId;
    const { name, desc, price, category } = req.body;

    try {
        // Check if the product exists
        const product = await Products.findByPk(productId);

        if (!product) {
            return res.status(404).json({ status: 404, message: "Product not found" });
        }

        let updatedImageUrl = product.imageUrl;

        // Check if a new image is provided
        if (req.file) {
            // Delete the old image from Cloudinary
            const publicId = product.imageUrl.split("/").pop().split(".")[0];

            try {
                const cloudinaryResponse = await cloudinary.uploader.destroy(publicId);

                if (cloudinaryResponse.result !== "ok") {
                    console.error("Cloudinary image deletion failed:", cloudinaryResponse);
                    return res.status(500).json({ status: 500, message: "Error deleting old image from Cloudinary" });
                }
            } catch (cloudinaryError) {
                console.error("Error deleting image from Cloudinary:", cloudinaryError.message);
                return res.status(500).json({ status: 500, message: "Error deleting old image from Cloudinary" });
            }

            // Upload the new image to Cloudinary
            const uploadResponse = await cloudinary.imageUploadUtil(req.file);
            updatedImageUrl = uploadResponse.secure_url;
        }

        // Update the product details in the database
        await Products.update(
            { name, desc, price, category, imageUrl: updatedImageUrl },
            { where: { id: productId } }
        );

        res.status(200).json({ status: 200, message: "Product updated successfully" });
    } catch (error) {
        console.error("Error updating product:", error.message);
        res.status(500).json({ status: 500, message: error.message });
    }
};

export const getProducts = async (req, res) => {
    try {
        const products = await Products.findAll({
            attributes: { exclude: ["userId"] },
            include: [
                {
                    model: Ratings,
                    as: "ratings",
                    required: false,
                    include: {
                        model: Users,
                        as: "user",
                        attributes: ["name"],
                    },
                },
            ],
        });

        const formattedResponse = {
            total: products.length,
            products: products.map((product) => ({
                id: product.id,
                imageUrl: product.imageUrl,
                name: product.name,
                desc: product.desc,
                category: product.category,
                price: product.price.toString(),
                ratings: product.ratings.map((rating) => ({
                    id: rating.id,
                    rating: rating.rating,
                    ratingCount: rating.ratingCount,
                    desc: rating.desc,
                    user: {
                        name: rating.user ? rating.user.name : null,
                    },
                })),
            })),
        };

        res.status(200).json({ success: true, data: formattedResponse });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ status: 500, message: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const productId = req.params.productId;

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
            return res.status(404).json({ status: 404, message: "No product found" });
        }

        res.status(200).json({ status: 200, data: product });
    } catch (error) {
        console.error("Error fetching product by ID:", error);
        res.status(500).json({ status: 500, message: error.message });
    }
};

export const searchProductsByName = async (req, res) => {
    const { name, price, category, desc } = req.body;

    try {
        const searchConditions = {};

        if (name) {
            searchConditions.name = { [Op.like]: `%${name}%` };
        }

        if (price) {
            searchConditions.price = { [Op.eq]: price };
        }

        if (category) {
            searchConditions.category = { [Op.like]: `%${category}%` };
        }

        if (desc) {
            searchConditions.description = { [Op.like]: `%${desc}%` };
        }

        const products = await Products.findAll({
            where: searchConditions,
        });

        if (products.length === 0) {
            return res.status(404).json({ status: 404, message: "No products found matching the search criteria" });
        }

        res.status(200).json({ status: 200, data: products });
    } catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({ status: 500, message: error.message });
    }
};
