import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch the actual admin from TiDB Cloud
    const admin = await Admin.findOne({
      where: { id: decoded.id },
      attributes: ['id', 'email', 'name'] // Don't fetch sensitive fields
    });

    if (!admin) {
      return res.status(401).json({ message: "Admin no longer exists" });
    }

    req.user = admin;
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    const message = err?.name === 'TokenExpiredError'
      ? 'Token has expired'
      : 'Token is not valid';
    res.status(401).json({ message });
  }
};
