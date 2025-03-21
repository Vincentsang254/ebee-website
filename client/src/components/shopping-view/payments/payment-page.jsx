import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "react-toastify";

const PaymentPage = () => {
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart?.list || []);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [loading, setLoading] = useState(false);

  // Calculate total price
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.product.price,
    0
  );

  const handlePayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success("Payment successful!", { position: "top-center" });
      navigate("/shop/home");
    }, 2000);
  };

  return (
    <div className="p-8 min-h-screen bg-gray-100 flex flex-col items-center">
      <Card className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between py-2 border-b">
                <span>{item.product.name} (x{item.quantity})</span>
                <span>KSH {item.quantity * item.product.price}</span>
              </li>
            ))}
          </ul>
          <h3 className="text-xl font-bold mt-4">Total: KSH {totalPrice.toFixed(2)}</h3>

          <h2 className="text-lg font-semibold mt-6">Select Payment Method</h2>
          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value="mpesa" /> M-Pesa
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <RadioGroupItem value="card" /> Credit/Debit Card
            </label>
          </RadioGroup>

          <Button className="mt-6 w-full bg-blue-500 text-white" onClick={handlePayment} disabled={loading}>
            {loading ? "Processing..." : "Pay Now"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentPage;
