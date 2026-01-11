import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube, FiMail } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-glow"></div>
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-marvel">MARVEL</span>
              <span className="logo-store">STORE</span>
            </Link>
            <p className="footer-description">
              Your ultimate destination for official Marvel merchandise. 
              Gear up like your favorite superheroes!
            </p>
            <div className="footer-social">
              <a href="#" className="social-link" aria-label="Facebook"><FiFacebook /></a>
              <a href="#" className="social-link" aria-label="Twitter"><FiTwitter /></a>
              <a href="#" className="social-link" aria-label="Instagram"><FiInstagram /></a>
              <a href="#" className="social-link" aria-label="YouTube"><FiYoutube /></a>
            </div>
          </div>

          {/* Shop */}
          <div className="footer-column">
            <h4 className="footer-title">Shop</h4>
            <ul className="footer-links">
              <li><Link to="/products?category=shirts">T-Shirts</Link></li>
              <li><Link to="/products?category=hoodies">Hoodies</Link></li>
              <li><Link to="/products?category=pants">Pants</Link></li>
              <li><Link to="/products?category=bags">Bags</Link></li>
              <li><Link to="/products?category=accessories">Accessories</Link></li>
              <li><Link to="/products?category=collectibles">Collectibles</Link></li>
            </ul>
          </div>

          {/* Characters */}
          <div className="footer-column">
            <h4 className="footer-title">Characters</h4>
            <ul className="footer-links">
              <li><Link to="/products?character=iron-man">Iron Man</Link></li>
              <li><Link to="/products?character=spider-man">Spider-Man</Link></li>
              <li><Link to="/products?character=captain-america">Captain America</Link></li>
              <li><Link to="/products?character=thor">Thor</Link></li>
              <li><Link to="/products?character=hulk">Hulk</Link></li>
              <li><Link to="/products?character=avengers">Avengers</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-column">
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li><Link to="/contact">Contact Us</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/shipping">Shipping Info</Link></li>
              <li><Link to="/returns">Returns</Link></li>
              <li><Link to="/size-guide">Size Guide</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-column footer-newsletter">
            <h4 className="footer-title">Stay Updated</h4>
            <p className="newsletter-text">
              Subscribe to get exclusive offers and Marvel news!
            </p>
            <form className="newsletter-form">
              <div className="newsletter-input-group">
                <FiMail className="newsletter-icon" />
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="newsletter-input"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <div className="footer-copyright">
            <p>&copy; {currentYear} Marvel Store. All rights reserved.</p>
            <p className="powered-by">Powered by Marvel Entertainment</p>
          </div>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
