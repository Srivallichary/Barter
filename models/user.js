const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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