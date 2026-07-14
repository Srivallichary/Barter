const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

async function cascadeDeleteUserData(userId) {
  if (!userId) return;

  const Item = mongoose.model('Item');
  const Trade = mongoose.model('Trade');
  const Message = mongoose.model('Message');
  const Notification = mongoose.model('Notification');
  const Wishlist = mongoose.model('Wishlist');

  const itemIds = await Item.find({ owner: userId }).distinct('_id');
  const tradeIds = await Trade.find({
    $or: [{ fromUser: userId }, { toUser: userId }]
  }).distinct('_id');

  await Message.deleteMany({
    $or: [
      { sender: userId },
      { receiver: userId },
      { trade: { $in: tradeIds } }
    ]
  });

  await Notification.deleteMany({
    $or: [
      { user: userId },
      { relatedTrade: { $in: tradeIds } },
      { relatedItem: { $in: itemIds } }
    ]
  });

  await Wishlist.deleteMany({ user: userId });

  if (itemIds.length > 0) {
    await Wishlist.updateMany(
      { items: { $in: itemIds } },
      { $pull: { items: { $in: itemIds } } }
    );
  }

  await Trade.deleteMany({
    $or: [{ fromUser: userId }, { toUser: userId }]
  });

  await Item.deleteMany({ owner: userId });
}

// 1. Define the SCHEMA (blueprint of what a User looks like)
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    rating: {
      type: Number,
      default: 0,
    },
    completedTrades: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
      default: '',
    },
    phone: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      default: 'User',
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified'],
      default: 'unverified',
    },
    idCardImage: {
      type: String,
      default: '',
    },
    verificationSubmittedAt: {
      type: Date,
    },
    verificationReviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true, // auto adds createdAt & updatedAt
  }
);

// 2. MIDDLEWARE: runs automatically BEFORE saving a user
userSchema.pre('save', async function () {
  // only hash the password if it's new or changed
  if (!this.isModified('password')) {
    return;
  }

  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
});

// 3. INSTANCE METHOD: lets us compare login password with stored hash
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 4. Build the MODEL from the schema and export it
const User = mongoose.model('User', userSchema);

module.exports = User;