import { Request, Response } from "express";
import AddNewLead from "../models/AddNewLead";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
    userInfo?: {
        userId: string;
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

        // Get the current user's ID and role from the authenticated request
        const currentUserId = req.userInfo?.userId;
        const currentUserRole = req.userInfo?.role;
        
        if (!currentUserId) {
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

        // Convert string userId to ObjectId for database query
        const userObjectId = new mongoose.Types.ObjectId(currentUserId);

        // Find the lead and check if it exists
        let existingLead;
        
        if (currentUserRole === 'admin') {
            // Admins can update any lead
            existingLead = await AddNewLead.findById(leadId);
        } else {
            // Sales users can update leads that are assigned to them (created_by field)
            existingLead = await AddNewLead.findOne({ 
                _id: leadId, 
                created_by: userObjectId 
            });
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

        console.log('Updating lead:', leadId, 'for user:', currentUserId);
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