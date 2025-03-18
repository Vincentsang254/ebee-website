import { StarIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { Dialog, DialogContent } from "../../ui/dialog";
import { Separator } from "../../ui/separator";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useMemo } from "react";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { setProductDetails } from "@/store/shop/products-slice";
import { addReview, getRating } from "@/store/shop/review-slice";
import StarRatingComponent from "../../common/star-rating";
import { toast } from "sonner";

const ProductDetails = ({ open, setOpen, productDetails }) => {
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { id, name } = useSelector((state) => state.auth);
  const ratings = useSelector((state) => state.rating?.list || []);
  const cartItems = useSelector((state) => state.cart?.list || []);

  const averageReview = useMemo(() => {
    return ratings.length
      ? ratings.reduce((sum, item) => sum + item.reviewValue, 0) / ratings.length
      : 0;
  }, [ratings]);

  function handleRatingChange(newRating) {
    setRating(newRating);
  }

  function handleAddToCart(productId, totalStock) {
    const cartItem = cartItems.find((item) => item.productId === productId);
    
    if (cartItem && cartItem.quantity + 1 > totalStock) {
      toast({
        title: `Only ${cartItem.quantity} quantity can be added for this item`,
        variant: "destructive",
      });
      return;
    }

    dispatch(addToCart({ userId: id, productId, quantity: 1 })).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(id));
        toast({ title: "Product is added to cart" });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMsg("");
  }

  async function handleAddReview() {
    if (!reviewMsg.trim()) return;
    setLoading(true);
    try {
      const response = await dispatch(
        addReview({
          productId: productDetails?._id,
          userId: id,
          userName: name,
          reviewValue: rating,
          reviewMessage: reviewMsg,
        })
      ).unwrap();

      if (response.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getRating(productDetails?._id));
        toast({ title: "Review added successfully!" });
      }
    } catch (error) {
      toast({ title: "Failed to add review", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (productDetails) dispatch(getRating(productDetails._id));
  }, [productDetails, dispatch]);

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image || "/placeholder.jpg"}
            alt={productDetails?.title}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
          <p className="text-muted-foreground text-2xl mb-5 mt-4">
            {productDetails?.description}
          </p>
          <div className="flex items-center justify-between">
            <p className={`text-3xl font-bold text-primary ${productDetails?.salePrice > 0 ? "line-through" : ""}`}>
              ${productDetails?.price}
            </p>
            {productDetails?.salePrice > 0 && (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails?.salePrice}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <StarRatingComponent rating={averageReview} />
            <span className="text-muted-foreground">({averageReview.toFixed(2)})</span>
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button disabled className="w-full opacity-60 cursor-not-allowed">Out of Stock</Button>
            ) : (
              <Button className="w-full" onClick={() => handleAddToCart(productDetails._id, productDetails.totalStock)}>
                Add to Cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Ratings</h2>
            <div className="grid gap-6">
              {ratings.length > 0 ? (
                ratings.map((reviewItem) => (
                  <div key={reviewItem.id} className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>{reviewItem?.userName?.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <h3 className="font-bold">{reviewItem?.userName}</h3>
                      <StarRatingComponent rating={reviewItem?.reviewValue} />
                      <p className="text-muted-foreground">{reviewItem.reviewMessage || "No message provided"}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No ratings yet.</p>
              )}
            </div>
            <div className="mt-10 flex flex-col gap-2">
              <Label>Write a review</Label>
              <StarRatingComponent rating={rating} handleRatingChange={handleRatingChange} />
              <Input value={reviewMsg} onChange={(e) => setReviewMsg(e.target.value)} placeholder="Write a review..." />
              <Button onClick={handleAddReview} disabled={!reviewMsg.trim() || loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetails;