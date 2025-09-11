import React, { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { CreditCard, MapPin, ShoppingBag } from "lucide-react";
import { toast } from "react-toastify";
import { apiUrl, userToken } from "../../../Http";
import { CartContext } from "../../../provider/CartProvider";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

export default function StripePaymentForm() {
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const { cartData, shipping, subTotal, grandTotal, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const handlePaymentMethod = (e) => setPaymentMethod(e.target.value);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${apiUrl}/get-user-profile-details`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userToken()}`,
          },
        });
        const result = await res.json();
        reset({
          name: result.data.name || "",
          phone: result.data.phone || "",
          email: result.data.email || "",
          address: result.data.address || "",
          state: result.data.state || "",
          city: result.data.city || "",
          zip: result.data.zip || "",
        });
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, [reset]);

  const processOrder = async (data) => {
    if (paymentMethod === "cash_on_delivery") {
      await saveOrder(data, "not paid");
      return;
    }

    if (!stripe || !elements) {
      toast.error("Stripe is not ready. Please try again later.");
      return;
    }

    try {
      setLoading(true);

      // Create payment intent
      const res = await fetch(`${apiUrl}/create-payment-intent`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken()}`,
        },
        body: JSON.stringify({ amount: grandTotal * 100 }),
      });

      const result = await res.json();
      const clientSecret = result.clientSecret;

      if (!clientSecret) {
        toast.error("Unable to process payment. Please try again.");
        setLoading(false);
        return;
      }

      const cardElement = elements.getElement(CardElement);
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: data.name,
            email: data.email,
            address: {
              line1: data.address,
              city: data.city,
              state: data.state,
              postal_code: data.zip || "0000",
            },
          },
        },
      });

      if (paymentResult.error) {
        toast.error(`Payment failed: ${paymentResult.error.message}`);
      } else if (paymentResult.paymentIntent.status === "succeeded") {
        toast.success("Payment successful!");
        await saveOrder(data, "paid");
      }
    } catch (err) {
      console.error("Payment error:", err);
      toast.error("Something went wrong during payment.");
    } finally {
      setLoading(false);
    }
  };

  const saveOrder = async (formData, paymentStatus) => {
    const newFormData = {
      ...formData,
      shipping: shipping || 0,
      sub_total: subTotal || 0,
      grand_total: grandTotal || 0,
      discount: 0,
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      status: "pending",
      cart: cartData || [],
    };

    try {
      const res = await fetch(`${apiUrl}/order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${userToken()}`,
        },
        body: JSON.stringify(newFormData),
      });

      const result = await res.json();
      if (result.status === 200) {
        toast.success(result.message);
        clearCart();
        navigate(`/order-confirmation/${result.id}`);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Error saving order:", err);
    }
  };

  return (
    <>
      <Helmet><title>MAKFashion || Checkout</title></Helmet>
      <form onSubmit={handleSubmit(processOrder)} className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 my-10">

        {/* Billing & Payment */}
        <div className="space-y-6">
          {/* Billing */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
              <MapPin className="w-5 h-5 text-green-600"/> Billing Address
            </h2>

            <div className="flex justify-between gap-2 mb-4">
              <div>
                <label>Name</label>
                <input {...register("name", { required: true })} className="mt-1 w-full border rounded-lg px-3 py-2"/>
                {errors.name && <span className="text-red-500 text-sm">Required</span>}
              </div>
              <div>
                <label>Phone</label>
                <input {...register("phone", { required: true })} className="mt-1 w-full border rounded-lg px-3 py-2"/>
                {errors.phone && <span className="text-red-500 text-sm">Required</span>}
              </div>
            </div>

            <div className="flex justify-between gap-2 mb-4">
              <div>
                <label>Email</label>
                <input {...register("email", { required: true })} className="mt-1 w-full border rounded-lg px-3 py-2"/>
                {errors.email && <span className="text-red-500 text-sm">Required</span>}
              </div>
              <div>
                <label>City</label>
                <input {...register("city", { required: true })} className="mt-1 w-full border rounded-lg px-3 py-2"/>
                {errors.city && <span className="text-red-500 text-sm">Required</span>}
              </div>
            </div>

            <div className="flex justify-between gap-2 mb-4">
              <div>
                <label>State</label>
                <input {...register("state")} className="mt-1 w-full border rounded-lg px-3 py-2"/>
              </div>
              <div>
                <label>Zip</label>
                <input 
                  {...register("zip", { required: "Postal code is required", minLength: { value: 4, message: "Enter at least 4 digits" } })} 
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                />
                {errors.zip && <span className="text-red-500 text-sm">{errors.zip.message}</span>}
              </div>
            </div>

            <div>
              <label>Address</label>
              <textarea {...register("address", { required: true })} rows="3" className="mt-1 w-full border rounded-lg px-3 py-2"/>
              {errors.address && <span className="text-red-500 text-sm">Required</span>}
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold mb-4">
              <CreditCard className="w-5 h-5 text-green-600"/> Payment Methods
            </h2>
            <div className="flex gap-3">
              {["cash_on_delivery","stripe"].map((method) => (
                <label key={method} className="flex items-center gap-2 p-2 border rounded-lg cursor-pointer">
                  <input type="radio" value={method} checked={paymentMethod===method} onChange={handlePaymentMethod}/>
                  <span className="capitalize">{method.replace("_"," ")}</span>
                </label>
              ))}
            </div>
            {paymentMethod==="stripe" && <div className="border p-3 mt-3"><CardElement/></div>}
          </div>
        </div>

        {/* Cart Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold mb-6">
            <ShoppingBag className="w-5 h-5 text-green-600"/> Cart Summary
          </h2>

          {cartData.length > 0 ? (
            <>
              {cartData.map(item=>(
                <div key={item.id} className="flex justify-between items-center mb-5 border-b pb-5">
                  <div className="flex items-center gap-4">
                    <img src={item.image_url} alt={item.title} className="w-20 h-20 rounded-lg border"/>
                    <div>
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-gray-500">Qty: {item.qty} {item.size && `| Size: ${item.size}`}</p>
                    </div>
                  </div>
                  <p className="font-medium text-green-700">${(item.price*item.qty).toFixed(2)}</p>
                </div>
              ))}

              <div className="space-y-2 font-semibold text-lg">
                <div className="flex justify-between"><span>Shipping:</span><span>${shipping}</span></div>
                <div className="flex justify-between"><span>Sub Total:</span><span>${subTotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-green-700"><span>Total:</span><span>${grandTotal.toFixed(2)}</span></div>
              </div>

              <button type="submit" disabled={loading} className="mt-6 w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700">
                {loading ? "Processing..." : "Pay Now"}
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-500 font-semibold">Your cart is empty.</p>
              <Link to="/shop"><button className="mt-4 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700">Continue Shopping</button></Link>
            </div>
          )}
        </div>
      </form>
    </>
  );
}
