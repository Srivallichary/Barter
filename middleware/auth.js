const jwt = require('jsonwebtoken');

// This middleware protects routes by checking for a valid JWT token
const auth = (req, res, next) => {
  try {
    // 1. Get the token from the request header
    // Frontend sends it like: Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided, access denied',
      });
    }

    // 2. Extract just the token part (remove "Bearer ")
    const token = authHeader.split(' ')[1];

    // 3. Verify the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the decoded user info to the request
    // so the next function (the actual route) knows who's logged in
    req.user = decoded;

    // 5. Let the request continue to the actual route
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    });
  }
};

module.exports = auth;