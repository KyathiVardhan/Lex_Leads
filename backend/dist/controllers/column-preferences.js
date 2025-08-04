"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveColumnPreferences = exports.getColumnPreferences = void 0;
const SalesUser_1 = __importDefault(require("../models/SalesUser"));
const getColumnPreferences = async (req, res) => {
    try {
        const userId = req.userInfo?.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        const user = await SalesUser_1.default.findById(userId).select('columnPreferences');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        const defaultPreferences = {
            type_of_lead: true,
            project_name: true,
            name_of_lead: true,
            designation_of_lead: true,
            company_name: true,
            phone_number_of_lead: true,
            email_of_lead: true,
            source_of_lead: true,
            reference_name: false,
            reference_phone_number: false,
            intrested: true,
            follow_up_conversation: true,
            status: true,
            created_at: true,
            actions: true,
        };
        res.status(200).json({
            success: true,
            data: user.columnPreferences || defaultPreferences
        });
    }
    catch (error) {
        console.error('Error getting column preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.getColumnPreferences = getColumnPreferences;
const saveColumnPreferences = async (req, res) => {
    try {
        const userId = req.userInfo?.userId;
        const { columnPreferences } = req.body;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'User not authenticated'
            });
            return;
        }
        if (!columnPreferences || typeof columnPreferences !== 'object') {
            res.status(400).json({
                success: false,
                message: 'Column preferences are required'
            });
            return;
        }
        const requiredFields = [
            'type_of_lead', 'project_name', 'name_of_lead', 'designation_of_lead',
            'company_name', 'phone_number_of_lead', 'email_of_lead', 'source_of_lead',
            'reference_name', 'reference_phone_number', 'intrested', 'follow_up_conversation',
            'status', 'created_at', 'actions'
        ];
        for (const field of requiredFields) {
            if (typeof columnPreferences[field] !== 'boolean') {
                res.status(400).json({
                    success: false,
                    message: `Invalid value for ${field}. Must be a boolean.`
                });
                return;
            }
        }
        const user = await SalesUser_1.default.findByIdAndUpdate(userId, {
            columnPreferences,
            updatedAt: new Date()
        }, { new: true }).select('columnPreferences');
        if (!user) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Column preferences saved successfully',
            data: user.columnPreferences
        });
    }
    catch (error) {
        console.error('Error saving column preferences:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};
exports.saveColumnPreferences = saveColumnPreferences;
//# sourceMappingURL=column-preferences.js.map