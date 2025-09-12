import { createContext, useState, useEffect } from "react";
import { apiUrl, userToken } from "../common/Config";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState([]);
  const [shipping, setShipping] = useState(0); // ✅ default should be 0

  // Load cart from localStorage on first render
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        setCartData(JSON.parse(storedCart));
      }
    } catch (err) {
      console.error("Failed to parse cart data from localStorage:", err);
      localStorage.removeItem("cart"); // reset if broken
    }
  }, []);

  // Add product to cart
  const addToCart = (product, size = null, quantity = 1) => {
    let updatedCart = [...cartData];

    // Check if product exists (consider size if provided)
    const existingItemIndex = updatedCart.findIndex(
      (item) =>
        item.product_id === product.id &&
        (size ? item.size === size : !item.size)
    );

    if (existingItemIndex > -1) {
      // Update quantity if item exists
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        qty: updatedCart[existingItemIndex].qty + quantity,
      };
    } else {
      // Add new item
      updatedCart.push({
        id: `${product.id}-${Date.now()}`, // ✅ unique id
        product_id: product.id,
        size,
        title: product.title,
        price: product.discount_price ?? product.price,
        qty: quantity,
        image_url: product.image_url,
      });
    }

    setCartData(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Calculate subtotal and grand total
  const subTotal = cartData.reduce((sum, item) => sum + item.price * item.qty, 0);
  const grandTotal = subTotal + shipping;

  // Update quantity of an item
  const updateCartItem = (itemId, newQty) => {
    if (newQty <= 0) {
      handleCartItemDelete(itemId);
      return;
    }
    const updatedCart = cartData.map((item) =>
      item.id === itemId ? { ...item, qty: newQty } : item
    );
    setCartData(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Get total quantity of items
  const getQty = () => {
    return cartData.reduce((total, item) => total + parseInt(item.qty, 10), 0);
  };

  // Remove one item
  const handleCartItemDelete = (itemId) => {
    const updatedCart = cartData.filter((item) => item.id !== itemId);
    setCartData(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  // Clear all cart items
  const clearCart = () => {
    setCartData([]);
    localStorage.removeItem("cart");
  };

  // Load shipping charge from backend
  useEffect(() => {
    let isMounted = true;

    const fetchShipping = async () => {
      try {
        const res = await fetch(`${apiUrl}/user-get-shipping`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${userToken()}`,
          },
        });

        const result = await res.json();

        if (isMounted) {
          if (result.status === 200) {
            setShipping(result.data.shipping_charge || 0);
          } else {
            setShipping(0);
            console.warn("Shipping fetch failed:", result.message);
          }
        }
      } catch (err) {
        console.error("Error fetching shipping:", err);
        setShipping(0);
      }
    };

    fetchShipping();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartData,
        shipping,
        subTotal,
        grandTotal,
        addToCart,
        updateCartItem,
        handleCartItemDelete,
        getQty,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
