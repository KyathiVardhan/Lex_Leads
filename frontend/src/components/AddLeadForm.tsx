import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Building,
  Phone,
  Mail,
  Briefcase,
  FolderOpen,
  Award,
  ArrowLeft,
  Share2,
  Users,
} from "lucide-react";
import API from "../api/axios";

interface FormData {
  type_of_lead: "lead" | "speaker" | "sponsor" | "awards" | "other" | "";
  custom_type: string;
  project_name: string;
  name_of_lead: string;
  designation_of_lead: string;
  company_name: string;
  phone_number_of_lead: string;
  email_of_lead: string;
  source_of_lead: "instagram" | "linkedin" | "referral" | "";
  reference_name: string;
  reference_phone_number: string;
}

interface FormErrors {
  [key: string]: string;
}

const AddLeadForm: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    type_of_lead: "",
    custom_type: "",
    project_name: "",
    name_of_lead: "",
    designation_of_lead: "",
    company_name: "",
    phone_number_of_lead: "",
    email_of_lead: "",
    source_of_lead: "",
    reference_name: "",
    reference_phone_number: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [customLeadTypes, setCustomLeadTypes] = useState<string[]>([]);

  const handleBackToDashboard = () => {
    navigate("/sales/dashboard");
  };

  // Check authentication on component mount and fetch custom lead types
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (!token || role !== "sales") {
      navigate("/");
      return;
    }

    // Fetch custom lead types
    const fetchCustomLeadTypes = async () => {
      try {
        const response = await API.get('/sales/custom-lead-types');
        if (response.data.success) {
          setCustomLeadTypes(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching custom lead types:', error);
      }
    };

    fetchCustomLeadTypes();
  }, [navigate]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    //Fileds Validations
    
    if (!formData.type_of_lead) {
      newErrors.type_of_lead = "Please select a type of lead";
    }

    
    if (formData.type_of_lead === "other" && !formData.custom_type.trim()) {
      newErrors.custom_type = "Please enter a custom lead type";
    }

    
    if (!formData.project_name.trim()) {
      newErrors.project_name = "Project name is required";
    }

    
    if (!formData.name_of_lead.trim()) {
      newErrors.name_of_lead = "Lead name is required";
    }

    
    if (!formData.designation_of_lead.trim()) {
      newErrors.designation_of_lead = "Designation is required";
    }

    
    if (!formData.company_name.trim()) {
      newErrors.company_name = "Company name is required";
    }

    const phoneRegex = /^\d{10}$/;
    if (!formData.phone_number_of_lead) {
      newErrors.phone_number_of_lead = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone_number_of_lead)) {
      newErrors.phone_number_of_lead = "Phone number must be exactly 10 digits";
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.com$/;
    if (!formData.email_of_lead) {
      newErrors.email_of_lead = "Email is required";
    } else if (!emailRegex.test(formData.email_of_lead)) {
      newErrors.email_of_lead = "Email must be valid and end with .com";
    }

    // Source validation
    if (!formData.source_of_lead) {
      newErrors.source_of_lead = "Please select a source";
    }

    // Reference validation - only required if source is referral
    if (formData.source_of_lead === "referral") {
      if (!formData.reference_name.trim()) {
        newErrors.reference_name = "Reference name is required";
      }
      if (!formData.reference_phone_number) {
        newErrors.reference_phone_number = "Reference phone number is required";
      } else if (!phoneRegex.test(formData.reference_phone_number)) {
        newErrors.reference_phone_number = "Reference phone number must be exactly 10 digits";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // For phone numbers, only allow digits and limit to 10
    if (name === "phone_number_of_lead" || name === "reference_phone_number") {
      const numericValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the data to send
      const requestData = {
        type_of_lead: formData.type_of_lead,
        custom_type: formData.custom_type,
        project_name: formData.project_name,
        name_of_lead: formData.name_of_lead,
        designation_of_lead: formData.designation_of_lead,
        company_name: formData.company_name,
        phone_number_of_lead: formData.phone_number_of_lead,
        email_of_lead: formData.email_of_lead,
        source_of_lead: formData.source_of_lead,
        reference_name: formData.reference_name,
        reference_phone_number: formData.reference_phone_number,
        intrested: 'WARM', // Default value as per model
        follow_up_conversation: '', // Default empty string
        status: 'Open' // Default status
      };

      console.log("Sending data to API:", requestData);

      // Make API call to backend
      const response = await API.post('/sales/add-leads-to-sales', requestData);

      console.log("Form submitted successfully:", response.data);
      alert("Lead added successfully!");

      // Reset form
      setFormData({
        type_of_lead: "",
        custom_type: "",
        project_name: "",
        name_of_lead: "",
        designation_of_lead: "",
        company_name: "",
        phone_number_of_lead: "",
        email_of_lead: "",
        source_of_lead: "",
        reference_name: "",
        reference_phone_number: "",
      });

      // Navigate back to dashboard after successful submission
      navigate("/sales/dashboard");
    } catch (error: any) {
      console.error("Submission error:", error);
      
      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        const errorData = error.response.data;
        let errorMessage = "Error submitting form. Please try again.";
        
        if (errorData?.message) {
          errorMessage = errorData.message;
        }
        
        // If there are specific validation errors, show them
        if (errorData?.errors && Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.join(', ');
        }
        
        alert(errorMessage);
      } else if (error.request) {
        // Network error
        alert("Network error. Please check your connection and try again.");
      } else {
        // Other error
        alert("Error submitting form. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000B3] bg-opacity-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Dashboard</span>
            </button>
            <div className="text-center flex-1">
              <h1 className="text-3xl font-bold text-blue-600 mb-2">
                Lead Information Form
              </h1>
              <p className="text-gray-600 text-lg">
                Please fill in all the required details
              </p>
            </div>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Type of Lead */}
              <div className="lg:col-span-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  Type of Lead
                </label>
                <select
                  name="type_of_lead"
                  value={formData.type_of_lead}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 bg-white ${
                    errors.type_of_lead
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-600 hover:border-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                >
                  <option value="">Select type of lead</option>
                  <option value="lead">Lead</option>
                  <option value="speaker">Speaker</option>
                  <option value="sponsor">Sponsor</option>
                  <option value="awards">Awards</option>
                  <option value="other">Other</option>
                  {customLeadTypes.map((customType, index) => (
                    <option key={index} value={customType}>{customType}</option>
                  ))}
                </select>
                {errors.type_of_lead && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.type_of_lead}
                  </p>
                )}
              </div>

              {/* Custom Type Input - Only show when "other" is selected */}
              {formData.type_of_lead === "other" && (
                <div className="lg:col-span-2">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Award className="w-4 h-4 text-blue-600" />
                    Custom Lead Type
                  </label>
                  <input
                    type="text"
                    name="custom_type"
                    value={formData.custom_type}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                      errors.custom_type
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-600 hover:border-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                    placeholder="Enter custom lead type"
                  />
                  {errors.custom_type && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.custom_type}
                    </p>
                  )}
                </div>
              )}

              {/* Project Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <FolderOpen className="w-4 h-4 text-blue-600" />
                  Project Name
                </label>
                <input
                  type="text"
                  name="project_name"
                  value={formData.project_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                    errors.project_name
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-600 hover:border-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                  placeholder="Enter project name"
                />
                {errors.project_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.project_name}
                  </p>
                )}
              </div>

              {/* Name of Lead */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 text-blue-600" />
                  Name of Lead
                </label>
                <input
                  type="text"
                  name="name_of_lead"
                  value={formData.name_of_lead}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                    errors.name_of_lead
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-600 hover:border-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                  placeholder="Enter lead name"
                />
                {errors.name_of_lead && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.name_of_lead}
                  </p>
                )}
              </div>

              {/* Designation */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  Designation of Lead
                </label>
                <input
                  type="text"
                  name="designation_of_lead"
                  value={formData.designation_of_lead}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                    errors.designation_of_lead
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-600 hover:border-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                  placeholder="Enter designation"
                />
                {errors.designation_of_lead && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.designation_of_lead}
                  </p>
                )}
              </div>

              {/* Company Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Building className="w-4 h-4 text-blue-600" />
                  Company Name
                </label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                    errors.company_name
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-600 hover:border-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                  placeholder="Enter company name"
                />
                {errors.company_name && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.company_name}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone_number_of_lead"
                  value={formData.phone_number_of_lead}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                    errors.phone_number_of_lead
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-600 hover:border-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                />
                {errors.phone_number_of_lead && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.phone_number_of_lead}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 text-blue-600" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email_of_lead"
                  value={formData.email_of_lead}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                    errors.email_of_lead
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-600 hover:border-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                  placeholder="Enter email ending with .com"
                />
                {errors.email_of_lead && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.email_of_lead}
                  </p>
                )}
              </div>

              {/* Source of Lead */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                  <Share2 className="w-4 h-4 text-blue-600" />
                  Source of Lead
                </label>
                <select
                  name="source_of_lead"
                  value={formData.source_of_lead}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 bg-white ${
                    errors.source_of_lead
                      ? "border-red-500 focus:border-red-500"
                      : "border-gray-300 focus:border-blue-600 hover:border-gray-400"
                  } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                >
                  <option value="">Select source</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="referral">Referral</option>
                </select>
                {errors.source_of_lead && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.source_of_lead}
                  </p>
                )}
              </div>
            </div>

            {/* Reference Fields - Only show when source is referral */}
            {formData.source_of_lead === "referral" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Reference Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Users className="w-4 h-4 text-blue-600" />
                    Reference Name
                  </label>
                  <input
                    type="text"
                    name="reference_name"
                    value={formData.reference_name}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                      errors.reference_name
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-600 hover:border-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                    placeholder="Enter reference name"
                  />
                  {errors.reference_name && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.reference_name}
                    </p>
                  )}
                </div>

                {/* Reference Phone Number */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    Reference Phone Number
                  </label>
                  <input
                    type="tel"
                    name="reference_phone_number"
                    value={formData.reference_phone_number}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 ${
                      errors.reference_phone_number
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-600 hover:border-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-blue-100`}
                    placeholder="Enter 10-digit reference phone number"
                    maxLength={10}
                  />
                  {errors.reference_phone_number && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.reference_phone_number}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg text-white font-semibold text-lg transition-all duration-200 ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transform hover:scale-[1.02] active:scale-[0.98]"
                } focus:outline-none focus:ring-4 focus:ring-blue-200`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2  border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </span>
                ) : (
                  "Submit Lead Information"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddLeadForm;
