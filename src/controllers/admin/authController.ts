import { loginService, refreshService, logoutService } from '../../services/admin/authServices.ts';

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const result = await loginService(email, password);

    // Store admin in session
    req.session.admin = result.admin;

    res.json({
      success: true,
      data: { admin: result.admin, refreshToken: result.refreshToken },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const adminRefresh = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if(!refreshToken) return res.status(400).json({ message: 'Refresh token is required' })
    
    const result = await refreshService(refreshToken);

    // Update session
    req.session.admin = result.admin;

    res.json({
      success: true,
      data: { admin: result.admin, refreshToken: result.refreshToken },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
};

export const adminLogout = async (req, res) => {
  try {
    if (req.session.admin) {
      await logoutService(req.session.admin.id);
    }
    req.session.destroy(() => {
      res.clearCookie('connect.sid');
      res.json({ success: true, message: 'Logged out' });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
