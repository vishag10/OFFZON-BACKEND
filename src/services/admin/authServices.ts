import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../../models/admin/Admin.ts';

export const generateAccessToken = (payload: object) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '15m' });

export const generateRefreshToken = (payload: object) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET!, { expiresIn: '7d' });

export const loginService = async (email: string, password: string) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const payload = { id: admin._id, email: admin.email };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Store refresh token in DB for server-side validation
  admin.refreshToken = refreshToken;
  admin.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await admin.save();

  return { admin: payload, accessToken, refreshToken };
};

export const refreshService = async (refreshToken: string) => {
  if (!refreshToken) throw new Error('Refresh token required');

  let decoded: any;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
  } catch {
    throw new Error('Invalid or expired refresh token');
  }

  // Verify token exists in DB (prevents reuse of revoked tokens)
  const admin = await Admin.findOne({
    _id: decoded.id,
    refreshToken,
    refreshTokenExpiry: { $gt: new Date() },
  });
  if (!admin) throw new Error('Invalid or expired refresh token');

  // Rotate tokens
  const payload = { id: admin._id, email: admin.email };
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  admin.refreshToken = newRefreshToken;
  admin.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await admin.save();

  return { admin: payload, accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutService = async (adminId: string) => {
  await Admin.findByIdAndUpdate(adminId, { refreshToken: null, refreshTokenExpiry: null });
};
