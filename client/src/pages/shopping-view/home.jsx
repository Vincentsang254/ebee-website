import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Import ShadCN Skeleton component
import { fetchProducts } from '@/features/slices/productSlice';
import { addProductToCart } from '@/features/slices/cartSlice';

// Skeleton loader for product cards using ShadCN
const ProductSkeleton = () => (
  <Card className="bg-white shadow-lg rounded-lg">
    <CardHeader className="p-0">
      <Skeleton className="w-full h-48 rounded-t-lg" />
    </CardHeader>
    <CardContent className="p-4">
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-8 w-1/3" />
    </CardContent>
    <CardFooter className="p-4">
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);




const ShoppingHome = () => {
  const dispatch = useDispatch();
  const { list: products, status } = useSelector((state) => state.products);

  console.table("products", products);

  // State for the search query
  const [query, setQuery] = useState('');

  // Filter products based on the query
  const filteredProducts = products?.filter((product) =>
    product?.name.toLowerCase().includes(query.toLowerCase()) ||
    product?.desc.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);
   // Function to add product to cart
 const handleAddProductToCart = (product) => {
  dispatch(addProductToCart(product));
};

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Product List</h1>

      {/* Search Input */}
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-1/2 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Display ShadCN skeletons when loading */}
      {status === 'pending' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      )}

      {status === 'rejected' && <p>Failed to load products.</p>}
      {status === 'success' && filteredProducts.length === 0 && <p>No products found.</p>}

      {status === 'success' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product?.id} className="bg-white shadow-lg rounded-lg">
              <CardHeader className="p-0">
                <img
                  src={product?.imageUrl || '/placeholder.jpg'}
                  alt={product?.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold">{product?.name}</CardTitle>
                <CardDescription className="text-gray-500 mb-2">{product?.desc}</CardDescription>
                <p className="text-xl font-bold text-gray-900">${product?.price}</p>
              </CardContent>
              <CardFooter className="p-4">
                <Button className="w-full bg-blue-500 text-white hover:bg-blue-600" onClick={() => handleAddProductToCart(product)}>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShoppingHome;
