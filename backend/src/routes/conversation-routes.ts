import express from 'express';
import { addConversation, getConversationsByLead } from '../controllers/add-conversation';
import SalesAuthMiddleware from '../middleware/sales-auth-middleware';

const router = express.Router();

// Add conversation notes
router.post('/add', SalesAuthMiddleware, addConversation);

// Get conversations for a specific lead
router.get('/lead/:lead_id', SalesAuthMiddleware, getConversationsByLead);

export default router; 