"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AddNewLead_1 = __importDefault(require("../models/AddNewLead"));
const SalesUser_1 = __importDefault(require("../models/SalesUser"));
const getAllLeadsForAdmin = async (_req, res) => {
    try {
        const leads = await AddNewLead_1.default.find()
            .sort({ created_at: -1 })
            .populate("created_by", "name email")
            .lean();
        const salesUsers = await SalesUser_1.default.find().lean();
        const leadsWithSalesPerson = leads.map((lead) => {
            let sales_person_name = "";
            let sales_person_email = "";
            let created_by_id = lead.created_by;
            if (lead.created_by && typeof lead.created_by === "object" && "name" in lead.created_by) {
                sales_person_name = lead.created_by.name || "";
                sales_person_email = lead.created_by.email || "";
                created_by_id = lead.created_by._id || lead.created_by;
            }
            return {
                ...lead,
                sales_person_name,
                sales_person_email,
                created_by: created_by_id,
            };
        });
        const totalLeads = leadsWithSalesPerson.length;
        const openLeads = leadsWithSalesPerson.filter(lead => lead.status === "Open").length;
        const closedLeads = leadsWithSalesPerson.filter(lead => lead.status === "Close").length;
        const hotLeads = leadsWithSalesPerson.filter(lead => lead.intrested === "HOT").length;
        const warmLeads = leadsWithSalesPerson.filter(lead => lead.intrested === "WARM").length;
        const coldLeads = leadsWithSalesPerson.filter(lead => lead.intrested === "COLD").length;
        const notInterestedLeads = leadsWithSalesPerson.filter(lead => lead.intrested === "NOT INTERESTED").length;
        const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100) : 0;
        const totalSalesUsers = salesUsers.length;
        const activeSalesUsers = salesUsers.filter(user => user.isActive).length;
        const salesPerformance = totalSalesUsers > 0 ? ((activeSalesUsers / totalSalesUsers) * 100) : 0;
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const thisMonthUsers = salesUsers.filter(user => {
            const userDate = new Date(user.createdAt);
            return userDate.getMonth() === currentMonth && userDate.getFullYear() === currentYear;
        }).length;
        const performanceMetrics = {
            totalLeads,
            openLeads,
            closedLeads,
            hotLeads,
            warmLeads,
            coldLeads,
            notInterestedLeads,
            conversionRate,
            totalSalesUsers,
            activeSalesUsers,
            salesPerformance,
            thisMonthUsers
        };
        res.status(200).json({
            success: true,
            message: "All leads fetched successfully",
            leads: leadsWithSalesPerson,
            performanceMetrics
        });
    }
    catch (error) {
        console.error("Error fetching all leads for admin:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
};
exports.default = getAllLeadsForAdmin;
//# sourceMappingURL=get-all-leads-admin.js.map