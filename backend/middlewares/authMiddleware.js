import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/user.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  console.log('Auth header in PROTECT:', req.headers.authorization);
  // ✅ Check for token in cookie
  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // ✅ Optionally allow Bearer token header as fallback
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // ✅ Verify token if found
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  } else {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };
