import { Request, Response } from "express";
import AddNewLead from "../models/AddNewLead";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
    userInfo?: {
        userId?: string;
        userName: string;
        role: string;
    };
}

const updateLead = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { leadId } = req.params;
        const {
            intrested,
            follow_up_conversation,
            status
        } = req.body;

        // Get the current user's role from the authenticated request
        const currentUserRole = req.userInfo?.role;
        
        if (!req.userInfo) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }

        // Validate required fields
        if (!intrested || !status) {
            res.status(400).json({
                success: false,
                message: "Interest level and status are required fields"
            });
            return;
        }

        // Find the lead and check if it exists
        let existingLead;
        if (currentUserRole === 'admin') {
            // Admins can update any lead
            existingLead = await AddNewLead.findById(leadId);
        } else if (currentUserRole === 'sales') {
            // Sales users can update leads that are assigned to them (created_by field)
            const userObjectId = new mongoose.Types.ObjectId(req.userInfo.userId);
            existingLead = await AddNewLead.findOne({ _id: leadId, created_by: userObjectId });
        } else {
            res.status(403).json({
                success: false,
                message: 'You do not have permission to update this lead.'
            });
            return;
        }

        if (!existingLead) {
            res.status(404).json({
                success: false,
                message: currentUserRole === 'admin' 
                    ? "Lead not found" 
                    : "Lead not found or you don't have permission to edit it"
            });
            return;
        }

        console.log('Updating lead:', leadId, 'for user:', req.userInfo.userName);
        console.log('Update data:', { intrested, follow_up_conversation, status });

        // Update only the allowed fields
        const updatedLead = await AddNewLead.findByIdAndUpdate(
            leadId,
            {
                intrested,
                follow_up_conversation,
                status,
                updated_at: new Date()
            },
            { new: true, runValidators: true }
        );

        // For both admin and sales, always save conversation to conversation history if follow_up_conversation is present
        if (follow_up_conversation && follow_up_conversation.trim()) {
            try {
                const conversations = (await import('../models/SalesConverstions')).default;
                let salesUserId, salesPersonName;
                if (currentUserRole === 'admin') {
                    salesUserId = existingLead.created_by;
                    // Fetch sales person name from SalesUser collection
                    const SalesUser = (await import('../models/SalesUser')).default;
                    const salesUserDoc = await SalesUser.findById(salesUserId);
                    salesPersonName = salesUserDoc ? salesUserDoc.name : 'Unknown';
                } else {
                    salesUserId = new mongoose.Types.ObjectId(req.userInfo.userId);
                    salesPersonName = req.userInfo.userName;
                }
                const newConversationEntry = {
                    conversation_notes: follow_up_conversation,
                    conversation_date: new Date(),
                    updated_at: new Date(),
                    sales_person_name: salesPersonName,
                    lead_name: existingLead.name_of_lead
                };
                await conversations.findOneAndUpdate(
                    {
                        sales_user_id: salesUserId,
                        lead_id: leadId
                    },
                    {
                        $push: { conversations: newConversationEntry },
                        $set: { last_updated: new Date() }
                    },
                    {
                        upsert: true,
                        new: true,
                        runValidators: true
                    }
                );
            } catch (error) {
                console.error('Error saving conversation:', error);
                // Don't fail the main update if conversation save fails
            }
        }

        console.log('Lead updated successfully');

        res.status(200).json({
            success: true,
            message: "Lead updated successfully",
            data: updatedLead
        });
    } catch (error: any) {
        console.error("Error updating lead:", error);
        
        // Handle specific mongoose validation errors
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err: any) => err.message);
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: validationErrors
            });
            return;
        }

        // Handle invalid ObjectId
        if (error.name === 'CastError') {
            res.status(400).json({
                success: false,
                message: "Invalid lead ID format"
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export default updateLead; 