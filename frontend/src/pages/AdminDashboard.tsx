import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Users, LogOut, X, Check, Target, TrendingUp, BarChart3, User, Settings } from 'lucide-react';

interface SalesUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface Errors {
  name?: string;
  email?: string;
  password?: string;
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
  // Sales user metrics
  totalSalesUsers: number;
  activeSalesUsers: number;
  salesPerformance: number;
  thisMonthUsers: number;
}

export default function AdminDashboard() {
  const [salesUserData, setSalesUserData] = useState<SalesUserData>({
    name: '',
    email: '',
    password: '',
    role: 'sales'
  });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics>({
    totalLeads: 0,
    openLeads: 0,
    closedLeads: 0,
    hotLeads: 0,
    warmLeads: 0,
    coldLeads: 0,
    notInterestedLeads: 0,
    conversionRate: 0,
    totalSalesUsers: 0,
    activeSalesUsers: 0,
    salesPerformance: 0,
    thisMonthUsers: 0
  });

  // Auto-hide success messages after 5 seconds
  useEffect(() => {
    if (message?.type === 'success') {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');

      if (!token || role !== 'admin') {
        navigate('/');
        return;
      }

      try {
        // Verify token with backend
        await API.get('/admin/welcome-admin', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Fetch performance metrics from leads
        const leadsResponse = await API.get('/admin/leads', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (leadsResponse.data.performanceMetrics) {
          setPerformanceMetrics(leadsResponse.data.performanceMetrics);
        }
      } catch (error) {
        console.error('Authentication failed:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate('/');
      } finally {
        setIsAuthLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSalesUserData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!salesUserData.name) newErrors.name = 'Name is required';
    else if (salesUserData.name.length < 3) newErrors.name = 'Name must be at least 3 characters';
    
    if (!salesUserData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(salesUserData.email)) newErrors.email = 'Email is invalid';
    
    if (!salesUserData.password) newErrors.password = 'Password is required';
    else if (salesUserData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateSalesUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Sending request to create sales user:', salesUserData);
      const response = await API.post('/admin/add-sales', salesUserData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Response received:', response.data);

      setMessage({ type: 'success', text: 'Sales user created successfully!' });
      setSalesUserData({ name: '', email: '', password: '', role: 'sales' });
      setShowCreateForm(false);

    } catch (error: any) {
      console.error('Error creating sales user:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to create sales user' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-900 text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                <p className="text-blue-600 text-sm sm:text-base">Manage your sales team</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white px-4 sm:px-5 py-2 rounded-xl transition-all duration-200 text-sm sm:text-base shadow-md hover:shadow-lg font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Message Display */}
        {message && (
          <div className={`mb-6 p-3 sm:p-4 rounded-lg flex items-center space-x-3 ${
            message.type === 'success' 
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {message.type === 'success' ? (
              <Check className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
            <span className="text-sm sm:text-base">{message.text}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-xs sm:text-sm font-medium">Total Sales Users</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{performanceMetrics.totalSalesUsers}</p>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-2 sm:p-3 rounded-lg">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-600 text-xs sm:text-sm font-medium">Converted Leads</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{performanceMetrics.closedLeads}</p>
              </div>
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 sm:p-3 rounded-lg">
                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-xs sm:text-sm font-medium">Conversion Rate</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{performanceMetrics.conversionRate.toFixed(1)}%</p>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 sm:p-3 rounded-lg">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-indigo-600 text-xs sm:text-sm font-medium">This Month</p>
                <p className="text-2xl sm:text-3xl font-bold text-slate-900">{performanceMetrics.thisMonthUsers}</p>
              </div>
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 p-2 sm:p-3 rounded-lg">
                <User className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-200 shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Recent Activity</h2>
            <div className="space-y-3 sm:space-y-4">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-slate-50/50 rounded-lg hover:bg-slate-100/50 transition-colors duration-200">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-full flex-shrink-0">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-slate-900 font-medium text-sm sm:text-base">New sales user added</p>
                    <p className="text-blue-600 text-xs sm:text-sm truncate">John Doe - john@example.com</p>
                  </div>
                  <span className="text-slate-500 text-xs sm:text-sm flex-shrink-0">2 hours ago</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-slate-200 shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button 
                onClick={() => setShowCreateForm(true)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base shadow-md hover:shadow-lg transform hover:scale-105"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Sales Person</span>
              </button>
              <button onClick={() => navigate('/viewreport')} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base shadow-md hover:shadow-lg transform hover:scale-105">
                <Users className="w-4 h-4"/>
                <span>View All Users</span>
              </button>
              {/* <button className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 text-white py-2 sm:py-3 px-3 sm:px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base shadow-md hover:shadow-lg transform hover:scale-105">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button> */}
            </div>
          </div>
        </div>

        {/* Create Sales User Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 w-full max-w-md shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Add Sales User</h3>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors duration-200"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              </div>

              <form onSubmit={handleCreateSalesUser} className="space-y-4 sm:space-y-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-900 mb-2">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={salesUserData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base ${
                      errors.name
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-slate-200 focus:ring-blue-400 focus:border-blue-400'
                    }`}
                    placeholder="Enter full name"
                  />
                  {errors.name && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-900 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={salesUserData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base ${
                      errors.email
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-slate-200 focus:ring-blue-400 focus:border-blue-400'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-slate-900 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={salesUserData.password}
                    onChange={handleInputChange}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base ${
                      errors.password
                        ? 'border-red-400 focus:ring-red-400'
                        : 'border-slate-200 focus:ring-blue-400 focus:border-blue-400'
                    }`}
                    placeholder="Enter password"
                  />
                  {errors.password && <p className="mt-1 text-xs sm:text-sm text-red-600">{errors.password}</p>}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2 sm:py-3 px-3 sm:px-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg text-sm sm:text-base"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Creating...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Create Sales User</span>
                    </div>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 