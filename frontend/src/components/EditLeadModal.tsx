import React, { useState, useEffect } from 'react';
import { X, Save, User, Building, Phone, Mail, Award,  FileText, Eye, Share2, Users, MessageSquare } from 'lucide-react';
import API from '../api/axios';
import ConversationHistory from './ConversationHistory';

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
  intrested: 'HOT' | 'COLD' | 'WARM' | 'NOT INTERESTED';
  follow_up_conversation: string;
  status: 'Open' | 'Close';
  created_by: string;
  created_at: string;
  updated_at: string;
}

interface EditLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: LeadData | null;
  onUpdate: (updatedLead: LeadData) => void;
}

const EditLeadModal: React.FC<EditLeadModalProps> = ({ isOpen, onClose, lead, onUpdate }) => {
  const [formData, setFormData] = useState<Partial<LeadData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [originalFollowUp, setOriginalFollowUp] = useState<string>('');
  const [isConversationHistoryOpen, setIsConversationHistoryOpen] = useState(false);

  useEffect(() => {
    if (lead) {
      setFormData({
        intrested: lead.intrested,
        follow_up_conversation: lead.follow_up_conversation,
        status: lead.status
      });
      setOriginalFollowUp(lead.follow_up_conversation);
      setErrors({});
    }
  }, [lead]);

  const handleInputChange = (field: keyof LeadData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.intrested) newErrors.intrested = 'Interest level is required';
    if (!formData.status) newErrors.status = 'Status is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveConversation = async (conversationNotes: string) => {
    if (!lead || !conversationNotes.trim()) return;
    
    try {
      console.log('Saving conversation for lead:', lead._id, 'Notes:', conversationNotes);
      const response = await API.post('/sales/conversations/add', {
        lead_id: lead._id,
        conversation_notes: conversationNotes
      });
      console.log('Conversation saved successfully:', response.data);
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !lead) return;

    setIsLoading(true);
    try {
      const response = await API.put(`/sales/leads/${lead._id}`, formData);
      
      if (response.data.success) {
        // Check if follow up conversation has changed and save to conversation history
        if (formData.follow_up_conversation && 
            formData.follow_up_conversation !== originalFollowUp &&
            formData.follow_up_conversation.trim()) {
          console.log('Conversation changed, saving to history...');
          await saveConversation(formData.follow_up_conversation);
        }
        
        onUpdate(response.data.data);
        onClose();
      }
    } catch (error: any) {
      console.error('Error updating lead:', error);
      if (error.response?.data?.errors) {
        const apiErrors: Record<string, string> = {};
        error.response.data.errors.forEach((err: string) => {
          // Map API errors to form fields
          if (err.includes('intrested')) apiErrors.intrested = err;
          else if (err.includes('status')) apiErrors.status = err;
        });
        setErrors(apiErrors);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="fixed inset-0 bg-[#000000B3] bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Eye className="w-5 h-5" />
            View & Edit Lead
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Type of Lead - Read Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Award className="w-4 h-4 inline mr-2" />
                Type of Lead
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                {lead.type_of_lead}
              </div>
            </div>

            {/* Project Name - Read Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Name
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                {lead.project_name}
              </div>
            </div>

            {/* Name of Lead - Read Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Name of Lead
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                {lead.name_of_lead}
              </div>
            </div>

            {/* Designation - Read Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Designation
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                {lead.designation_of_lead}
              </div>
            </div>

            {/* Company Name - Read Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="w-4 h-4 inline mr-2" />
                Company Name
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                {lead.company_name}
              </div>
            </div>

            {/* Phone Number - Read Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Phone Number
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                {lead.phone_number_of_lead}
              </div>
            </div>

            {/* Email - Read Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                {lead.email_of_lead}
              </div>
            </div>

            {/* Status - Editable */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                value={formData.status || ''}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.status ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Status</option>
                <option value="Open">Open</option>
                <option value="Close">Close</option>
              </select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status}</p>
              )}
            </div>

            

            {/* Interest Level - Editable */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interest Level *
              </label>
              <select
                value={formData.intrested || ''}
                onChange={(e) => handleInputChange('intrested', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.intrested ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select Interest Level</option>
                <option value="COLD">COLD</option>
                <option value="WARM">WARM</option>
                <option value="HOT">HOT</option>
                <option value="NOT INTERESTED">NOT INTERESTED</option>
              </select>
              {errors.intrested && (
                <p className="text-red-500 text-sm mt-1">{errors.intrested}</p>
              )}
            </div>

            {/* Source of Lead - Read Only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Share2 className="w-4 h-4 inline mr-2" />
                Source of Lead
              </label>
              <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                {lead.source_of_lead}
              </div>
            </div>
          </div>

          {/* Reference Fields - Only show if source is referral */}
          {lead.source_of_lead === "referral" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Reference Name - Read Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="w-4 h-4 inline mr-2" />
                  Reference Name
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                  {lead.reference_name || 'N/A'}
                </div>
              </div>

              {/* Reference Phone Number - Read Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-2" />
                  Reference Phone Number
                </label>
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700">
                  {lead.reference_phone_number || 'N/A'}
                </div>
              </div>
            </div>
          )}

          {/* Follow Up Conversation - Editable */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                <FileText className="w-4 h-4 inline mr-2" />
                Follow Up Conversation
              </label>
              <button
                type="button"
                onClick={() => setIsConversationHistoryOpen(true)}
                className="flex items-center gap-1 px-2 py-1 bg-purple-600 text-white rounded text-xs hover:bg-purple-700 transition-colors"
              >
                <MessageSquare size={12} />
                View History
              </button>
            </div>
            <textarea
              value={formData.follow_up_conversation || ''}
              onChange={(e) => handleInputChange('follow_up_conversation', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter follow up conversation notes..."
            />
            <p className="text-xs text-gray-500 mt-1">
              This conversation will be automatically saved to the conversation history when you update the lead.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              <Save size={16} />
              {isLoading ? 'Updating...' : 'Update Lead'}
            </button>
          </div>
        </form>
      </div>

      {/* Conversation History Modal */}
      <ConversationHistory
        isOpen={isConversationHistoryOpen}
        onClose={() => setIsConversationHistoryOpen(false)}
        leadId={lead?._id || ''}
        leadName={lead?.name_of_lead || ''}
      />
    </div>
  );
};

export default EditLeadModal; 