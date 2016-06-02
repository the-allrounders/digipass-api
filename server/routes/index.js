import express from 'express';
import userRoutes from './category';

const router = express.Router();

// Mount category routes at /categories
router.use('/categories', userRoutes);

export default router;