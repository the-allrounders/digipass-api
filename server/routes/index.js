import express from 'express';
import categoriesRoutes from './category';
import preferencesRoutes from './preference';

const router = express.Router();

// Mount category routes at /categories
router.use('/categories', categoriesRoutes);

// Mount preference routes at /preferences
router.use('/preferences', preferencesRoutes);

export default router;