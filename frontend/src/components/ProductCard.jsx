import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiStar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { addToCart as addToCartApi, addToWishlist as addToWishlistApi } from '../services/api';
import { toast } from 'react-toastify';
import './ProductCard.css';

const ProductCard = ({ product, index = 0 }) => {
  const { isAuthenticated, updateCart, updateWishlist, wishlist } = useAuth();
  const { addToLocalCart } = useCart();

  const isInWishlist = wishlist?.some(item => item._id === product._id);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (isAuthenticated) {
        const { data } = await addToCartApi({ 
          productId: product._id, 
          quantity: 1,
          size: product.sizes?.[0] || null,
          color: product.colors?.[0]?.name || null,
        });
        updateCart(data);
      } else {
        addToLocalCart(product, 1);
      }
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info('Please login to add to wishlist');
      return;
    }

    try {
      const { data } = await addToWishlistApi({ productId: product._id });
      updateWishlist(data);
      toast.success('Added to wishlist!');
    } catch (error) {
      toast.error('Failed to add to wishlist');
    }
  };

  const discount = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Fallback image
  const imageUrl = product.images?.[0]?.url || `https://via.placeholder.com/400x400/1a1a24/e23636?text=${encodeURIComponent(product.name)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <Link to={`/product/${product._id}`} className="product-card">
        <div className="product-image-container">
          <img 
            src={imageUrl} 
            alt={product.name}
            className="product-image"
            loading="lazy"
          />
          <div className="product-overlay">
            <button 
              className="overlay-btn add-to-cart-btn"
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              <FiShoppingBag /> Add to Cart
            </button>
          </div>
          
          {/* Labels */}
          <div className="product-labels">
            {discount > 0 && (
              <span className="label label-sale">-{discount}%</span>
            )}
            {product.featured && (
              <span className="label label-featured">Featured</span>
            )}
          </div>

          {/* Wishlist Button */}
          <button 
            className={`wishlist-btn ${isInWishlist ? 'active' : ''}`}
            onClick={handleAddToWishlist}
            aria-label="Add to wishlist"
          >
            <FiHeart />
          </button>
        </div>

        <div className="product-info">
          <span className="product-category">{product.category}</span>
          <h3 className="product-name">{product.name}</h3>
          
          <div className="product-rating">
            <FiStar className="star-icon filled" />
            <span>{product.rating?.toFixed(1) || '0.0'}</span>
            <span className="review-count">({product.numReviews || 0})</span>
          </div>

          <div className="product-price">
            <span className="current-price">${product.price?.toFixed(2)}</span>
            {product.originalPrice && (
              <span className="original-price">${product.originalPrice?.toFixed(2)}</span>
            )}
          </div>

          {/* Character Badge */}
          {product.character && product.character !== 'all' && (
            <span className={`character-badge ${product.character}`}>
              {product.character.replace('-', ' ')}
            </span>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
