import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { toast } from "react-toastify";
import { fetchProducts } from '@/features/slices/productSlice';
import { Link } from 'react-router-dom';

// Import ShadCN's Sheet components
import { Sheet, SheetContent, SheetTrigger } from '@shadcn/ui';

const AdminProducts = () => {
    const dispatch = useDispatch();
    const { list: products, status } = useSelector((state) => state.products);

    const [isSheetOpen, setSheetOpen] = useState(false); // state to manage sheet visibility

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    if (status === "pending") {
        return <div className="flex items-center justify-center min-h-screen">Loading products...</div>;
    }

    if (status === "rejected") {
        return <div className="flex items-center justify-center min-h-screen">Failed to load products</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold mb-8 text-center">Our Products</h1>
            
            {/* Button to open the Sheet */}
            <button
                className="btn btn-primary mb-4"
                onClick={() => setSheetOpen(true)} // Open the sheet on click
            >
                Add Product
            </button>

            {/* ShadCN Sheet Component */}
            <Sheet open={isSheetOpen} onClose={() => setSheetOpen(false)}>
                <SheetContent side="left" className="w-96 p-6">
                    <h2 className="text-xl font-semibold mb-4">Add a New Product</h2>
                    {/* Form or content for adding a product */}
                    <form>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Product Name</label>
                            <input
                                type="text"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Product Name"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Price</label>
                            <input
                                type="number"
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Product Price"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Product Description"
                            ></textarea>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                className="btn btn-primary"
                            >
                                Save Product
                            </button>
                        </div>
                    </form>
                </SheetContent>
            </Sheet>

            {/* Display products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products?.map((product) => (
                    <Card key={product.id} className="shadow-lg rounded-lg">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-40 object-cover rounded-md mb-4"
                            />
                            <p className="text-gray-600">Price: ${product.price}</p>
                            <p className="text-gray-600">Description: {product.desc}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminProducts;
