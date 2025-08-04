import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronDown,
  Eye,
  Search,
  ArrowLeft,
  User,
  Building,
  Phone,
  Mail,
  Award,
  Calendar,
  Edit,
  Save,
  X,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  CheckCircle,
  XCircle,

} from "lucide-react";
import API from "../api/axios";
import EditLeadModal from "./EditLeadModal";


// Lead data interface
interface LeadData {
  _id: string;
  type_of_lead: string;
  project_name: string;
  name_of_lead: string;
  designation_of_lead: string;
  company_name: string;
  phone_number_of_lead: string;
  email_of_lead: string;
  source_of_lead: string;
  reference_name: string;
  reference_phone_number: string;
  intrested: "HOT" | "COLD" | "WARM" | "NOT INTERESTED";
  follow_up_conversation: string;
  status: "Open" | "Close";
  created_by: string;
  created_at: string;
  updated_at: string;
  sales_person_name?: string; // Added for admin view
  sales_person_email?: string; // Added for admin view
}

interface Column {
  key: keyof LeadData;
  label: string;
}

interface ColumnVisibility {
  type_of_lead: boolean;
  project_name: boolean;
  created_by: boolean;
  name_of_lead: boolean;
  designation_of_lead: boolean;
  company_name: boolean;
  phone_number_of_lead: boolean;
  email_of_lead: boolean;
  source_of_lead: boolean;
  reference_name: boolean;
  reference_phone_number: boolean;
  intrested: boolean;
  follow_up_conversation: boolean;
  status: boolean;
  created_at: boolean;
}

interface QuickEditData {
  intrested: "HOT" | "COLD" | "WARM" | "NOT INTERESTED";
  follow_up_conversation: string;
  status: "Open" | "Close";
}

interface PerformanceMetrics {
  totalLeads: number;
  openLeads: number;
  closedLeads: number;
  hotLeads: number;
  warmLeads: number;
  coldLeads: number;
  notInterestedLeads: number;
  conversionRate: number;
}

