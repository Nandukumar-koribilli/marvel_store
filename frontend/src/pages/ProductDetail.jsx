import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiShoppingCart, FiHeart, FiMinus, FiPlus, FiStar, 
  FiTruck, FiShield, FiRefreshCw, FiShare2
} from 'react-icons/fi';
import { getProduct, addToCart as addToCartApi, addToWishlist as addToWishlistApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, updateCart, updateWishlist, wishlist } = useAuth();
  const { addToLocalCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const isInWishlist = wishlist?.some(item => item._id === product?._id);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data } = await getProduct(id);
        setProduct(data);
        if (data.sizes?.length > 0) setSelectedSize(data.sizes[0]);
        if (data.colors?.length > 0) setSelectedColor(data.colors[0].name);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Product not found');
        navigate('/products');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.warning('Please select a size');
      return;
    }

    try {
      if (isAuthenticated) {
        const { data } = await addToCartApi({
          productId: product._id,
          quantity,
          size: selectedSize,
          color: selectedColor,
        });
        updateCart(data);
      } else {
        addToLocalCart(product, quantity, selectedSize, selectedColor);
      }
      toast.success(`${product.name} added to cart!`);
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add to wishlist');
      navigate('/login');
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

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  if (loading) {
    return (
      <div className="product-detail-page loading">
        <div className="container">
          <div className="product-detail-grid">
            <div className="skeleton" style={{ height: '600px' }} />
            <div className="product-info-skeleton">
              <div className="skeleton" style={{ height: '40px', width: '80%' }} />
              <div className="skeleton" style={{ height: '30px', width: '40%', marginTop: '1rem' }} />
              <div className="skeleton" style={{ height: '100px', marginTop: '2rem' }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="product-detail-page">
      <div className="container">
        <motion.div 
          className="product-detail-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {/* Image Gallery */}
          <div className="product-gallery">
            <motion.div 
              className="main-image"
              key={selectedImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <img 
                src={product.images?.[selectedImage]?.url || `https://via.placeholder.com/600x600/1a1a24/e23636?text=${encodeURIComponent(product.name)}`}
                alt={product.name}
              />
              {discount > 0 && (
                <span className="discount-badge">-{discount}%</span>
              )}
            </motion.div>
            
            {product.images?.length > 1 && (
              <div className="thumbnail-list">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${selectedImage === index ? 'active' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={img.url} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="product-info">
            <div className="product-meta">
              <span className="product-category">{product.category}</span>
              {product.character && product.character !== 'all' && (
                <span className={`character-tag ${product.character}`}>
                  {product.character.replace('-', ' ')}
                </span>
              )}
            </div>

            <h1 className="product-title">{product.name}</h1>

            <div className="product-rating-row">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FiStar
                    key={i}
                    className={i < Math.floor(product.rating) ? 'filled' : ''}
                  />
                ))}
              </div>
              <span className="rating-value">{product.rating?.toFixed(1)}</span>
              <span className="review-count">({product.numReviews} reviews)</span>
            </div>

            <div className="product-price-row">
              <span className="current-price">${product.price?.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="original-price">${product.originalPrice?.toFixed(2)}</span>
              )}
              {discount > 0 && (
                <span className="save-badge">Save ${(product.originalPrice - product.price).toFixed(2)}</span>
              )}
            </div>

            <p className="product-description">{product.description}</p>

            {/* Size Selection */}
            {product.sizes?.length > 0 && (
              <div className="option-group">
                <label className="option-label">Size</label>
                <div className="size-options">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors?.length > 0 && (
              <div className="option-group">
                <label className="option-label">Color: {selectedColor}</label>
                <div className="color-options">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      className={`color-btn ${selectedColor === color.name ? 'active' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      onClick={() => setSelectedColor(color.name)}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="option-group">
              <label className="option-label">Quantity</label>
              <div className="quantity-selector">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </button>
                <span>{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <FiPlus />
                </button>
              </div>
              <span className="stock-info">
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="btn btn-primary btn-lg add-to-cart"
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
              >
                <FiShoppingCart /> Add to Cart
              </button>
              <button 
                className="btn btn-gold btn-lg buy-now"
                onClick={handleBuyNow}
                disabled={product.stock <= 0}
              >
                Buy Now
              </button>
              <button 
                className={`btn btn-icon wishlist-btn ${isInWishlist ? 'active' : ''}`}
                onClick={handleAddToWishlist}
              >
                <FiHeart />
              </button>
              <button className="btn btn-icon">
                <FiShare2 />
              </button>
            </div>

            {/* Features */}
            <div className="product-features">
              <div className="feature">
                <FiTruck /> Free shipping on orders over $50
              </div>
              <div className="feature">
                <FiShield /> Secure checkout
              </div>
              <div className="feature">
                <FiRefreshCw /> 30-day returns
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button 
              className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button 
              className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button 
              className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              Reviews ({product.numReviews})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'description' && (
              <div className="tab-pane">
                <p>{product.description}</p>
              </div>
            )}
            {activeTab === 'details' && (
              <div className="tab-pane">
                <ul className="details-list">
                  <li><strong>Category:</strong> {product.category}</li>
                  <li><strong>Character:</strong> {product.character}</li>
                  {product.sizes?.length > 0 && (
                    <li><strong>Available Sizes:</strong> {product.sizes.join(', ')}</li>
                  )}
                  {product.colors?.length > 0 && (
                    <li><strong>Colors:</strong> {product.colors.map(c => c.name).join(', ')}</li>
                  )}
                </ul>
              </div>
            )}
            {activeTab === 'reviews' && (
              <div className="tab-pane">
                <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
