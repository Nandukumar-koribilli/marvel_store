const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderStatus,
  getMyOrders,
  getOrders,
  getOrderStats,
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');

router.route('/')
  .get(protect, admin, getOrders)
  .post(protect, createOrder);

router.get('/myorders', protect, getMyOrders);
router.get('/stats', protect, admin, getOrderStats);

router.route('/:id')
  .get(protect, getOrderById);

router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
