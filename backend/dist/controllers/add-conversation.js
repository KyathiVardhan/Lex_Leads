"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationsByLead = exports.addConversation = void 0;
const SalesConverstions_1 = __importDefault(require("../models/SalesConverstions"));
const addConversation = async (req, res) => {
    try {
        const { lead_id, conversation_notes } = req.body;
        const sales_user_id = req.userInfo?.userId;
        if (!sales_user_id) {
            console.log('User not authenticated');
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        if (!lead_id || !conversation_notes) {
            console.log('Missing required fields');
            res.status(400).json({
                success: false,
                message: 'Lead ID and conversation notes are required'
            });
            return;
        }
        const newConversationEntry = {
            conversation_notes,
            conversation_date: new Date(),
            updated_at: new Date()
        };
        console.log('Saving conversation to database...');
        const result = await SalesConverstions_1.default.findOneAndUpdate({
            sales_user_id,
            lead_id
        }, {
            $push: { conversations: newConversationEntry },
            $set: { last_updated: new Date() }
        }, {
            upsert: true,
            new: true,
            runValidators: true
        });
        console.log('Conversation saved successfully');
        res.status(201).json({
            success: true,
            message: 'Conversation added successfully',
            data: result
        });
    }
    catch (error) {
        console.error('Error adding conversation:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.addConversation = addConversation;
const getConversationsByLead = async (req, res) => {
    try {
        const { lead_id } = req.params;
        const sales_user_id = req.userInfo?.userId;
        if (!sales_user_id) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        const conversationDoc = await SalesConverstions_1.default.findOne({
            lead_id,
            sales_user_id
        });
        if (!conversationDoc) {
            res.status(200).json({
                success: true,
                data: []
            });
            return;
        }
        const sortedConversations = conversationDoc.conversations.sort((a, b) => new Date(b.conversation_date).getTime() - new Date(a.conversation_date).getTime());
        res.status(200).json({
            success: true,
            data: sortedConversations
        });
    }
    catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getConversationsByLead = getConversationsByLead;
//# sourceMappingURL=add-conversation.js.map