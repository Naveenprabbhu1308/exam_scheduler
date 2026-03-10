const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Admin only
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ message: 'Admin access only' });
  next();
};

// Admin or Staff
const staffOrAdmin = (req, res, next) => {
  if (!['admin', 'staff'].includes(req.user.role))
    return res.status(403).json({ message: 'Staff or Admin access only' });
  next();
};

module.exports = { auth, adminOnly, staffOrAdmin };