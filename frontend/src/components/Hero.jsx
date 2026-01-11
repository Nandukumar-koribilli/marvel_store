import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiZap, FiShield, FiStar } from 'react-icons/fi';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      {/* Background Elements */}
      <div className="hero-bg">
        <div className="hero-gradient"></div>
        <div className="hero-pattern"></div>
        <div className="hero-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }} />
          ))}
        </div>
      </div>

      <div className="container hero-container">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="hero-badge">
              <FiZap /> Official Marvel Merchandise
            </span>
          </motion.div>

          <motion.h1 
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Gear Up Like Your
            <span className="text-gradient"> Favorite Heroes</span>
          </motion.h1>

          <motion.p 
            className="hero-description"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover an epic collection of Marvel apparel, accessories, and collectibles. 
            From Iron Man to Spider-Man, find everything you need to unleash your inner superhero.
          </motion.p>

          <motion.div 
            className="hero-buttons"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop Now <FiArrowRight />
            </Link>
            <Link to="/products?featured=true" className="btn btn-secondary btn-lg">
              Featured Items
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div 
            className="hero-stats"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <div className="stat-item">
              <FiShield className="stat-icon" />
              <div>
                <span className="stat-value">500+</span>
                <span className="stat-label">Products</span>
              </div>
            </div>
            <div className="stat-item">
              <FiStar className="stat-icon" />
              <div>
                <span className="stat-value">50K+</span>
                <span className="stat-label">Happy Fans</span>
              </div>
            </div>
            <div className="stat-item">
              <FiZap className="stat-icon" />
              <div>
                <span className="stat-value">24/7</span>
                <span className="stat-label">Support</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hero Image/Cards */}
        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="hero-cards">
            <div className="hero-card card-1">
              <div className="card-image iron-man"></div>
              <span className="card-label">Iron Man</span>
            </div>
            <div className="hero-card card-2">
              <div className="card-image spider-man"></div>
              <span className="card-label">Spider-Man</span>
            </div>
            <div className="hero-card card-3">
              <div className="card-image captain-america"></div>
              <span className="card-label">Captain America</span>
            </div>
          </div>
          <div className="hero-glow"></div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <div className="scroll-indicator">
        <span>Scroll to explore</span>
        <div className="scroll-line"></div>
      </div>
    </section>
  );
};

export default Hero;
