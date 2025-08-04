"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AddNewLead_1 = __importDefault(require("../models/AddNewLead"));
const mongoose_1 = __importDefault(require("mongoose"));
const updateLead = async (req, res) => {
    try {
        const { leadId } = req.params;
        const { intrested, follow_up_conversation, status } = req.body;
        const currentUserId = req.userInfo?.userId;
        const currentUserRole = req.userInfo?.role;
        if (!currentUserId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }
        if (!intrested || !status) {
            res.status(400).json({
                success: false,
                message: "Interest level and status are required fields"
            });
            return;
        }
        const userObjectId = new mongoose_1.default.Types.ObjectId(currentUserId);
        let existingLead;
        if (currentUserRole === 'admin') {
            existingLead = await AddNewLead_1.default.findById(leadId);
        }
        else {
            existingLead = await AddNewLead_1.default.findOne({
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
        const updatedLead = await AddNewLead_1.default.findByIdAndUpdate(leadId, {
            intrested,
            follow_up_conversation,
            status,
            updated_at: new Date()
        }, { new: true, runValidators: true });
        console.log('Lead updated successfully');
        res.status(200).json({
            success: true,
            message: "Lead updated successfully",
            data: updatedLead
        });
    }
    catch (error) {
        console.error("Error updating lead:", error);
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map((err) => err.message);
            res.status(400).json({
                success: false,
                message: "Validation error",
                errors: validationErrors
            });
            return;
        }
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
};
exports.default = updateLead;
//# sourceMappingURL=update-lead.js.map