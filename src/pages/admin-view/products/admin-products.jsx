import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchProducts } from '@/features/slices/productSlice';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"; // Import ShadCN components
import { createProduct } from '@/features/slices/productSlice'; // Import the createProduct action

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { list: products, status } = useSelector((state) => state.products);

  const [isSheetOpen, setSheetOpen] = useState(false); // State to manage sheet visibility
  const [productName, setProductName] = useState(''); // State for product name
  const [productPrice, setProductPrice] = useState(''); // State for product price
  const [productDesc, setProductDesc] = useState(''); // State for product description
  const [productCategory, setProductCategory] = useState(''); // State for category
  const [productImage, setProductImage] = useState(null); // State for image
  const [imagePreview, setImagePreview] = useState(null); // State for image preview

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
    setImagePreview(URL.createObjectURL(file)); // Preview image before uploading
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', productPrice);
    formData.append('description', productDesc);
    formData.append('category', productCategory);
    formData.append('image', productImage); // Add image to form data

    dispatch(createProduct(formData)); // Dispatch the action to create the product
    setSheetOpen(false); // Close the sheet after submitting
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

      {/* Button to open the Sheet */}
      <Button
        variant="primary"
        className="mb-4"
        onClick={() => setSheetOpen(true)} // Open the sheet on click
      >
        Add Product
      </Button>

      {/* ShadCN Sheet Component */}
      <Sheet open={isSheetOpen} onClose={() => setSheetOpen(false)}>
        <SheetContent side="left" className="w-96 p-6 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add a New Product</SheetTitle>
          </SheetHeader>
          {/* Form for adding a product */}
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Product Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input
                  type="number"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Product Price"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Product Category"
                  value={productCategory}
                  onChange={(e) => setProductCategory(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Product Description"
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Product Image</label>
                <input
                  type="file"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
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
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!productName || !productPrice || !productDesc || !productCategory || !productImage}
                >
                  Save Product
                </Button>
              </div>
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
