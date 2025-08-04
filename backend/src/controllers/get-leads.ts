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

const getLeads = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Get the current user's ID from the authenticated request
        const currentUserId = req.userInfo?.userId;
        
        if (!currentUserId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }

        // Convert string userId to ObjectId for database query
        const userObjectId = new mongoose.Types.ObjectId(currentUserId);

        // Fetch leads created by the current sales person
        const leads = await AddNewLead.find({ created_by: userObjectId })
            .sort({ created_at: -1 }) // Sort by newest first
            .lean();

        res.status(200).json({
            success: true,
            message: "Leads fetched successfully",
            leads: leads
        });
    } catch (error: any) {
        console.error("Error fetching leads:", error);
        
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export default getLeads; 