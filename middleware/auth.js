const jwt = require("jsonwebtoken");

// @desc    Middleware to verify JWT token
// @route   Any protected route
// @access  Private
module.exports = function (req, res, next) {
  console.log(`[AUTH] ${new Date().toISOString()} - Auth middleware triggered for ${req.method} ${req.originalUrl}`);

  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    console.log(`[AUTH] ${new Date().toISOString()} - No token provided for ${req.method} ${req.originalUrl}`);
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded.admin;
    console.log(
      `[AUTH] ${new Date().toISOString()} - Token verified successfully for admin ID: ${req.admin.id}, Org ID: ${
        req.admin.organization
      }, Role: ${req.admin.role}`
    );
    next();
  } catch (err) {
    console.log(`[AUTH] ${new Date().toISOString()} - Token verification failed: ${err.message}`);
    res.status(401).json({ msg: "Token is not valid" });
  }
};
