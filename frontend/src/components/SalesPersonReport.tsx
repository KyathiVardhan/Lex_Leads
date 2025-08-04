import { useState, useMemo, useEffect } from "react";
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
  MessageSquare,

} from "lucide-react";
import API from "../api/axios";
import EditLeadModal from "./EditLeadModal";
import ConversationHistory from "./ConversationHistory";


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
}

interface Column {
  key: keyof LeadData;
  label: string;
}

interface ColumnVisibility {
  type_of_lead: boolean;
  project_name: boolean;
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
  actions: boolean;
}

interface QuickEditData {
  intrested: "HOT" | "COLD" | "WARM" | "NOT INTERESTED";
  follow_up_conversation: string;
  status: "Open" | "Close";
}

const SalesPersonReport = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<LeadData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
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
  });
  const [globalFilter, setGlobalFilter] = useState("");
  const [showColumnMenu, setShowColumnMenu] = useState(false);
  const [editingLead, setEditingLead] = useState<LeadData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Conversation history states
  const [isConversationHistoryOpen, setIsConversationHistoryOpen] = useState(false);
  const [selectedLeadForHistory, setSelectedLeadForHistory] = useState<LeadData | null>(null);

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

      if (!token || role !== "sales") {
        navigate("/");
        return;
      }

      try {
        // Fetch leads data from API
        const response = await API.get("/sales/leads");
        setLeads(response.data.leads || []);
      } catch (error) {
        console.error("Error fetching leads:", error);
        // For now, use sample data if API fails
        setLeads([]);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  useEffect(() => {
    const fetchPreferences = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await API.get("/sales/column-preferences", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success && res.data.data) {
          setColumnVisibility(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch column preferences", err);
      }
    };
    fetchPreferences();
  }, []);

  useEffect(() => {
    if (!leads.length) return; // Only save after initial load
    const token = localStorage.getItem("token");
    if (!token) return;
    const savePreferences = async () => {
      try {
        await API.put(
          "/sales/column-preferences",
          { columnPreferences: columnVisibility },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Failed to save column preferences", err);
      }
    };
    savePreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnVisibility]);

  const handleBackToDashboard = () => {
    navigate("/sales/dashboard");
  };

  const handleEditLead = (lead: LeadData) => {
    setEditingLead(lead);
    setIsEditModalOpen(true);
  };

  const handleViewConversationHistory = (lead: LeadData) => {
    setSelectedLeadForHistory(lead);
    setIsConversationHistoryOpen(true);
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
    console.log('Starting quick edit for lead:', lead._id);
    setQuickEditingId(lead._id);
    setQuickEditData({
      intrested: lead.intrested,
      follow_up_conversation: lead.follow_up_conversation,
      status: lead.status,
    });
    console.log('Quick edit data set:', {
      intrested: lead.intrested,
      follow_up_conversation: lead.follow_up_conversation,
      status: lead.status,
    });
  };

  const handleQuickEditChange = (field: keyof QuickEditData, value: string) => {
    console.log('Quick edit change:', field, value);
    setQuickEditData((prev) => ({ ...prev, [field]: value }));
  };

  const saveConversation = async (conversationNotes: string) => {
    if (!quickEditingId || !conversationNotes.trim()) return;
    
    try {
      console.log('Saving conversation for lead:', quickEditingId, 'Notes:', conversationNotes);
      const response = await API.post('/sales/conversations/add', {
        lead_id: quickEditingId,
        conversation_notes: conversationNotes
      });
      console.log('Conversation saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  const hasQuickEditChanges = (lead: LeadData) => {
    if (quickEditingId !== lead._id) return false;
    
    const hasChanges = (
      quickEditData.intrested !== lead.intrested ||
      quickEditData.follow_up_conversation !== lead.follow_up_conversation ||
      quickEditData.status !== lead.status
    );
    
    console.log('Checking changes for lead:', lead._id, 'Has changes:', hasChanges);
    console.log('Current quickEditData:', quickEditData);
    console.log('Original lead data:', {
      intrested: lead.intrested,
      follow_up_conversation: lead.follow_up_conversation,
      status: lead.status,
    });
    
    return hasChanges;
  };

  const handleQuickEditSave = async () => {
    if (!quickEditingId) return;

    console.log('Saving quick edit for lead:', quickEditingId);
    console.log('Quick edit data to save:', quickEditData);

    setIsQuickEditLoading(true);
    try {
      const response = await API.put(`/sales/leads/${quickEditingId}`, quickEditData);

      console.log('API Response:', response);

      if (response.data.success) {
        console.log('Quick edit saved successfully:', response.data);
        
        // Check if follow up conversation has changed and save to conversation history
        const originalLead = leads.find(lead => lead._id === quickEditingId);
        if (originalLead && 
            quickEditData.follow_up_conversation !== originalLead.follow_up_conversation &&
            quickEditData.follow_up_conversation.trim()) {
          console.log('Conversation changed in quick edit, saving to history...');
          await saveConversation(quickEditData.follow_up_conversation);
        }

        setLeads((prevLeads) =>
          prevLeads.map((lead) =>
            lead._id === quickEditingId ? response.data.data : lead
          )
        );
        setQuickEditingId(null);
        setQuickEditData({
          intrested: "COLD",
          follow_up_conversation: "",
          status: "Open",
        });
      } else {
        console.error('API returned success: false:', response.data);
      }
    } catch (error: any) {
      console.error("Error updating lead:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
    } finally {
      setIsQuickEditLoading(false);
    }
  };

  const handleQuickEditCancel = () => {
    setQuickEditingId(null);
  };

  const filteredLeads = useMemo(() => {
    const filtered = leads.filter((lead) =>
      Object.values(lead).some((value) =>
        value?.toString().toLowerCase().includes(globalFilter.toLowerCase())
      )
    );

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
  }, [leads, globalFilter]);

  const columns: Column[] = [
    { key: "type_of_lead", label: "Type" },
    { key: "project_name", label: "Project" },
    { key: "name_of_lead", label: "Name" },
    { key: "designation_of_lead", label: "Designation" },
    { key: "company_name", label: "Company" },
    { key: "phone_number_of_lead", label: "Phone" },
    { key: "email_of_lead", label: "Email" },
    { key: "source_of_lead", label: "Source" },
    { key: "reference_name", label: "Reference Name" },
    { key: "reference_phone_number", label: "Reference Phone" },
    { key: "intrested", label: "Interest" },
    { key: "follow_up_conversation", label: "Follow Up Conversation" },
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
              Sales Leads Report
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              View and manage your leads
            </p>
          </div>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        {/* Report Table */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Sales Leads Report
            </h3>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search leads..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
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
                      <label className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer rounded">
                        <input
                          type="checkbox"
                          checked={columnVisibility.actions}
                          onChange={(e) =>
                            setColumnVisibility((prev) => ({
                              ...prev,
                              actions: e.target.checked,
                            }))
                          }
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">Actions</span>
                      </label>
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
                  {columnVisibility.actions && (
                    <th className="px-4 py-3 text-left font-medium text-gray-900 text-sm">
                      Actions
                    </th>
                  )}
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
                        ).length + (columnVisibility.actions ? 1 : 0)
                      }
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-4xl mb-2">📊</div>
                        {leads.length === 0
                          ? "No leads found. Add your first lead!"
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
                      {columnVisibility.actions && (
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {quickEditingId === lead._id ? (
                              <>
                                <button
                                  onClick={handleQuickEditSave}
                                  disabled={
                                    isQuickEditLoading ||
                                    !hasQuickEditChanges(lead)
                                  }
                                  className="flex items-center gap-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  <Save size={12} />
                                  {isQuickEditLoading ? "Saving..." : "Update"}
                                </button>
                                <button
                                  onClick={handleQuickEditCancel}
                                  className="flex items-center gap-1 px-2 py-1 bg-gray-500 text-white rounded text-xs hover:bg-gray-600 transition-colors"
                                >
                                  <X size={12} />
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => handleQuickEdit(lead)}
                                  className="flex items-center gap-1 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                                >
                                  <Edit size={12} />
                                  Quick Edit
                                </button>
                                <button
                                  onClick={() => handleEditLead(lead)}
                                  className="flex items-center gap-1 px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700 transition-colors"
                                >
                                  <Edit size={12} />
                                  View Edit
                                </button>
                                <button
                                  onClick={() => handleViewConversationHistory(lead)}
                                  className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors"
                                >
                                  <MessageSquare size={12} />
                                  History
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      )}
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

      {/* Conversation History Modal */}
      <ConversationHistory
        isOpen={isConversationHistoryOpen}
        onClose={() => {
          setIsConversationHistoryOpen(false);
          setSelectedLeadForHistory(null);
        }}
        leadId={selectedLeadForHistory?._id || ''}
        leadName={selectedLeadForHistory?.name_of_lead || ''}
      />

    </div>
  );
};

export default SalesPersonReport;
