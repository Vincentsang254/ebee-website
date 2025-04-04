import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { MdEdit, MdDelete, MdClose } from "react-icons/md"; // Import edit, delete, and close icons
import { Skeleton } from "@/components/ui/skeleton"; // Import Shadcn Skeleton

import { createProduct, fetchProducts, removeProduct, updateProduct } from '@/features/slices/productSlice';

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { list: products, status } = useSelector((state) => state.products);
  const totalProducts = products.length;
  const { id} = useSelector((state) => state.auth);// u

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Track if editing an existing product
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [productImage, setProductImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setProductImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setProductName('');
    setProductPrice('');
    setProductDesc('');
    setProductImage(null);
    setImagePreview(null);
    setEditingProduct(null);
  };

  const handleCloseDialog = () => {
    resetForm(); // 🔹 Clear form when closing
    setDialogOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', productPrice);
    formData.append('desc', productDesc);
    formData.append('userId', id); // Include user ID
  
    if (productImage) {
      formData.append('my_file', productImage); // Only append if a new image is selected
    }
  
    try {
      if (editingProduct) {
        await dispatch(updateProduct({ productId: editingProduct.id, values: formData })).unwrap();
       
      } else {
        const res = await dispatch(createProduct(formData)).unwrap();
console.log("Product created:", res);
        // if (res.status) {
        //   alert("Product created successfully");
        // }
      
      }
      dispatch(fetchProducts()); // ✅ Always fetch latest products
      setDialogOpen(false); // Close dialog after successful submission
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error.message);
    }
  };
  
  

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductPrice(product.price);
    setProductDesc(product.desc);
    setImagePreview(product.imageUrl);
    setDialogOpen(true);
  };

  const handleDeleteProduct = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      dispatch(removeProduct(id));
    }
  };
 

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (status === "pending") {
    return (
      <div className="container px-4 py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-semibold text-center">Our Products</h1>
        
        {/* Shadcn Skeleton Loader */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {[...Array(totalProducts)].map((_, index) => (
            <Skeleton key={index} className="w-full rounded-lg h-72" />
          ))}
        </div>
      </div>
    );
  }

  if (status === "rejected") {
    return <div className="flex items-center justify-center min-h-screen">Failed to load products</div>;
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-8 text-3xl font-semibold text-center">Our Products</h1>

      <Button
        variant="secondary"
        className="mb-4"
        onClick={() => {
          setDialogOpen(true);
          resetForm();
        }}
      >
        Add Product
      </Button>

      {/* Dialog for Add/Edit Product */}
      <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
        <DialogContent className="p-6 overflow-y-auto w-96">
          <DialogHeader className="flex items-center justify-between">
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add a New Product'}</DialogTitle>
            <MdClose
              className="text-gray-600 cursor-pointer"
              onClick={() => setDialogOpen(false)}
            />
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium">Product Name</label>
                <input
                  type="text"
                  className="block w-full mt-1 border rounded-md"
                  placeholder="Product Name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  className="block w-full mt-1 border rounded-md"
                  placeholder="Product Price"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
              </div>

           

              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  className="block w-full mt-1 border rounded-md"
                  placeholder="Product Description"
                  value={productDesc}
                  onChange={(e) => setProductDesc(e.target.value)}
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium">Product Image</label>
                <input
                  type="file"
                  className="block w-full mt-1 border rounded-md"
                  onChange={handleImageChange}
                />
                {imagePreview && (
                  <div className="mt-4">
                    <img
                      src={imagePreview}
                      alt="Image Preview"
                      className="object-cover w-32 h-32 mx-auto rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>
            <DialogFooter className="flex justify-end mt-6">
              <Button type="submit" variant="primary">
                {editingProduct ? 'Update Product' : 'Save Product'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
  {products?.map((product) => (
    <Card key={product.id} className="relative rounded-lg shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold">{product.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="object-cover w-full h-40 mb-4 rounded-md"
        />
        <p className="text-gray-600">Price: Ksh {product.price}</p>
        <p className="text-gray-600">Description: {product.desc}</p>
      </CardContent>
      {/* Edit and Delete Icons */}
      <div className="absolute flex space-x-2 top-2 right-2">
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