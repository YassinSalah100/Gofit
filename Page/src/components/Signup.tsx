import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, AtSign, Lock, Eye, EyeOff, ArrowRight, Phone, CheckCircle } from 'lucide-react';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    interests: []
  });
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInterestToggle = (interest) => {
    setFormData(prev => {
      const interests = [...prev.interests];
      
      if (interests.includes(interest)) {
        return {
          ...prev,
          interests: interests.filter(i => i !== interest)
        };
      } else {
        return {
          ...prev,
          interests: [...interests, interest]
        };
      }
    });
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Mock signup logic
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1500);
  };

  const sportInterests = [
    'Running', 'Weightlifting', 'CrossFit', 'Yoga', 
    'Basketball', 'Football', 'Tennis', 'Swimming',
    'Cycling', 'Hiking', 'Boxing', 'Martial Arts'
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Side - Dynamic Sports Content */}
      <div className="hidden md:block md:w-1/2 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute -inset-0.5 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute -right-4 -bottom-24 w-72 h-72 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -left-4 -top-12 w-72 h-72 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative h-full flex flex-col justify-center items-center z-10 p-12 text-white">
          <h2 className="text-4xl font-bold mb-6">Join the GOFIT Community</h2>
          <p className="text-xl mb-8 text-center">
            Get exclusive access to deals, training tips, and premium equipment.
          </p>
          
          <div className="w-full max-w-md">
            <div className="flex items-center mb-8">
              <div className={`w-1/3 h-2 rounded-l-full ${step >= 1 ? 'bg-red-500' : 'bg-gray-600'}`}></div>
              <div className={`w-1/3 h-2 ${step >= 2 ? 'bg-red-500' : 'bg-gray-600'}`}></div>
              <div className={`w-1/3 h-2 rounded-r-full ${step >= 3 ? 'bg-red-500' : 'bg-gray-600'}`}></div>
            </div>
            
            <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
              <h3 className="font-semibold text-lg">
                {step === 1 && "Step 1: Basic Information"}
                {step === 2 && "Step 2: Account Security"}
                {step === 3 && "Step 3: Your Interests"}
              </h3>
              <p className="text-sm text-gray-200">
                {step === 1 && "Tell us who you are"}
                {step === 2 && "Create secure login credentials"}
                {step === 3 && "Help us personalize your experience"}
              </p>
            </div>
            
            <div className="mt-8">
              <div className="text-center">
                <div className="flex flex-col items-center">
                  <div className="mb-4 w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                    {step === 1 && <User className="h-8 w-8" />}
                    {step === 2 && <Lock className="h-8 w-8" />}
                    {step === 3 && <CheckCircle className="h-8 w-8" />}
                  </div>
                  <h4 className="font-medium">
                    {step === 1 && "Create your profile"}
                    {step === 2 && "Secure your account"}
                    {step === 3 && "Almost there!"}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-600 mt-2">Join the GOFIT community today</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First name"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last name"
                      className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      required
                    />
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email address"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </>
            )}
            
            {step === 2 && (
              <>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create password"
                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-gray-400 hover:text-gray-600 focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    required
                  />
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Password strength:</h4>
                  <div className="h-2 w-full bg-gray-200 rounded-full">
                    <div 
                      className={`h-full rounded-full ${
                        formData.password.length > 10 ? 'bg-green-500' : 
                        formData.password.length > 6 ? 'bg-yellow-500' : 
                        formData.password.length > 0 ? 'bg-red-500' : ''
                      }`}
                      style={{ width: `${Math.min(formData.password.length * 10, 100)}%` }}
                    ></div>
                  </div>
                  <ul className="mt-2 text-xs text-gray-600 space-y-1">
                    <li className={formData.password.length >= 8 ? 'text-green-600' : ''}>
                      • Minimum 8 characters
                    </li>
                    <li className={/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}>
                      • At least one uppercase letter
                    </li>
                    <li className={/[0-9]/.test(formData.password) ? 'text-green-600' : ''}>
                      • At least one number
                    </li>
                    <li className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-600' : ''}>
                      • At least one special character
                    </li>
                  </ul>
                </div>
              </>
            )}
            
            {step === 3 && (
              <>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Select your interests:</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Help us personalize your shopping experience
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {sportInterests.map((interest) => (
                      <div 
                        key={interest}
                        onClick={() => handleInterestToggle(interest)}
                        className={`p-3 rounded-lg border ${
                          formData.interests.includes(interest) 
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-300 hover:border-gray-400'
                        } cursor-pointer transition-all text-center`}
                      >
                        {interest}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      required
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                      I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
                    </label>
                  </div>
                </div>
              </>
            )}
            
            <div className="flex justify-between gap-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex-1 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                >
                  Back
                </button>
              )}
              
              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className={`flex-1 ${step === 1 && 'w-full'} py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105`}
                >
                  Continue
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all transform hover:scale-105"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
          
          {step === 1 && (
            <>
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Google
                  </button>
                  <button
                    type="button"
                    className="w-full py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Facebook
                  </button>
                </div>
              </div>
              
              <p className="mt-8 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;