const AdminLeadsReport = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [salesPersons, setSalesPersons] = useState<string[]>([]);

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    type_of_lead: true,
    project_name: true,
    created_by: true,
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
  });

  const [globalFilter, setGlobalFilter] = useState("");
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);



  // Admin-specific filters
  const [selectedSalesPerson, setSelectedSalesPerson] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedInterest, setSelectedInterest] = useState<string>("all");
  const [selectedLeadType, setSelectedLeadType] = useState<string>("all");

  // Quick edit states
  const [quickEditingId, setQuickEditingId] = useState<string | null>(null);
  const [quickEditData, setQuickEditData] = useState<QuickEditData>({
    intrested: "COLD",
    follow_up_conversation: "",
    status: "Open",
  });
  const [isQuickEditLoading, setIsQuickEditLoading] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token || role !== "admin") {
        navigate("/");
        return;
      }

      try {
        // Fetch all leads data from API
        const response = await API.get("/admin/leads");
        setLeads(response.data.leads || []);

        // Extract unique sales persons
        const uniqueSalesPersons = [
          ...new Set(
            response.data.leads?.map((lead: LeadData) => lead.created_by) || []
          ),
        ] as string[];
        setSalesPersons(uniqueSalesPersons);
      } catch (error) {
        console.error("Error fetching leads:", error);
        setLeads([]);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleBackToDashboard = () => {
    navigate("/admin/dashboard");
  };

  const handleEditLead = (lead: LeadData) => {
    setEditingLead(lead);
    setIsEditModalOpen(true);
  };



  const handleUpdateLead = (updatedLead: LeadData) => {
    setLeads((prevLeads) =>
      prevLeads.map((lead) =>
        lead._id === updatedLead._id ? updatedLead : lead
      )
    );
  };

  // Quick edit functions
  const handleQuickEdit = (lead: LeadData) => {
    setQuickEditingId(lead._id);
    setQuickEditData({
      intrested: lead.intrested,
      follow_up_conversation: lead.follow_up_conversation,
      status: lead.status,
    });
  };

  const handleQuickEditChange = (field: keyof QuickEditData, value: string) => {
    setQuickEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuickEditSave = async () => {
    if (!quickEditingId) return;

    setIsQuickEditLoading(true);
    try {
      const currentLead = leads.find((lead) => lead._id === quickEditingId);
      if (!currentLead) {
        console.error("Lead not found");
        return;
      }

      const response = await API.put(`/admin/leads/${quickEditingId}`, {
        ...currentLead,
        ...quickEditData,
      });

      if (response.data.success) {
        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead._id === quickEditingId ? response.data.data : lead
          )
        );
        setQuickEditingId(null);
      }
    } catch (error) {
      console.error("Error updating lead:", error);
    } finally {
      setIsQuickEditLoading(false);
    }
  };

  const handleQuickEditCancel = () => {
    setQuickEditingId(null);
  };

  const hasQuickEditChanges = (lead: LeadData) => {
    return (
      quickEditData.intrested !== lead.intrested ||
      quickEditData.follow_up_conversation !== lead.follow_up_conversation ||
      quickEditData.status !== lead.status
    );
  };

  // Calculate performance metrics
  const performanceMetrics = useMemo((): PerformanceMetrics => {
    const total = leads.length;
    const open = leads.filter((lead) => lead.status === "Open").length;
    const closed = leads.filter((lead) => lead.status === "Close").length;
    const hot = leads.filter((lead) => lead.intrested === "HOT").length;
    const warm = leads.filter((lead) => lead.intrested === "WARM").length;
    const cold = leads.filter((lead) => lead.intrested === "COLD").length;
    const notInterested = leads.filter(
      (lead) => lead.intrested === "NOT INTERESTED"
    ).length;
    const conversionRate = total > 0 ? (closed / total) * 100 : 0;

    return {
      totalLeads: total,
      openLeads: open,
      closedLeads: closed,
      hotLeads: hot,
      warmLeads: warm,
      coldLeads: cold,
      notInterestedLeads: notInterested,
      conversionRate: conversionRate,
    };
  }, [leads]);

  const filteredLeads = useMemo(() => {
    let filtered = leads.filter((lead) => {
      const searchTerm = globalFilter.toLowerCase();
      return (
        (lead.sales_person_name || lead.created_by || "").toLowerCase().includes(searchTerm) ||
        (lead.name_of_lead || "").toLowerCase().includes(searchTerm) ||
        (lead.company_name || "").toLowerCase().includes(searchTerm) ||
        (lead.project_name || "").toLowerCase().includes(searchTerm) ||
        (lead.type_of_lead || "").toLowerCase().includes(searchTerm) ||
        (lead.phone_number_of_lead || "").toLowerCase().includes(searchTerm) ||
        (lead.email_of_lead || "").toLowerCase().includes(searchTerm)
      );
    });

    // Apply filters
    if (selectedStatus !== "all") {
      filtered = filtered.filter((lead) => lead.status === selectedStatus);
    }

    if (selectedInterest !== "all") {
      filtered = filtered.filter((lead) => lead.intrested === selectedInterest);
    }

    if (selectedLeadType !== "all") {
      if (selectedLeadType === "other") {
        // For "other", show all types except lead, speaker, sponsor, awards
        filtered = filtered.filter(
          (lead) => !["lead", "speaker", "sponsor", "awards"].includes(lead.type_of_lead)
        );
      } else {
        // For specific types, filter normally
        filtered = filtered.filter(
          (lead) => lead.type_of_lead === selectedLeadType
        );
      }
    }

    // Sort by status first (Open first, Close last), then by interest priority
    return filtered.sort((a, b) => {
      // First sort by status: Open leads first, Close leads last
      if (a.status !== b.status) {
        return a.status === "Open" ? -1 : 1;
      }

      // Then sort by interest priority: HOT > WARM > COLD > NOT INTERESTED
      const priorityOrder = {
        HOT: 1,
        WARM: 2,
        COLD: 3,
        "NOT INTERESTED": 4,
      };

      const aPriority = priorityOrder[a.intrested] || 5;
      const bPriority = priorityOrder[b.intrested] || 5;

      return aPriority - bPriority;
    });
  }, [leads, globalFilter, selectedStatus, selectedInterest, selectedLeadType]);

  const columns: Column[] = [
    { key: "type_of_lead", label: "Type" },
    { key: "project_name", label: "Project" },
    { key: "created_by", label: "Sales Person" },
    { key: "name_of_lead", label: "Lead's Name" },
    { key: "designation_of_lead", label: "Designation" },
    { key: "company_name", label: "Company" },
    { key: "phone_number_of_lead", label: "Phone" },
    { key: "email_of_lead", label: "Email" },
    { key: "source_of_lead", label: "Source" },
    { key: "reference_name", label: "Reference Name" },
    { key: "reference_phone_number", label: "Reference Phone" },
    { key: "intrested", label: "Interest" },
    { key: "follow_up_conversation", label: "Follow Up" },
    { key: "status", label: "Status" },
    { key: "created_at", label: "Created" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-100 text-green-800 border border-green-200";
      case "Close":
        return "bg-red-100 text-red-800 border border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getInterestColor = (interest: string) => {
    switch (interest) {
      case "HOT":
        return "bg-red-100 text-red-800 border border-red-200";
      case "WARM":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "COLD":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "NOT INTERESTED":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200 font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Admin Leads Report
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Monitor all leads and team performance
            </p>
          </div>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Leads</p>
                <p className="text-2xl font-bold text-blue-900">
                  {performanceMetrics.totalLeads}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Open Leads</p>
                <p className="text-2xl font-bold text-green-900">
                  {performanceMetrics.openLeads}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600">Closed Leads</p>
                <p className="text-2xl font-bold text-red-900">
                  {performanceMetrics.closedLeads}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Conversion Rate
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {performanceMetrics.conversionRate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </div>
        </div>

        {/* Interest Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-red-600">HOT</p>
                <p className="text-lg font-bold text-red-900">
                  {performanceMetrics.hotLeads}
                </p>
              </div>
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-yellow-600">WARM</p>
                <p className="text-lg font-bold text-yellow-900">
                  {performanceMetrics.warmLeads}
                </p>
              </div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-blue-600">COLD</p>
                <p className="text-lg font-bold text-blue-900">
                  {performanceMetrics.coldLeads}
                </p>
              </div>
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600">
                  NOT INTERESTED
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {performanceMetrics.notInterestedLeads}
                </p>
              </div>
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Report Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              All Leads Report
            </h3>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Search size={16} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads, companies, sales persons..."
                  value={globalFilter}
                  onChange={(e) => setGlobalFilter(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
              {/* Remove Sales Person dropdown filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Open">Open</option>
                <option value="Close">Close</option>
              </select>
              <select
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Interest</option>
                <option value="HOT">HOT</option>
                <option value="WARM">WARM</option>
                <option value="COLD">COLD</option>
                <option value="NOT INTERESTED">NOT INTERESTED</option>
              </select>
              <select
                value={selectedLeadType}
                onChange={(e) => setSelectedLeadType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Types</option>
                <option value="lead">Lead</option>
                <option value="speaker">Speaker</option>
                <option value="sponsor">Sponsor</option>
                <option value="awards">Awards</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {filteredLeads.length} of {leads.length} leads
              </div>

              <div className="relative">
                <button
                  onClick={() => setShowColumnMenu(!showColumnMenu)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                >
                  <Eye size={16} />
                  <span className="hidden sm:inline">Columns</span>
                  <ChevronDown size={14} />
                </button>

                {showColumnMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-sm z-10">
                    <div className="p-2">
                      {columns.map((col) => (
                        <label
                          key={col.key}
                          className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer rounded"
                        >
                          <input
                            type="checkbox"
                            checked={
                              columnVisibility[
                                col.key as keyof ColumnVisibility
                              ]
                            }
                            onChange={(e) =>
                              setColumnVisibility((prev) => ({
                                ...prev,
                                [col.key]: e.target.checked,
                              }))
                            }
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm">{col.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map(
                    (col) =>
                      columnVisibility[col.key as keyof ColumnVisibility] && (
                        <th
                          key={col.key}
                          className="px-4 py-3 text-left font-medium text-gray-900 text-sm"
                        >
                          {col.label}
                        </th>
                      )
                  )}
                  <th className="px-4 py-3 text-left font-medium text-gray-900 text-sm">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={
                        columns.filter(
                          (col) =>
                            columnVisibility[col.key as keyof ColumnVisibility]
                        ).length + 1 // +1 for the Actions column
                      }
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-4xl mb-2">📊</div>
                        {leads.length === 0
                          ? "No leads found in the database."
                          : "No leads match your search criteria."}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr
                      key={lead._id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      {columnVisibility.type_of_lead && (
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
                            <Award className="w-3 h-3 mr-1" />
                            {lead.type_of_lead}
                          </span>
                        </td>
                      )}
                      {columnVisibility.project_name && (
                        <td className="px-4 py-3 font-medium text-gray-900">
                          {lead.project_name}
                        </td>
                      )}
                      {columnVisibility.created_by && (
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2 text-gray-400" />
                            <span
                              className="font-medium text-gray-900"
                              title={lead.sales_person_email || undefined}
                            >
                              {lead.sales_person_name || lead.created_by}
                            </span>
                          </div>
                        </td>
                      )}
                      {columnVisibility.name_of_lead && (
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {lead.name_of_lead}
                            </span>
                          </div>
                        </td>
                      )}
                      {columnVisibility.designation_of_lead && (
                        <td className="px-4 py-3 text-gray-700">
                          {lead.designation_of_lead}
                        </td>
                      )}
                      {columnVisibility.company_name && (
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Building className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="font-medium text-gray-900">
                              {lead.company_name}
                            </span>
                          </div>
                        </td>
                      )}
                      {columnVisibility.phone_number_of_lead && (
                        <td className="px-4 py-3 text-gray-600">
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            <a
                              href={`tel:${lead.phone_number_of_lead}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {lead.phone_number_of_lead}
                            </a>
                          </div>
                        </td>
                      )}
                      {columnVisibility.email_of_lead && (
                        <td className="px-4 py-3 text-gray-600">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            <a
                              href={`mailto:${lead.email_of_lead}`}
                              className="hover:text-blue-600 transition-colors"
                            >
                              {lead.email_of_lead}
                            </a>
                          </div>
                        </td>
                      )}
                      {columnVisibility.source_of_lead && (
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 border border-indigo-200">
                            {lead.source_of_lead && lead.source_of_lead.trim() ? lead.source_of_lead : '---'}
                          </span>
                        </td>
                      )}
                      {columnVisibility.reference_name && (
                        <td className="px-4 py-3 text-gray-700">
                          {lead.source_of_lead === "referral" 
                            ? (lead.reference_name && lead.reference_name.trim() ? lead.reference_name : '---')
                            : '---'
                          }
                        </td>
                      )}
                      {columnVisibility.reference_phone_number && (
                        <td className="px-4 py-3 text-gray-600">
                          {lead.source_of_lead === "referral" 
                            ? (lead.reference_phone_number && lead.reference_phone_number.trim() ? (
                                <a
                                  href={`tel:${lead.reference_phone_number}`}
                                  className="hover:text-blue-600 transition-colors"
                                >
                                  {lead.reference_phone_number}
                                </a>
                              ) : (
                                '---'
                              ))
                            : '---'
                          }
                        </td>
                      )}
                      {columnVisibility.intrested && (
                        <td className="px-4 py-3">
                          {quickEditingId === lead._id ? (
                            <select
                              value={quickEditData.intrested}
                              onChange={(e) =>
                                handleQuickEditChange(
                                  "intrested",
                                  e.target.value
                                )
                              }
                              className="w-38 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="COLD">COLD</option>
                              <option value="WARM">WARM</option>
                              <option value="HOT">HOT</option>
                              <option value="NOT INTERESTED">
                                NOT INTERESTED
                              </option>
                            </select>
                          ) : (
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getInterestColor(
                                lead.intrested
                              )}`}
                            >
                              {lead.intrested}
                            </span>
                          )}
                        </td>
                      )}
                      {columnVisibility.follow_up_conversation && (
                        <td className="px-4 py-3">
                          {quickEditingId === lead._id ? (
                            <textarea
                              value={quickEditData.follow_up_conversation}
                              onChange={(e) =>
                                handleQuickEditChange(
                                  "follow_up_conversation",
                                  e.target.value
                                )
                              }
                              className="w-64 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                              rows={3}
                              placeholder="Enter follow up notes..."
                            />
                          ) : (
                            <div
                              className="max-w-xs truncate text-gray-700"
                              title={lead.follow_up_conversation}
                            >
                              {lead.follow_up_conversation || "-"}
                            </div>
                          )}
                        </td>
                      )}
                      {columnVisibility.status && (
                        <td className="px-4 py-3">
                          {quickEditingId === lead._id ? (
                            <select
                              value={quickEditData.status}
                              onChange={(e) =>
                                handleQuickEditChange("status", e.target.value)
                              }
                              className="w-38 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="Open">Open</option>
                              <option value="Close">Close</option>
                            </select>
                          ) : (
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                lead.status
                              )}`}
                            >
                              {lead.status}
                            </span>
                          )}
                        </td>
                      )}
                      {columnVisibility.created_at && (
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-gray-700">
                              {formatDate(lead.created_at)}
                            </span>
                          </div>
                        </td>
                      )}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {quickEditingId === lead._id ? (
                            <>
                              <button
                                onClick={handleQuickEditSave}
                                disabled={isQuickEditLoading}
                                className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Save className="w-3 h-3" />
                                Save
                              </button>
                              <button
                                onClick={handleQuickEditCancel}
                                className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                              >
                                <X className="w-3 h-3" />
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleQuickEdit(lead)}
                                className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                              >
                                <Edit className="w-3 h-3" />
                                Quick Edit
                              </button>
                                                             <button
                                 onClick={() => handleEditLead(lead)}
                                 className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700"
                               >
                                 <Eye className="w-3 h-3" />
                                 View
                               </button>

                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditLeadModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingLead(null);
        }}
        lead={editingLead}
        onUpdate={handleUpdateLead}
      />


    </div>
  );
};

export default AdminLeadsReport;
