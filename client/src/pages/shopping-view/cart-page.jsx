import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCart, removeProductFromCart } from "@/features/slices/cartSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const CartPage = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.carts.list);
const {status} = useSelector((state) => state.carts);
  // Fetch cart items on page load
  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  // Handle remove item from cart
  const handleRemoveItem = (cartId) => {
    dispatch(removeProductFromCart(cartId));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Your Cart</h1>

      {/* Loading state */}
      {status === "pending" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, index) => (
            <Card key={index} className="bg-white shadow-lg rounded-lg">
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
          ))}
        </div>
      )}

      {/* Error state */}
      {status === "rejected" && <p className="text-center text-red-500">Failed to load cart items.</p>}

      {/* Empty cart */}
      {status === "success" && cartItems.length === 0 && (
        <p className="text-center text-gray-600">Your cart is empty.</p>
      )}

      {/* Display cart items */}
      {status === "success" && cartItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cartItems.map((item) => (
            <Card key={item.id} className="bg-white shadow-lg rounded-lg">
              <CardHeader className="p-0">
                <img
                  src={item.imageUrl || "/placeholder.jpg"}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
                <CardDescription className="text-gray-500 mb-2">{item.desc}</CardDescription>
                <p className="text-xl font-bold text-gray-900">${item.price}</p>
                <p className="text-gray-600">Quantity: {item.quantity}</p>
              </CardContent>
              <CardFooter className="p-4">
                <Button
                  className="w-full bg-red-500 text-white hover:bg-red-600"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
