import { Request, Response } from "express";
import AddNewLead from "../models/AddNewLead";
import CustomLeadType from "../models/CustomLeadType";
import mongoose from "mongoose";

interface AuthenticatedRequest extends Request {
    userInfo?: {
        userId: string;
        userName: string;
        role: string;
    };
}

const addLeadsToSales = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const {
            type_of_lead,
            custom_type,
            project_name,
            name_of_lead,
            designation_of_lead,
            company_name,
            phone_number_of_lead,
            email_of_lead,
            source_of_lead,
            reference_name,
            reference_phone_number,
            intrested = 'COLD', // Default value
            follow_up_conversation = '', // Default value
            status = 'Open' // Default value
        } = req.body;

        // Get the current user's ID from the authenticated request
        const currentUserId = req.userInfo?.userId;
        
        if (!currentUserId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }

        // Validate required fields
        if (!type_of_lead || !project_name || !name_of_lead || !designation_of_lead || !company_name || !phone_number_of_lead || !email_of_lead) {
            res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
            return;
        }

        // If type_of_lead is "other", custom_type is required
        if (type_of_lead === "other" && !custom_type) {
            res.status(400).json({
                success: false,
                message: "Custom type is required when 'other' is selected"
            });
            return;
        }

        // Determine the final type_of_lead value
        let finalTypeOfLead = type_of_lead;
        if (type_of_lead === "other" && custom_type) {
            finalTypeOfLead = custom_type;
        }

        // Convert string userId to ObjectId for database storage
        const userObjectId = new mongoose.Types.ObjectId(currentUserId);

        const newLead = new AddNewLead({
            type_of_lead: finalTypeOfLead,
            project_name,
            name_of_lead,
            designation_of_lead,
            company_name,
            phone_number_of_lead,
            email_of_lead,
            source_of_lead,
            reference_name,
            reference_phone_number,
            intrested,
            follow_up_conversation,
            status,
            created_by: userObjectId
        });

        await newLead.save();

        // If it's a custom type, save it to the custom lead types collection
        if (type_of_lead === "other" && custom_type) {
            try {
                const customLeadType = new CustomLeadType({
                    sales_user_id: userObjectId,
                    custom_type: custom_type
                });
                await customLeadType.save();
            } catch (error: any) {
                // If it's a duplicate key error, ignore it (custom type already exists)
                if (error.code !== 11000) {
                    console.error("Error saving custom lead type:", error);
                }
            }
        }

        res.status(201).json({
            success: true,
            message: "Lead added successfully",
            data: {
                type_of_lead: finalTypeOfLead,
                project_name,
                name_of_lead,
                designation_of_lead,
                company_name,
                phone_number_of_lead,
                email_of_lead,
                source_of_lead,
                reference_name,
                reference_phone_number,
                intrested,
                follow_up_conversation,
                status,
                created_by: currentUserId
            }
        });
    } catch (error: any) {
        console.error("Error adding lead:", error);
        
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

        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
}

export default addLeadsToSales;