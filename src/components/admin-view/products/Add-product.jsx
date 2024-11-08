import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { fetchProducts, createProduct, removeProduct, updateProduct } from "@/features/slices/productSlice";
import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  name: "",
  desc: "",
  price: "",
  category: "",
};

function AdminAddProducts() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const list = useSelector((state) => state.products);
  const dispatch = useDispatch();
  const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();

    const productAction = currentEditedId !== null 
      ? dispatch(updateProduct({ id: currentEditedId, formData: { ...formData, image: uploadedImageUrl }}))
      : dispatch(createProduct({ ...formData, image: uploadedImageUrl }));

    productAction.then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchProducts());
        setOpenCreateProductsDialog(false);
        setImageFile(null);
        setUploadedImageUrl("");
        setFormData(initialFormData);
        toast({
          title: currentEditedId !== null ? "Product updated successfully" : "Product added successfully",
        });
      }
    });
  }

  function handleDelete(getCurrentProductId) {
    dispatch(removeProduct(getCurrentProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchProducts());
        toast({
          title: "Product deleted successfully",
        });
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData).every((key) => formData[key] !== "") && uploadedImageUrl;
  }

  function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setImageLoadingState(true);

      // Simulating an image upload
      const simulatedUpload = new Promise((resolve) => {
        setTimeout(() => {
          resolve(URL.createObjectURL(file)); // Simulating the URL returned after upload
        }, 1000);
      });

      simulatedUpload.then(url => {
        setUploadedImageUrl(url);
        setImageLoadingState(false);
        toast({
          title: "Image uploaded successfully",
        });
      }).catch(() => {
        setImageLoadingState(false);
        toast({
          title: "Image upload failed",
          variant: "destructive",
        });
      });
    }
  }

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {list && list.length > 0
          ? list.map((productItem) => (
              <AdminProductTile
                key={productItem.id}
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
          setUploadedImageUrl(""); // Reset uploaded image URL
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          
          <div className="py-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="mb-4 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
            {imageLoadingState && <p>Uploading image...</p>}
            {uploadedImageUrl && <img src={uploadedImageUrl} alt="Uploaded" className="mt-2 w-32 h-32 object-cover" />}
            
            <form onSubmit={onSubmit}>
              {Object.keys(formData).map((key) => (
                <div key={key} className="mb-4">
                  <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                    {key.charAt(0).toUpperCase() + key.slice(1)} {/* Capitalize the first letter */}
                  </label>
                  <input
                    id={key}
                    type={key === 'price' ? 'number' : 'text'}
                    value={formData[key]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              ))}
              <Button type='submit' disabled={!isFormValid()} className="mt-4">
                {currentEditedId !== null ? "Edit" : "Add"}
              </Button>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminAddProducts;
