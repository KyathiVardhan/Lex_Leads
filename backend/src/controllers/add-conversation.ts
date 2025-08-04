import { Request, Response } from 'express';
import conversations from '../models/SalesConverstions';

interface AuthRequest extends Request {
    userInfo?: {
        userId: string;
        userName: string;
        role: string;
    };
}

export const addConversation = async (req: AuthRequest, res: Response) => {
    try {
        const { lead_id, conversation_notes } = req.body;
        const sales_user_id = req.userInfo?.userId;
        const userRole = req.userInfo?.role;

        if (!req.userInfo) {
            console.log('User not authenticated');
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }

        // For admin users, use a special admin user ID
        const finalUserId = userRole === 'admin' 
            ? '000000000000000000000000' // Admin placeholder ID
            : sales_user_id;

        if (!lead_id || !conversation_notes) {
            console.log('Missing required fields');
            res.status(400).json({
                success: false,
                message: 'Lead ID and conversation notes are required'
            });
            return;
        }

        // Create new conversation entry
        const newConversationEntry = {
            conversation_notes,
            conversation_date: new Date(),
            updated_at: new Date()
        };

        console.log('Saving conversation to database...');
        
        // Use findOneAndUpdate with upsert to create or update the document
        const result = await conversations.findOneAndUpdate(
            { 
                sales_user_id: finalUserId, 
                lead_id 
            },
            {
                $push: { conversations: newConversationEntry },
                $set: { last_updated: new Date() }
            },
            {
                upsert: true, // Create if doesn't exist
                new: true, // Return the updated document
                runValidators: true
            }
        );

        console.log('Conversation saved successfully');

        res.status(201).json({
            success: true,
            message: 'Conversation added successfully',
            data: result
        });

    } catch (error) {
        console.error('Error adding conversation:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

export const getConversationsByLead = async (req: AuthRequest, res: Response) => {
    try {
        const { lead_id } = req.params;
        if (!req.userInfo) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        // Fetch all conversation docs for this lead
        const allDocs = await conversations.find({ lead_id });
        // Aggregate all conversation entries
        let allConversations: any[] = [];
        for (const doc of allDocs) {
            if (Array.isArray(doc.conversations)) {
                allConversations = allConversations.concat(doc.conversations);
            }
        }
        // Sort by date (newest first)
        allConversations.sort((a, b) => new Date(b.conversation_date).getTime() - new Date(a.conversation_date).getTime());
        res.status(200).json({
            success: true,
            data: allConversations
        });
    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}; 