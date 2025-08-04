import express from 'express';
import SalesAuthMiddleware from '../middleware/sales-auth-middleware';
import addLeadsToSales from '../controllers/add-lead';
import getLeads from '../controllers/get-leads';
import updateLead from '../controllers/update-lead';
import { getColumnPreferences, saveColumnPreferences } from '../controllers/column-preferences';

const router = express.Router();

router.post('/add-leads-to-sales', SalesAuthMiddleware, addLeadsToSales);
router.get('/leads', SalesAuthMiddleware, getLeads);
router.put('/leads/:leadId', SalesAuthMiddleware, updateLead);
router.get('/column-preferences', SalesAuthMiddleware, getColumnPreferences);
router.put('/column-preferences', SalesAuthMiddleware, saveColumnPreferences);

export default router;