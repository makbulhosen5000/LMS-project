import React, { useContext, useState } from "react";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CartContext } from "../../components/provider/CartProvider";
import { ShoppingCart, CreditCard, Truck } from "lucide-react";

export default function Cart() {
  const [qty, setQty] = useState({});
  const {
    shipping,
    subTotal,
    grandTotal,
    cartData,
    updateCartItem,
    handleCartItemDelete,
  } = useContext(CartContext);

  // Handle quantity change
  const handleQtyChange = (itemId, newQty) => {
    if (newQty < 1) return; // prevent negative or zero
    setQty((prevQty) => ({
      ...prevQty,
      [itemId]: newQty,
    }));
    updateCartItem(itemId, newQty);
  };

  return (
    <>
      <Helmet>
        <title>MAKFashion || Cart</title>
      </Helmet>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-8 my-10">
        {/* 🛍 Left Side: Cart Items */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-6">
            <ShoppingCart className="w-5 h-5 text-green-600" />
            Your Shopping Cart
          </h2>

          {cartData.length > 0 ? (
            <div className="space-y-6">
              {cartData.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-5"
                >
                  {/* Product Info */}
                  <div className="flex items-center gap-5">
                    <img
                      src={item.image_url}
                      alt={item.title}
                      className="w-20 h-20 rounded-lg border"
                    />
                    <div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      {item.size && (
                        <p className="text-sm text-gray-500">Size: {item.size}</p>
                      )}
                    </div>
                  </div>

                  {/* Quantity + Price + Delete */}
                  <div className="flex items-center gap-6">
                    {/* Quantity Control */}
                    <div className="flex items-center border rounded-lg">
                      <button
                        className="px-3 py-1 text-gray-600 hover:text-black"
                        onClick={() =>
                          handleQtyChange(item.id, (qty[item.id] || item.qty) - 1)
                        }
                      >
                        -
                      </button>
                      <input
                        type="number"
                        value={qty[item.id] || item.qty}
                        onChange={(e) =>
                          handleQtyChange(
                            item.id,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-12 text-center border-0 focus:outline-none"
                      />
                      <button
                        className="px-3 py-1 text-gray-600 hover:text-black"
                        onClick={() =>
                          handleQtyChange(item.id, (qty[item.id] || item.qty) + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <p className="text-lg font-medium text-green-700">
                      ${(item.price * item.qty).toFixed(2)}
                    </p>

                    {/* Delete */}
                    <button
                      onClick={() => handleCartItemDelete(item.id)}
                      title="Delete"
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaRegTrashCan size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-gray-500 font-semibold">
                Your cart is empty.
              </p>
              <Link to="/shop">
                <button className="mt-4 bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 transition">
                  Continue Shopping
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Right Side: Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
        {cartData.length > 0 ? (
          <>
            <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800 mb-6">
              <CreditCard className="w-5 h-5 text-green-600" />
              Order Summary
            </h2>

            <div className="space-y-3 text-lg font-semibold">
              <div className="flex justify-between">
                <span className="flex items-center gap-2 text-gray-600">
                  <Truck className="w-4 h-4 text-gray-500" />
                  Shipping:
                </span>
                <span>${shipping}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sub Total:</span>
                <span>${subTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-green-700 border-t pt-3">
                <span>Total:</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex flex-col gap-4">
              <Link to="/shop">
                <button className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition">
                  Continue Shopping
                </button>
              </Link>
              <Link to={`/checkout`}>
                <button className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition">
                  Proceed to Checkout
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center text-gray-500 text-lg font-medium py-10">
            Your cart is empty
          </div>
       )}
</div>

      </div>
    </>
  );
}
