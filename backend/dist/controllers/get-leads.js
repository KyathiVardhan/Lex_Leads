"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AddNewLead_1 = __importDefault(require("../models/AddNewLead"));
const mongoose_1 = __importDefault(require("mongoose"));
const getLeads = async (req, res) => {
    try {
        const currentUserId = req.userInfo?.userId;
        if (!currentUserId) {
            res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
            return;
        }
        const userObjectId = new mongoose_1.default.Types.ObjectId(currentUserId);
        const leads = await AddNewLead_1.default.find({ created_by: userObjectId })
            .sort({ created_at: -1 })
            .lean();
        res.status(200).json({
            success: true,
            message: "Leads fetched successfully",
            leads: leads
        });
    }
    catch (error) {
        console.error("Error fetching leads:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
exports.default = getLeads;
//# sourceMappingURL=get-leads.js.map