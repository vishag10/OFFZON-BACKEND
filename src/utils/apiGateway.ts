import express from 'express';
import adminRoutes from '../routes/adminRoutes/index.ts';

const router = express.Router();

router.use('/admin', adminRoutes);

export default router;