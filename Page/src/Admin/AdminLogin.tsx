"use client"

import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AtSign, Lock, Eye, EyeOff, ArrowRight, Activity } from "lucide-react"

const AdminLogin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Mock admin authentication
    setTimeout(() => {
      // In a real app, you would validate credentials against your backend
      if (email === "admin@gofit.com" && password === "admin123") {
        // Set admin authentication in localStorage or context
        localStorage.setItem("adminAuth", "true")
        navigate("/admin")
      } else {
        setError("Invalid email or password. Please try again.")
      }
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Left Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Activity className="h-12 w-12 text-red-600" />
                <span className="absolute -top-1 -right-1 flex h-5 w-5 animate-pulse">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500"></span>
                </span>
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800">
              Admin Login<span className="text-red-600">.</span>
            </h1>
            <p className="text-gray-600 mt-2">Sign in to access the GOFIT admin dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Admin email"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
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

              {error && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                  <div className="flex">
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-red-600 hover:text-red-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-red-600"
              >
                {loading ? (
                  <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    <span>Sign In to Admin</span>
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Not an admin?{" "}
            <Link to="/login" className="font-medium text-red-600 hover:text-red-500">
              Go to customer login
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Admin Content */}
      <div className="hidden md:block md:w-1/2 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute -inset-0.5 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute -right-4 -bottom-24 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -left-4 -top-12 w-72 h-72 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative h-full flex flex-col justify-center items-center z-10 p-12 text-white">
          <h2 className="text-4xl font-bold mb-6">Admin Dashboard</h2>
          <p className="text-xl mb-8 text-center">
            Manage your products, orders, and customers from one central location.
          </p>

          <div className="grid grid-cols-2 gap-4 w-full max-w-md">
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <h3 className="font-semibold text-lg">Product Management</h3>
              <p className="text-sm text-gray-200">Add, edit, and manage your product inventory</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <h3 className="font-semibold text-lg">Order Processing</h3>
              <p className="text-sm text-gray-200">Track and manage customer orders</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <h3 className="font-semibold text-lg">Customer Data</h3>
              <p className="text-sm text-gray-200">View customer information and purchase history</p>
            </div>
            <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
              <h3 className="font-semibold text-lg">Analytics</h3>
              <p className="text-sm text-gray-200">Track sales and performance metrics</p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <p className="mb-4 text-white/80">Admin features include</p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm text-white/80">control</div>
              </div>
              <div className="h-12 w-px bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">Real-time</div>
                <div className="text-sm text-white/80">updates</div>
              </div>
              <div className="h-12 w-px bg-white/30"></div>
              <div className="text-center">
                <div className="text-3xl font-bold">Secure</div>
                <div className="text-sm text-white/80">access</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin
