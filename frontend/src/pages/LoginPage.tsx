import React, { useState } from 'react';
import API from '../api/axios'; // adjust path based on your structure
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, LockOpen, Users, Shield } from 'lucide-react';

interface FormData {
  email: string;
  password: string;
  role: 'sales' | 'admin';
}

interface Errors {
  email?: string;
  password?: string;
}

export default function LoginPage() {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    role: 'sales'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
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

  const handleRoleChange = (role: 'sales' | 'admin') => {
    setFormData(prev => ({ ...prev, role }));
  };

  const validateForm = () => {
    const newErrors: Errors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


const navigate = useNavigate();

const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsLoading(true);

  try {
    const isAdmin = formData.role === 'admin';
    const loginEndpoint = isAdmin ? '/auth/login' : '/login-sales/login';
    const protectedEndpoint = isAdmin
      ? '/admin/welcome-admin'
      : '/login-sales/welcome-sales';

    console.log('Attempting login with:', { email: formData.email, role: formData.role, endpoint: loginEndpoint });

    // Step 1: Login
    const res = await API.post(loginEndpoint, {
      email: formData.email,
      password: formData.password
    });

    const { accessToken } = res.data;
    console.log('Login successful, received token:', accessToken ? 'Token received' : 'No token');

    // Step 2: Save token and role
    localStorage.setItem('token', accessToken);
    localStorage.setItem('role', formData.role);

    // Step 3: Verify token with protected route
    const verify = await API.get(protectedEndpoint, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    console.log(`${formData.role} authenticated:`, verify.data.message);
    
    // Step 4: Show success message for 2 seconds then navigate
    setSuccessMessage(`✅ ${formData.role} login successful: ${verify.data.message}`);
    setShowSuccessMessage(true);
    
    const targetRoute = isAdmin ? '/admin/dashboard' : '/sales/dashboard';
    console.log('Login successful, navigating to:', targetRoute);
    
    // Wait 2 seconds then navigate
    setTimeout(() => {
      setShowSuccessMessage(false);
      navigate(targetRoute);
    }, 2000);

  } catch (error: any) {
    console.error("Login error:", error);
    setErrorMessage(error.response?.data?.message || 'Login failed');
    setShowErrorMessage(true);
    
    // Hide error message after 3 seconds
    setTimeout(() => {
      setShowErrorMessage(false);
    }, 3000);
  } finally {
    setIsLoading(false);
  }
};



  const getGradient = () => {
    return 'bg-white'; // Always solid white
  };

  const getAccentColor = () => {
    return formData.role === 'admin' ? 'bg-amber-600' : 'bg-blue-600';
  };

  const getButtonGradient = () => {
    return formData.role === 'admin'
      ? 'from-amber-600 to-yellow-500 hover:from-amber-700 hover:to-yellow-600 focus:ring-amber-400'
      : 'from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 focus:ring-blue-400';
  };

  const getIconColor = () => {
    return formData.role === 'admin' ? 'text-amber-300' : 'text-blue-300';
  };

  const getCardClasses = () => {
    return 'relative bg-white rounded-2xl p-4 sm:p-6 md:p-8 w-full max-w-[95%] sm:max-w-[80%] md:max-w-[60%] lg:max-w-[50%] xl:max-w-[40%] shadow-2xl border border-gray-200 z-10'; // Responsive card
  };

  const getTextColor = () => {
    return 'text-gray-900';
  };

  const getSubTextColor = () => {
    return 'text-gray-500';
  };

  return (
    <div className={`min-h-screen ${getGradient()} flex items-center justify-center p-2 sm:p-4`}>
      {/* No background blobs for solid backgrounds */}

      {/* Success Message Overlay */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-white/20 animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Success!</h3>
              <p className="text-gray-600 mb-4">{successMessage}</p>
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-gray-500">Redirecting...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message Overlay */}
      {showErrorMessage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/95 backdrop-blur-lg rounded-2xl p-8 max-w-md mx-4 shadow-2xl border border-white/20 animate-in slide-in-from-bottom-4 duration-300">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-60 h-20 bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Error!</h3>
              <p className="text-gray-600 mb-4">{errorMessage}</p>
              <div className="flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
                <span className="ml-2 text-sm text-gray-500">Dismissing...</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className={getCardClasses()}>
        <div className="text-center mb-6 sm:mb-8">
          <div className={`inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full mb-3 sm:mb-4 shadow-lg transition-all duration-500 ease-in-out ${
            formData.role === 'admin' ? 'bg-amber-50' : 'bg-blue-50'
          }`}>
            <User
              className={`w-6 h-6 sm:w-8 sm:h-8 transition-all duration-500 ease-in-out ${
                formData.role === 'admin'
                  ? 'text-amber-600'
                  : 'text-blue-600'
              }`}
            />
          </div>
          <h1 className={`text-2xl sm:text-3xl md:text-4xl font-bold ${getTextColor()} tracking-wide mb-2 transition-all duration-500 ease-in-out`}>
            Welcome Back
          </h1>
          <p className={`${getSubTextColor()} text-sm sm:text-base transition-all duration-500 ease-in-out`}>
            Sign in to your {formData.role === 'admin' ? 'admin' : 'sales'} account
          </p>
        </div>

        {/* Role Switch */}
        <div className="mb-4 sm:mb-6">
          <div className="relative flex bg-white/10 rounded-lg p-1 backdrop-blur-sm overflow-hidden">
            {/* Animated background slider */}
            <div 
              className={`absolute top-1 bottom-1 rounded-md transition-all duration-500 ease-in-out ${
                formData.role === 'sales' 
                  ? 'left-1 w-[calc(50%-0.125rem)] bg-blue-600 shadow-lg' 
                  : 'left-[calc(50%+0.125rem)] w-[calc(50%-0.125rem)] bg-amber-600 shadow-lg'
              }`}
            />
            
            <button
              type="button"
              onClick={() => handleRoleChange('sales')}
              className={`relative flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 px-2 sm:px-4 rounded-md transition-all duration-300 ease-in-out text-sm sm:text-base font-medium ${
                formData.role === 'sales'
                  ? 'text-white transform scale-105'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/20'
              }`}
            >
              <Users className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ${
                formData.role === 'sales' ? 'transform scale-110' : ''
              }`} />
              <span className="transition-all duration-300">Sales</span>
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`relative flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 px-2 sm:px-4 rounded-md transition-all duration-300 ease-in-out text-sm sm:text-base font-medium ${
                formData.role === 'admin'
                  ? 'text-white transform scale-105'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-white/20'
              }`}
            >
              <Shield className={`w-3 h-3 sm:w-4 sm:h-4 transition-all duration-300 ${
                formData.role === 'admin' ? 'transform scale-110' : ''
              }`} />
              <span className="transition-all duration-300">Admin</span>
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4 sm:space-y-6">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-3 sm:pl-4 pr-3 sm:pr-4 py-2 sm:py-3 bg-white text-gray-900 placeholder-gray-400 border-gray-200 focus:ring-blue-400 focus:border-blue-400 border rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base ${errors.email ? 'border-red-400 focus:ring-red-400' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-3 sm:pl-4 pr-10 sm:pr-12 py-2 sm:py-3 bg-white text-gray-900 placeholder-gray-400 border-gray-200 focus:ring-blue-400 focus:border-blue-400 border rounded-lg backdrop-blur-sm focus:outline-none focus:ring-2 transition-all duration-200 text-sm sm:text-base ${errors.password ? 'border-red-400 focus:ring-red-400' : ''}`}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" /> : <Eye className="w-4 h-4 sm:w-5 sm:h-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs sm:text-sm text-red-500">{errors.password}</p>}
          </div>

          {/* Remember Me + Forgot */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-white border-gray-200 rounded focus:ring-2 focus:ring-blue-400"
              />
              <span className="ml-2 text-xs sm:text-sm text-gray-600">Remember me</span>
            </label>
            <button className="text-xs sm:text-sm text-blue-600 hover:text-blue-500 transition-colors duration-200 self-start sm:self-auto">
              Forgot password?
            </button>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className={`w-full py-2 sm:py-3 px-4 rounded-lg font-medium text-white transition-all duration-500 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none bg-gradient-to-r text-sm sm:text-base ${getButtonGradient()}`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-1 sm:gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing in...
              </div>
                         ) : (
               <div className="flex items-center justify-center gap-1 sm:gap-2">
                 <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                   {/* Lock Open Icon for Sales - More Accessible */}
                   <LockOpen 
                     className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                       formData.role === 'sales' 
                         ? 'opacity-100 transform scale-100 rotate-0 text-white' 
                         : 'opacity-0 transform scale-50 -rotate-45 translate-x-2'
                     }`} 
                   />
                   {/* Lock Closed Icon for Admin - More Secure */}
                   <Lock 
                     className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                       formData.role === 'admin' 
                         ? 'opacity-100 transform scale-100 rotate-0 text-white' 
                         : 'opacity-0 transform scale-50 rotate-45 -translate-x-2'
                     }`} 
                   />
                   {/* Animated ring around the lock */}
                   <div className={`absolute inset-0 rounded-full border-2 transition-all duration-700 ease-in-out ${
                     formData.role === 'sales'
                       ? 'border-blue-300/50 scale-125 opacity-60'
                       : 'border-amber-300/50 scale-125 opacity-60'
                   }`} />
                 </div>
                 <span className="transition-all duration-500 ease-in-out font-medium">
                   Sign In as {formData.role === 'admin' ? 'Admin' : 'Sales'}
                 </span>
               </div>
             )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 sm:mt-8 text-center">
          <p className="text-gray-500 text-xs sm:text-sm">
            Don't have an account?{' '}
            <button className="text-blue-600 hover:text-blue-500 transition-colors duration-200 font-medium text-xs sm:text-sm">
              Contact your administrator
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
