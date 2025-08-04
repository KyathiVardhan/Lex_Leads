import { Request, Response } from "express";
import CustomLeadType from "../models/CustomLeadType";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
    userInfo?: {
        userId: string;
        userName: string;
        role: string;
    };
}

const getCustomLeadTypes = async (req: AuthenticatedRequest, res: Response) => {
    try {
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

        // Get custom lead types for the current sales user
        const customTypes = await CustomLeadType.find({ sales_user_id: userObjectId })
            .select('custom_type')
            .sort({ created_at: -1 });

        const customTypeNames = customTypes.map(type => type.custom_type);

        res.status(200).json({
            success: true,
            data: customTypeNames
        });
    } catch (error: any) {
        console.error("Error fetching custom lead types:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

export default getCustomLeadTypes; 