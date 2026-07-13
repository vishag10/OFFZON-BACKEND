import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Admin from '../../models/admin/Admin.ts';

export const loginService = async (email, password) => {
  const admin = await Admin.findOne({ email });
  if (!admin) throw new Error('Invalid credentials');

  const isMatch = await bcrypt.compare(password, admin.password);
  if (!isMatch) throw new Error('Invalid credentials');

  const refreshToken = crypto.randomBytes(40).toString('hex');
  const refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  admin.refreshToken = refreshToken;
  admin.refreshTokenExpiry = refreshTokenExpiry;
  await admin.save();

  return { admin: { id: admin._id, email: admin.email }, refreshToken };
};

export const refreshService = async (refreshToken) => {
  if (!refreshToken) throw new Error('Refresh token required');

  const admin = await Admin.findOne({
    refreshToken,
    refreshTokenExpiry: { $gt: new Date() },
  });
  if (!admin) throw new Error('Invalid or expired refresh token');

  const newRefreshToken = crypto.randomBytes(40).toString('hex');
  admin.refreshToken = newRefreshToken;
  admin.refreshTokenExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await admin.save();

  return { admin: { id: admin._id, email: admin.email }, refreshToken: newRefreshToken };
};

export const logoutService = async (adminId) => {
  await Admin.findByIdAndUpdate(adminId, { refreshToken: null, refreshTokenExpiry: null });
};
