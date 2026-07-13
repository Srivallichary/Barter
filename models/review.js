const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    trade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trade',
      required: true,
      index: true,
    },
    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reviewee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    score: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      default: '',
      trim: true,
      maxlength: 600,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ trade: 1, reviewer: 1, reviewee: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
