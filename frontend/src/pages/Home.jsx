import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTruck, FiShield, FiRefreshCw, FiHeadphones } from 'react-icons/fi';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { getFeaturedProducts, getProducts } from '../services/api';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [featured, newest] = await Promise.all([
          getFeaturedProducts(),
          getProducts({ sort: 'newest', limit: 4 })
        ]);
        setFeaturedProducts(featured.data);
        setNewArrivals(newest.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const categories = [
    { name: 'T-Shirts', path: '/products?category=shirts', icon: '👕', color: '#e23636' },
    { name: 'Hoodies', path: '/products?category=hoodies', icon: '🧥', color: '#006bb3' },
    { name: 'Pants', path: '/products?category=pants', icon: '👖', color: '#5cb030' },
    { name: 'Bags', path: '/products?category=bags', icon: '🎒', color: '#ffd700' },
    { name: 'Pens', path: '/products?category=pens', icon: '🖊️', color: '#7b1fa2' },
    { name: 'Collectibles', path: '/products?category=collectibles', icon: '🦸', color: '#ff6b35' },
  ];

  const characters = [
    { name: 'Iron Man', path: '/products?character=iron-man', gradient: 'linear-gradient(135deg, #e23636 0%, #8b0000 100%)' },
    { name: 'Spider-Man', path: '/products?character=spider-man', gradient: 'linear-gradient(135deg, #e62429 0%, #006bb3 100%)' },
    { name: 'Captain America', path: '/products?character=captain-america', gradient: 'linear-gradient(135deg, #005eb8 0%, #1a1a2e 100%)' },
    { name: 'Thor', path: '/products?character=thor', gradient: 'linear-gradient(135deg, #0066b2 0%, #333 100%)' },
    { name: 'Hulk', path: '/products?character=hulk', gradient: 'linear-gradient(135deg, #5cb030 0%, #2d5016 100%)' },
    { name: 'Black Panther', path: '/products?character=black-panther', gradient: 'linear-gradient(135deg, #7b1fa2 0%, #1a1a2e 100%)' },
  ];

  return (
    <div className="home-page">
      <Hero />

      {/* Categories Section */}
      <section className="section categories-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find the perfect Marvel gear for your collection</p>
          </motion.div>

          <div className="categories-grid">
            {categories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={cat.path} className="category-card">
                  <div className="category-icon" style={{ background: `${cat.color}20` }}>
                    <span>{cat.icon}</span>
                  </div>
                  <h3 className="category-name">{cat.name}</h3>
                  <FiArrowRight className="category-arrow" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">⭐ Bestsellers</span>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Our most popular Marvel merchandise loved by fans</p>
          </motion.div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '400px' }} />
              ))}
            </div>
          ) : (
            <div className="products-grid grid grid-4">
              {featuredProducts.slice(0, 8).map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          )}

          <div className="section-cta">
            <Link to="/products?featured=true" className="btn btn-secondary">
              View All Featured <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Characters Section */}
      <section className="section characters-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="section-title">Shop by Character</h2>
            <p className="section-subtitle">Find gear from your favorite Marvel heroes</p>
          </motion.div>

          <div className="characters-grid">
            {characters.map((char, index) => (
              <motion.div
                key={char.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={char.path} className="character-card" style={{ background: char.gradient }}>
                  <div className="character-overlay"></div>
                  <h3 className="character-name">{char.name}</h3>
                  <span className="character-cta">Shop Now <FiArrowRight /></span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="section new-arrivals-section">
        <div className="container">
          <motion.div 
            className="section-header"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="section-badge">🆕 Just In</span>
            <h2 className="section-title">New Arrivals</h2>
            <p className="section-subtitle">Freshly dropped Marvel merchandise</p>
          </motion.div>

          {loading ? (
            <div className="loading-grid">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="skeleton" style={{ height: '400px' }} />
              ))}
            </div>
          ) : (
            <div className="products-grid grid grid-4">
              {newArrivals.map((product, index) => (
                <ProductCard key={product._id} product={product} index={index} />
              ))}
            </div>
          )}

          <div className="section-cta">
            <Link to="/products?sort=newest" className="btn btn-primary">
              View All New Arrivals <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <FiTruck />
              </div>
              <h3>Free Shipping</h3>
              <p>On orders over $50</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FiShield />
              </div>
              <h3>Secure Payment</h3>
              <p>100% protected checkout</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FiRefreshCw />
              </div>
              <h3>Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <FiHeadphones />
              </div>
              <h3>24/7 Support</h3>
              <p>Here to help always</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="container">
          <motion.div 
            className="cta-content"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2>Ready to Become a Hero?</h2>
            <p>Join thousands of Marvel fans and gear up with official merchandise</p>
            <Link to="/products" className="btn btn-gold btn-lg">
              Start Shopping <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
