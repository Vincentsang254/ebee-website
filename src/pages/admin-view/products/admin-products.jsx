import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MdEdit, MdDelete } from "react-icons/md"; // Import edit and delete icons

import { createProduct, fetchProducts, deleteProduct } from '@/features/slices/productSlice'; // Add deleteProduct action if available

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { list: products, status } = useSelector((state) => state.products);

  const [isSheetOpen, setSheetOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!productName || !productDesc || !productPrice || !productCategory || !productImage) {
      alert('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', productPrice);
    formData.append('desc', productDesc);
    formData.append('category', productCategory);
    formData.append('imageUrl', productImage);

    dispatch(createProduct(formData));
    setSheetOpen(false);
  };

  const handleEditProduct = (product) => {
    // Populate the form with product data for editing
    setProductName(product.name);
    setProductPrice(product.price);
    setProductDesc(product.desc);
    setProductCategory(product.category);
    setImagePreview(product.imageUrl);
    setSheetOpen(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(deleteProduct(id));
    }
  };

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

      <Button
        variant="primary"
        className="mb-4"
        onClick={() => setSheetOpen(true)}
      >
        Add Product
      </Button>

      <Sheet open={isSheetOpen} onClose={() => setSheetOpen(false)}>
        <SheetContent side="left" className="w-96 p-6 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{productName ? 'Edit Product' : 'Add a New Product'}</SheetTitle>
          </SheetHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium">Product Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-md"
                  placeholder="Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  className="mt-1 block w-full border rounded-md"
                  placeholder="Product Price"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Category</label>
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-md"
                  placeholder="Product Category"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  className="mt-1 block w-full border rounded-md"
                  placeholder="Product Description"
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium">Product Image</label>
                <input
                  type="file"
                  className="mt-1 block w-full border rounded-md"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      className="w-32 h-32 object-cover rounded-md mx-auto"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" variant="primary">
                  {productName ? 'Update Product' : 'Save Product'}
                </Button>
              </div>
            </div>
          </form>
        </SheetContent>
      </Sheet>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product) => (
          <Card key={product.id} className="shadow-lg rounded-lg relative">
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
            {/* Edit and Delete Icons */}
            <div className="absolute top-2 right-2 flex space-x-2">
              <MdEdit
                className="text-blue-600 cursor-pointer"
                onClick={() => handleEditProduct(product)}
              />
              <MdDelete
                className="text-red-600 cursor-pointer"
                onClick={() => handleDeleteProduct(product.id)}
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminProducts;
