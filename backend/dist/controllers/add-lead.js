"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AddNewLead_1 = __importDefault(require("../models/AddNewLead"));
const CustomLeadType_1 = __importDefault(require("../models/CustomLeadType"));
const mongoose_1 = __importDefault(require("mongoose"));
const addLeadsToSales = async (req, res) => {
    try {
        const { type_of_lead, custom_type, project_name, name_of_lead, designation_of_lead, company_name, phone_number_of_lead, email_of_lead, source_of_lead, reference_name, reference_phone_number, intrested = 'COLD', follow_up_conversation = '', status = 'Open' } = req.body;
        const currentUserId = req.userInfo?.userId;
        if (!currentUserId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }
        if (!type_of_lead || !project_name || !name_of_lead || !designation_of_lead || !company_name || !phone_number_of_lead || !email_of_lead) {
            res.status(400).json({
                success: false,
                message: "All required fields must be provided"
            });
            return;
        }
        if (type_of_lead === "other" && !custom_type) {
            res.status(400).json({
                success: false,
                message: "Custom type is required when 'other' is selected"
            });
            return;
        }
        let finalTypeOfLead = type_of_lead;
        if (type_of_lead === "other" && custom_type) {
            finalTypeOfLead = custom_type;
        }
        const userObjectId = new mongoose_1.default.Types.ObjectId(currentUserId);
        const newLead = new AddNewLead_1.default({
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
        if (type_of_lead === "other" && custom_type) {
            try {
                const customLeadType = new CustomLeadType_1.default({
                    sales_user_id: userObjectId,
                    custom_type: custom_type
                });
                await customLeadType.save();
            }
            catch (error) {
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
    }
    catch (error) {
        console.error("Error adding lead:", error);
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
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
};
exports.default = addLeadsToSales;
//# sourceMappingURL=add-lead.js.map