const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  addToCart,
  removeFromCart,
  updateCartItem,
  addToWishlist,
  removeFromWishlist,
  addAddress,
  getUsers,
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

router.post('/register', registerUser);
router.post('/login', loginUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/cart')
  .post(protect, addToCart);

router.route('/cart/:productId')
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart);

router.route('/wishlist')
  .post(protect, addToWishlist);

router.delete('/wishlist/:productId', protect, removeFromWishlist);

router.post('/addresses', protect, addAddress);

router.get('/', protect, admin, getUsers);

module.exports = router;
