import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, removeProductFromCart } from '@/features/slices/cartSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CartPage = () => {
  const dispatch = useDispatch();
  const { items: cartItems, status } = useSelector((state) => state.cart);
  const { id: userId } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  const handleRemoveFromCart = (productId) => {
    dispatch(removeProductFromCart({ userId, productId }));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Shopping Cart</h1>
      {status === 'pending' && <p>Loading cart...</p>}
      {status === 'rejected' && <p>Failed to load cart.</p>}
      {status === 'success' && cartItems.length === 0 && <p>Your cart is empty.</p>}

      {status === 'success' && cartItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cartItems.map((item) => (
            <Card key={item.productId} className="bg-white shadow-lg rounded-lg">
              <CardHeader className="p-0">
                <img
                  src={item.imageUrl || '/placeholder.jpg'}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              </CardHeader>
              <CardContent className="p-4">
                <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
                <CardDescription className="text-gray-500 mb-2">{item.desc}</CardDescription>
                <p className="text-xl font-bold text-gray-900">${item.totalPrice.toFixed(2)}</p>
                <p className="text-gray-700">Quantity: {item.quantity}</p>
              </CardContent>
              <CardFooter className="p-4 flex justify-between">
                <Button className="bg-red-500 text-white hover:bg-red-600" onClick={() => handleRemoveFromCart(item.productId)}>
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