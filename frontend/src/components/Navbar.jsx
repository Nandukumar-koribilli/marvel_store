import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  
  const { isAuthenticated, user, logout, cart } = useAuth();
  const { localCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = isAuthenticated ? cart.length : localCart.length;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${searchQuery}`);
      setShowSearch(false);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const categories = [
    { name: 'Shirts', path: '/products?category=shirts' },
    { name: 'Pants', path: '/products?category=pants' },
    { name: 'Bags', path: '/products?category=bags' },
    { name: 'Pens', path: '/products?category=pens' },
    { name: 'Hoodies', path: '/products?category=hoodies' },
    { name: 'Accessories', path: '/products?category=accessories' },
  ];

  return (
    <>
      <motion.nav 
        className={`navbar ${isScrolled ? 'scrolled' : ''}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="navbar-container">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <span className="logo-marvel">MARVEL</span>
            <span className="logo-store">STORE</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="navbar-links">
            <Link to="/products" className="nav-link">All Products</Link>
            <div className="nav-dropdown">
              <span className="nav-link dropdown-trigger">Categories</span>
              <div className="dropdown-menu">
                {categories.map((cat) => (
                  <Link key={cat.name} to={cat.path} className="dropdown-item">
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link to="/products?featured=true" className="nav-link">Featured</Link>
          </div>

          {/* Actions */}
          <div className="navbar-actions">
            <button 
              className="action-btn"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Search"
            >
              <FiSearch />
            </button>
            
            <Link to="/wishlist" className="action-btn" aria-label="Wishlist">
              <FiHeart />
            </Link>
            
            <Link to="/cart" className="action-btn cart-btn" aria-label="Cart">
              <FiShoppingCart />
              {cartCount > 0 && (
                <span className="cart-count">{cartCount}</span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="user-dropdown">
                <button className="action-btn user-btn">
                  <FiUser />
                  <span className="user-name">{user?.name?.split(' ')[0]}</span>
                </button>
                <div className="dropdown-menu user-menu">
                  <Link to="/profile" className="dropdown-item">My Profile</Link>
                  <Link to="/orders" className="dropdown-item">My Orders</Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="dropdown-item">Admin Panel</Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-item logout-btn">
                    <FiLogOut /> Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">
                Sign In
              </Link>
            )}

            <button 
              className="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <AnimatePresence>
          {showSearch && (
            <motion.div 
              className="search-bar"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <form onSubmit={handleSearch} className="search-form">
                <FiSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Search for Marvel products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween' }}
          >
            <div className="mobile-menu-content">
              <Link to="/products" className="mobile-link">All Products</Link>
              {categories.map((cat) => (
                <Link key={cat.name} to={cat.path} className="mobile-link">
                  {cat.name}
                </Link>
              ))}
              <Link to="/products?featured=true" className="mobile-link">Featured</Link>
              <div className="mobile-divider"></div>
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="mobile-link">My Profile</Link>
                  <Link to="/orders" className="mobile-link">My Orders</Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="mobile-link">Admin Panel</Link>
                  )}
                  <button onClick={handleLogout} className="mobile-link logout">
                    Logout
                  </button>
                </>
              ) : (
                <Link to="/login" className="btn btn-primary" style={{ width: '100%' }}>
                  Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
