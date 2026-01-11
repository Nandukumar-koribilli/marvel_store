const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  getFeaturedProducts,
  getProductsByCategory,
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

router.route('/')
  .get(getProducts)
  .post(protect, admin, upload.array('images', 5), createProduct);

router.get('/featured', getFeaturedProducts);
router.get('/category/:category', getProductsByCategory);

router.route('/:id')
  .get(getProductById)
  .put(protect, admin, upload.array('images', 5), updateProduct)
  .delete(protect, admin, deleteProduct);

router.delete('/:id/images/:imageId', protect, admin, deleteProductImage);

module.exports = router;
