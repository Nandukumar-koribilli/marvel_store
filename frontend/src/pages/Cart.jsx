import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { removeFromCart as removeFromCartApi, updateCartItem as updateCartItemApi } from '../services/api';
import { toast } from 'react-toastify';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  const { isAuthenticated, cart, updateCart } = useAuth();
  const { localCart, removeFromLocalCart, updateLocalCartItem, getCartTotal, clearLocalCart } = useCart();

  const [loading, setLoading] = useState(false);

  const cartItems = isAuthenticated ? cart : localCart;

  const handleRemoveItem = async (itemId) => {
    setLoading(true);
    try {
      if (isAuthenticated) {
        const { data } = await removeFromCartApi(itemId);
        updateCart(data);
      } else {
        removeFromLocalCart(itemId);
      }
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    setLoading(true);
    try {
      if (isAuthenticated) {
        const { data } = await updateCartItemApi(itemId, { quantity: newQuantity });
        updateCart(data);
      } else {
        updateLocalCartItem(itemId, newQuantity);
      }
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setLoading(false);
    }
  };

  const calculateSubtotal = () => {
    if (isAuthenticated) {
      return cart.reduce((total, item) => {
        const price = item.product?.price || 0;
        return total + (price * item.quantity);
      }, 0);
    }
    return getCartTotal();
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.info('Please login to checkout');
      navigate('/login?redirect=checkout');
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty">
        <div className="container">
          <motion.div 
            className="empty-cart"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="empty-icon">
              <FiShoppingBag />
            </div>
            <h2>Your Cart is Empty</h2>
            <p>Looks like you haven't added any Marvel gear yet!</p>
            <Link to="/products" className="btn btn-primary btn-lg">
              Start Shopping <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <motion.h1 
          className="page-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Shopping Cart
        </motion.h1>

        <div className="cart-layout">
          {/* Cart Items */}
          <motion.div 
            className="cart-items"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="cart-header">
              <span>Product</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
              <span></span>
            </div>

            {cartItems.map((item, index) => {
              const product = item.product;
              if (!product) return null;

              return (
                <motion.div 
                  key={item._id}
                  className="cart-item"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="item-product">
                    <Link to={`/product/${product._id}`} className="item-image">
                      <img 
                        src={product.images?.[0]?.url || `https://via.placeholder.com/100x100/1a1a24/e23636?text=${encodeURIComponent(product.name)}`}
                        alt={product.name}
                      />
                    </Link>
                    <div className="item-details">
                      <Link to={`/product/${product._id}`} className="item-name">
                        {product.name}
                      </Link>
                      {item.size && <span className="item-variant">Size: {item.size}</span>}
                      {item.color && <span className="item-variant">Color: {item.color}</span>}
                    </div>
                  </div>

                  <div className="item-price">
                    ${product.price?.toFixed(2)}
                  </div>

                  <div className="item-quantity">
                    <button 
                      onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1 || loading}
                    >
                      <FiMinus />
                    </button>
                    <span>{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                      disabled={loading}
                    >
                      <FiPlus />
                    </button>
                  </div>

                  <div className="item-total">
                    ${(product.price * item.quantity).toFixed(2)}
                  </div>

                  <button 
                    className="item-remove"
                    onClick={() => handleRemoveItem(item._id)}
                    disabled={loading}
                  >
                    <FiTrash2 />
                  </button>
                </motion.div>
              );
            })}

            <div className="cart-actions">
              <Link to="/products" className="btn btn-ghost">
                Continue Shopping
              </Link>
            </div>
          </motion.div>

          {/* Order Summary */}
          <motion.div 
            className="cart-summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h3>Order Summary</h3>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal ({cartItems.length} items)</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {shipping > 0 && (
              <div className="free-shipping-notice">
                Add ${(50 - subtotal).toFixed(2)} more for FREE shipping!
              </div>
            )}

            <button 
              className="btn btn-primary btn-lg checkout-btn"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>

            <div className="secure-checkout">
              <span>🔒 Secure Checkout</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
