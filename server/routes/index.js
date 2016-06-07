import express from 'express';
import categoriesRoutes from './category';
import preferencesRoutes from './preference';
import userRoutes from './user';

const router = express.Router();

router.use('/session', require('./session'));

// Mount category routes at /categories
router.use('/categories', categoriesRoutes);

// Mount preference routes at /preferences
router.use('/preferences', preferencesRoutes);

// Mount user routes at /user
router.use('/users', userRoutes);

export default router;