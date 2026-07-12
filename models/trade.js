const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    offeredItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    requestedItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed', 'expired'],
      default: 'pending',
    },
    meetupLocation: {
      type: String,
      default: '',
    },
    meetupTime: {
      type: String,
      default: '',
    },
    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        senderName: {
          type: String,
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      }
    ],
  },
  {
    timestamps: true,
  }
);

const Trade = mongoose.model('Trade', tradeSchema);

module.exports = Trade;