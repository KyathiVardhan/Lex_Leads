import React, { useState, useEffect } from 'react';
import { X, MessageSquare, Calendar, User } from 'lucide-react';
import API from '../api/axios';

interface ConversationEntry {
  conversation_notes: string;
  conversation_date: string;
  updated_at: string;
}

interface ConversationHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  leadId: string;
  leadName: string;
}

const ConversationHistory: React.FC<ConversationHistoryProps> = ({ 
  isOpen, 
  onClose, 
  leadId, 
  leadName 
}) => {
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && leadId) {
      fetchConversations();
    }
  }, [isOpen, leadId]);

  const fetchConversations = async () => {
    setIsLoading(true);
    try {
      const response = await API.get(`/sales/conversations/lead/${leadId}`);
      if (response.data.success) {
        setConversations(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Conversation History - {leadName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-gray-500">Loading conversations...</div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No conversation history found for this lead.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {conversations.map((conversation, index) => (
                <div
                  key={`${conversation.conversation_date}-${index}`}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">Sales Person</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {formatDate(conversation.conversation_date)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
                    <p className="text-gray-800 whitespace-pre-wrap">
                      {conversation.conversation_notes}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationHistory; 