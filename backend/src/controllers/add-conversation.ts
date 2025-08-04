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

        console.log('Received conversation request:', {
            lead_id,
            conversation_notes: conversation_notes?.substring(0, 50) + '...',
            sales_user_id
        });

        if (!sales_user_id) {
            console.log('User not authenticated');
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        if (!lead_id || !conversation_notes) {
            console.log('Missing required fields:', { lead_id: !!lead_id, conversation_notes: !!conversation_notes });
            return res.status(400).json({
                success: false,
                message: 'Lead ID and conversation notes are required'
            });
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
                sales_user_id, 
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

        console.log('Conversation saved successfully:', result._id);

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
        const sales_user_id = req.userInfo?.userId;

        if (!sales_user_id) {
            return res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
        }

        const conversationDoc = await conversations.findOne({
            lead_id,
            sales_user_id
        });

        if (!conversationDoc) {
            return res.status(200).json({
                success: true,
                data: []
            });
        }

        // Sort conversations by date (newest first)
        const sortedConversations = conversationDoc.conversations.sort(
            (a, b) => new Date(b.conversation_date).getTime() - new Date(a.conversation_date).getTime()
        );

        res.status(200).json({
            success: true,
            data: sortedConversations
        });

    } catch (error) {
        console.error('Error fetching conversations:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
}; 