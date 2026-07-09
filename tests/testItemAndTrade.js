require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');
const Trade = require('../models/Trade');

async function testItemAndTrade() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || 'tradeApp',
    });
    console.log('✅ Connected to MongoDB successfully!');

    // 2. Create two test users (needed for owner/fromUser/toUser references)
    const userA = await User.create({
      name: 'Alice',
      email: `alice${Date.now()}@example.com`,
      password: 'password123',
    });
    const userB = await User.create({
      name: 'Bob',
      email: `bob${Date.now()}@example.com`,
      password: 'password123',
    });
    console.log('✅ Two test users created:', userA.name, '&', userB.name);

    // 3. Create two test items, one owned by each user
    const itemA = await Item.create({
      title: 'Old Guitar',
      description: 'A slightly used acoustic guitar',
      category: 'Music',
      owner: userA._id,
    });
    const itemB = await Item.create({
      title: 'Skateboard',
      description: 'Barely used skateboard',
      category: 'Sports',
      owner: userB._id,
    });
    console.log('✅ Two test items created:', itemA.title, '&', itemB.title);
    await Item.syncIndexes();
    console.log('✅ Indexes synced!');
    // 4. Create a trade between the two users/items
    const trade = await Trade.create({
      fromUser: userA._id,
      toUser: userB._id,
      offeredItem: itemA._id,
      requestedItem: itemB._id,
    });
    console.log('✅ Trade created successfully!');
    console.log('Trade document:', trade);

    // 5. Confirm default status was applied correctly
    if (trade.status === 'pending') {
      console.log('✅ Trade default status is "pending" as expected!');
    } else {
      console.log('❌ Unexpected trade status:', trade.status);
    }

    // 6. Confirm timestamps were added
    if (trade.createdAt && trade.updatedAt) {
      console.log('✅ Trade timestamps (createdAt/updatedAt) working!');
    }

    // 7. Test the text index on Item by searching
    const searchResults = await Item.find({ $text: { $search: 'Guitar' } });
    console.log(
      `✅ Text index search works! Found ${searchResults.length} result(s) for "Guitar"`
    );
  } catch (error) {
    console.error('❌ Something went wrong:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('Connection closed.');
  }
}

testItemAndTrade();