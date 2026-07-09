require('dotenv').config();
const jwt = require('jsonwebtoken');

console.log('--- Testing JWT Generation & Verification ---');

// 1. Simulate what happens after a successful login:
// we create a token containing the user's ID
const fakeUserId = '64f1a2b3c4d5e6f7g8h9i0j1'; // just a sample ID for testing

const token = jwt.sign(
  { userId: fakeUserId }, // payload: the data stored inside the token
  process.env.JWT_SECRET, // secret key used to sign it
  { expiresIn: '1h' } // token expires in 1 hour
);

console.log('✅ Token generated successfully!');
console.log('Token:', token);

// 2. Now simulate what auth.js does: verifying the token
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  console.log('✅ Token verified successfully!');
  console.log('Decoded payload:', decoded);

  if (decoded.userId === fakeUserId) {
    console.log('✅ Decoded userId matches the original — JWT flow works correctly!');
  }
} catch (error) {
  console.error('❌ Token verification failed:', error.message);
}

// 3. Test what happens with an INVALID token (should fail on purpose)
try {
  jwt.verify('this.is.not.a.real.token', process.env.JWT_SECRET);
  console.log('❌ This should not have succeeded!');
} catch (error) {
  console.log('✅ Invalid token correctly rejected:', error.message);
}