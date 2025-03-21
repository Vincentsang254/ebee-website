import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const PaymentPage = () => {
  const cartItems = useSelector((state) => state.cart.list || []);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePayment = () => {
    alert(`Payment successful with ${paymentMethod}!`);
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <Card>
        <CardContent className="p-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          {cartItems.length ? (
            cartItems.map((item) => (
              <div key={item.id} className="flex justify-between my-2">
                <span>{item.name} x{item.quantity}</span>
                <span>Ksh {item.price * item.quantity}</span>
              </div>
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}
          <Separator className="my-2" />
          <h3 className="text-lg font-semibold">Total: Ksh {totalAmount.toFixed(2)}</h3>
        </CardContent>
      </Card>
      <div className="mt-4">
        <h2 className="text-xl font-semibold">Payment Method</h2>
        <div className="space-y-2 mt-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="mpesa"
              checked={paymentMethod === "mpesa"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            M-Pesa
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Credit/Debit Card
          </label>
        </div>
      </div>
      <Button className="w-full mt-4 bg-green-500" onClick={handlePayment}>
        Pay Now
      </Button>
    </div>
  );
};

export default PaymentPage;
