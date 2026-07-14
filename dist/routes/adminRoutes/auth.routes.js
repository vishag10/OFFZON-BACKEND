import { Router } from 'express';
import { adminLogin, adminRefresh, adminLogout } from '../../controllers/admin/authController.js';
import { isAuthenticated } from '../../middleware/admin/authGuard.js';
const router = Router();
router.post('/login', adminLogin);
router.post('/refresh', adminRefresh);
router.post('/logout', isAuthenticated, adminLogout);
export default router;
