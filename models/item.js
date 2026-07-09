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
      trim: true,
    },
    image: {
      type: String, // stores the file path/URL of uploaded image
      default: '',
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // links this item to a User document
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'traded', 'pending'],
      default: 'available',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster search/filtering
itemSchema.index({ title: 'text', description: 'text' }); // enables text search
itemSchema.index({ category: 1 }); // faster filtering by category
itemSchema.index({ owner: 1 }); // faster lookup of items by owner

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;