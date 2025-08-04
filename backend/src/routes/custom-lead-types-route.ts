import express from 'express';
import getCustomLeadTypes from '../controllers/get-custom-lead-types';
import salesAuthMiddleware from '../middleware/sales-auth-middleware';

const router = express.Router();

// Get custom lead types for the authenticated sales user
router.get('/custom-lead-types', salesAuthMiddleware, getCustomLeadTypes);

export default router; 