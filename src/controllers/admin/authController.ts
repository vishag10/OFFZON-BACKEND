import { loginService, refreshService, logoutService } from '../../services/admin/authServices.ts';
import { setAuthCookies, clearAuthCookies, REFRESH_TOKEN_COOKIE } from '../../middleware/cookieConfig.ts';

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const result = await loginService(email, password);

    // Inject tokens into httpOnly cookies — NOT in response body
    setAuthCookies(res, result.accessToken, result.refreshToken);

    res.json({ success: true, data: { admin: result.admin } });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const adminRefresh = async (req, res) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE];
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token' });
    }

    const result = await refreshService(refreshToken);

    // Update cookies with new tokens
    setAuthCookies(res, result.accessToken, result.refreshToken);

    res.json({ success: true, data: { admin: result.admin } });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const adminLogout = async (req, res) => {
  try {
    // req.admin is set by authGuard middleware
    await logoutService(req.admin.id);

    // Clear both cookies from browser
    clearAuthCookies(res);

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
