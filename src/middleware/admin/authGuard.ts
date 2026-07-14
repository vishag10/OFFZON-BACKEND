import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_COOKIE } from '../cookieConfig.ts';

export const isAuthenticated = (req, res, next) => {
  const token = req.cookies?.[ACCESS_TOKEN_COOKIE];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!);
    req.admin = decoded; // { id, email, iat, exp }
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token expired or invalid' });
  }
};
