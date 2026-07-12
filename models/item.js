const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Books',
        'Electronics',
        'Clothing',
        'Furniture',
        'Sports',
        'Accessories',
        'Home Appliances',
        'Others',
        'Textbooks',
        'Dorm Decor',
        'Clothing & Gear',
        'Games & Hobbies',
        'Bicycles & Sports'
      ],
    },
    condition: {
  type: String,
  enum: ['New', 'Like New', 'Good', 'Fair', 'Used', 'Refurbished'],
  default: 'Good',
    },
    images: {
      type: [String], // array of file paths/URLs, supports multiple images
      default: [],
    },
    image: {
      type: String,
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'traded', 'pending'],
      default: 'available',
    },
    location: {
      type: String,
      trim: true,
      default: '',
    },
    tags: {
      type: [String],
      default: [],
    },
    estimatedValue: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster search/filtering
itemSchema.index({ title: 'text', description: 'text', tags: 'text' });
itemSchema.index({ category: 1 });
itemSchema.index({ condition: 1 });
itemSchema.index({ owner: 1 });
itemSchema.index({ status: 1 });

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;