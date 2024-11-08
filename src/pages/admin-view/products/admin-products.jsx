import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card"

import { toast } from "react-toastify";

import { fetchProducts } from '@/features/slices/productSlice';
import { Link } from 'react-router-dom';

const AdminProducts = () => {
    const dispatch = useDispatch();
    const { list: products, status } = useSelector((state) => state.products);
console.log("Fetch products status", status)
console.log("Fetch products list", products)
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
            <Link to="/admin/add-products">Add Product</Link>
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
                            <p className="text-gray-600">Description: {product.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AdminProducts;
