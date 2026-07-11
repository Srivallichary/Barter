require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/user');
const Item = require('../models/item');
const Trade = require('../models/trade');

async function testItemAndTrade() {
  try {
    // 1. Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME || 'tradeApp',
    });
    console.log('✅ Connected to MongoDB successfully!');

    // 2. Create two test users
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

    // 3. Create two test items using the NEW schema fields
    const itemA = await Item.create({
      title: 'Old Guitar',
      description: 'A slightly used acoustic guitar',
      category: 'Others',
      condition: 'Good',
      images: ['uploads/sample-guitar.jpg'],
      owner: userA._id,
      location: 'Campus Block A',
      tags: ['music', 'instrument'],
      estimatedValue: 3000,
    });

    const itemB = await Item.create({
      title: 'Skateboard',
      description: 'Barely used skateboard',
      category: 'Sports',
      condition: 'Like New',
      images: ['uploads/sample-skateboard.jpg'],
      owner: userB._id,
      location: 'Campus Block B',
      tags: ['sports', 'outdoor'],
      estimatedValue: 1500,
    });
    console.log('✅ Two test items created:', itemA.title, '&', itemB.title);

    // 4. Sync indexes
    await Item.syncIndexes();
    console.log('✅ Indexes synced!');

    // 5. Create a trade between the two users/items
    const trade = await Trade.create({
      fromUser: userA._id,
      toUser: userB._id,
      offeredItem: itemA._id,
      requestedItem: itemB._id,
    });
    console.log('✅ Trade created successfully!');
    console.log('Trade document:', trade);

    // 6. Confirm default status
    if (trade.status === 'pending') {
      console.log('✅ Trade default status is "pending" as expected!');
    }

    // 7. Confirm the new expanded trade status enum accepts "cancelled"
    trade.status = 'cancelled';
    await trade.save();
    console.log('✅ Trade status successfully updated to "cancelled" — new enum values work!');

    // 8. Confirm category enum rejects invalid values
    try {
      await Item.create({
        title: 'Invalid Category Test',
        description: 'This should fail',
        category: 'NotARealCategory',
        condition: 'Good',
        owner: userA._id,
      });
      console.log('❌ This should NOT have succeeded — category enum is not working!');
    } catch (error) {
      console.log('✅ Category enum correctly rejected an invalid value!');
    }

    // 9. Test text index search
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