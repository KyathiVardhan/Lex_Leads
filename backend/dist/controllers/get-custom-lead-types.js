"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const CustomLeadType_1 = __importDefault(require("../models/CustomLeadType"));
const mongoose_1 = __importDefault(require("mongoose"));
const getCustomLeadTypes = async (req, res) => {
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
        const customTypes = await CustomLeadType_1.default.find({ sales_user_id: userObjectId })
            .select('custom_type')
            .sort({ created_at: -1 });
        const customTypeNames = customTypes.map(type => type.custom_type);
        res.status(200).json({
            success: true,
            data: customTypeNames
        });
    }
    catch (error) {
        console.error("Error fetching custom lead types:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};
exports.default = getCustomLeadTypes;
//# sourceMappingURL=get-custom-lead-types.js.map