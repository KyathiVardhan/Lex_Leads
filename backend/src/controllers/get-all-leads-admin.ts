import { Request, Response } from "express";
import AddNewLead from "../models/AddNewLead";
import SalesUser from "../models/SalesUser";
import { Types } from "mongoose";

const getAllLeadsForAdmin = async (req: Request, res: Response) => {
  try {
    // Fetch all leads and populate the created_by field with sales person's name and email
    const leads = await AddNewLead.find()
      .sort({ created_at: -1 })
      .populate("created_by", "name email")
      .lean();

    // Fetch sales users data
    const salesUsers = await SalesUser.find().lean();

    // Type for populated created_by
    type PopulatedLead = typeof leads[number] & {
      created_by?: { _id: Types.ObjectId | string; name?: string; email?: string } | Types.ObjectId | string;
    };

    const leadsWithSalesPerson = (leads as PopulatedLead[]).map((lead) => {
      let sales_person_name = "";
      let sales_person_email = "";
      let created_by_id = lead.created_by;
      if (lead.created_by && typeof lead.created_by === "object" && "name" in lead.created_by) {
        sales_person_name = (lead.created_by as any).name || "";
        sales_person_email = (lead.created_by as any).email || "";
        created_by_id = (lead.created_by as any)._id || lead.created_by;
      }
      return {
        ...lead,
        sales_person_name,
        sales_person_email,
        created_by: created_by_id,
      };
    });

    // Calculate performance metrics
    const totalLeads = leadsWithSalesPerson.length;
    const openLeads = leadsWithSalesPerson.filter(lead => lead.status === "Open").length;
    const closedLeads = leadsWithSalesPerson.filter(lead => lead.status === "Close").length;
    const hotLeads = leadsWithSalesPerson.filter(lead => lead.intrested === "HOT").length;
    const warmLeads = leadsWithSalesPerson.filter(lead => lead.intrested === "WARM").length;
    const coldLeads = leadsWithSalesPerson.filter(lead => lead.intrested === "COLD").length;
    const notInterestedLeads = leadsWithSalesPerson.filter(lead => lead.intrested === "NOT INTERESTED").length;
    const conversionRate = totalLeads > 0 ? ((closedLeads / totalLeads) * 100) : 0;

    // Calculate sales user metrics
    const totalSalesUsers = salesUsers.length;
    const activeSalesUsers = salesUsers.filter(user => user.isActive).length;
    const salesPerformance = totalSalesUsers > 0 ? ((activeSalesUsers / totalSalesUsers) * 100) : 0;
    
    // Calculate this month's new users (users created in current month)
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
      // Sales user metrics
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
  } catch (error: any) {
    console.error("Error fetching all leads for admin:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default getAllLeadsForAdmin;