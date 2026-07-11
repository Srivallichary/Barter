const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        'trade_request',
        'trade_accepted',
        'trade_rejected',
        'new_message',
        'item_liked',
        'item_removed',
      ],
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    relatedTrade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Trade',
      default: null,
    },
    relatedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.index({ user: 1, isRead: 1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;