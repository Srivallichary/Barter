require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function testConnection() {
  try {
    // 1. Connect to MongoDB using the link from .env
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || 'tradeApp',
    });
    console.log('✅ Connected to MongoDB successfully!');

    // 2. Create a test user (password will be auto-hashed by bcrypt)
    const testUser = new User({
      name: 'Test User',
      email: `testuser${Date.now()}@example.com`, // unique email every run
      password: 'plainPassword123',
    });

    // 3. Save it to the database
    const savedUser = await testUser.save();
    console.log('✅ User saved successfully!');
    console.log('Saved user document:', savedUser);

    // 4. Check that the password was actually hashed (not plain text)
    if (savedUser.password !== 'plainPassword123') {
      console.log('✅ Password was hashed correctly by bcrypt!');
    } else {
      console.log('❌ Password was NOT hashed — check the pre-save hook in User.js');
    }

    // 5. Test the comparePassword method
    const isMatch = await savedUser.comparePassword('plainPassword123');
    console.log('✅ comparePassword() works:', isMatch);
  } catch (error) {
    console.error('❌ Something went wrong:', error.message);
  } finally {
    // 6. Close the connection
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
}

testConnection();