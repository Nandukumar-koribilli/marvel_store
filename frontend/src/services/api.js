import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products
export const getProducts = (params) => api.get('/products', { params });
export const getProduct = (id) => api.get(`/products/${id}`);
export const getFeaturedProducts = () => api.get('/products/featured');
export const getProductsByCategory = (category) => api.get(`/products/category/${category}`);
export const createProduct = (formData) => api.post('/products', formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const updateProduct = (id, formData) => api.put(`/products/${id}`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
});
export const deleteProduct = (id) => api.delete(`/products/${id}`);

// Users
export const registerUser = (data) => api.post('/users/register', data);
export const loginUser = (data) => api.post('/users/login', data);
export const getUserProfile = () => api.get('/users/profile');
export const updateUserProfile = (data) => api.put('/users/profile', data);

// Cart
export const addToCart = (data) => api.post('/users/cart', data);
export const updateCartItem = (productId, data) => api.put(`/users/cart/${productId}`, data);
export const removeFromCart = (productId) => api.delete(`/users/cart/${productId}`);

// Wishlist
export const addToWishlist = (data) => api.post('/users/wishlist', data);
export const removeFromWishlist = (productId) => api.delete(`/users/wishlist/${productId}`);

// Orders
export const createOrder = (data) => api.post('/orders', data);
export const getMyOrders = () => api.get('/orders/myorders');
export const getOrder = (id) => api.get(`/orders/${id}`);
export const updateOrderToPaid = (id, data) => api.put(`/orders/${id}/pay`, data);

// Admin
export const getOrders = (params) => api.get('/orders', { params });
export const updateOrderStatus = (id, data) => api.put(`/orders/${id}/status`, data);
export const getOrderStats = () => api.get('/orders/stats');
export const getUsers = () => api.get('/users');

export default api;
