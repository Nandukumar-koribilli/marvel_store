import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [localCart, setLocalCart] = useState(() => {
    const saved = localStorage.getItem('guestCart');
    return saved ? JSON.parse(saved) : [];
  });

  const addToLocalCart = (product, quantity = 1, size = null, color = null) => {
    setLocalCart((prev) => {
      const existing = prev.find(
        (item) =>
          item.product._id === product._id &&
          item.size === size &&
          item.color === color
      );

      let newCart;
      if (existing) {
        newCart = prev.map((item) =>
          item.product._id === product._id &&
          item.size === size &&
          item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...prev, { product, quantity, size, color, _id: Date.now().toString() }];
      }

      localStorage.setItem('guestCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromLocalCart = (itemId) => {
    setLocalCart((prev) => {
      const newCart = prev.filter((item) => item._id !== itemId);
      localStorage.setItem('guestCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const updateLocalCartItem = (itemId, quantity) => {
    setLocalCart((prev) => {
      const newCart = prev.map((item) =>
        item._id === itemId ? { ...item, quantity } : item
      );
      localStorage.setItem('guestCart', JSON.stringify(newCart));
      return newCart;
    });
  };

  const clearLocalCart = () => {
    setLocalCart([]);
    localStorage.removeItem('guestCart');
  };

  const getCartTotal = () => {
    return localCart.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const getCartCount = () => {
    return localCart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        localCart,
        addToLocalCart,
        removeFromLocalCart,
        updateLocalCartItem,
        clearLocalCart,
        getCartTotal,
        getCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;
