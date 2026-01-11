const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['shirts', 'pants', 'bags', 'pens', 'accessories', 'collectibles', 'hoodies', 'caps'],
  },
  character: {
    type: String,
    enum: ['iron-man', 'spider-man', 'captain-america', 'thor', 'hulk', 'black-widow', 'black-panther', 'doctor-strange', 'avengers', 'guardians', 'x-men', 'all'],
    default: 'avengers',
  },
  images: [{
    url: String,
    publicId: String,
  }],
  stock: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size'],
  }],
  colors: [{
    name: String,
    hex: String,
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);
