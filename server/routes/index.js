import express from 'express';
import categoriesRoutes from './category';

const router = express.Router();

// Mount category routes at /categories
router.use('/categories', categoriesRoutes);

export default router;