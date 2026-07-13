import { Router } from 'express';
import { adminLogin, adminRefresh, adminLogout } from '../../controllers/admin/authController.ts';
import { isAuthenticated } from '../../middleware/admin/authGuard.ts';

const router = Router();

router.post('/login', adminLogin);
router.post('/refresh', adminRefresh);
router.post('/logout', isAuthenticated, adminLogout);

export default router;
