"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { AtSign, Lock, Eye, EyeOff, ArrowRight, CheckCircle, X, Activity, Clock, AlertCircle } from "lucide-react"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loginStage, setLoginStage] = useState("email") // 'email', 'password', 'verifying', 'success'
  const [rememberMe, setRememberMe] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(null)
  const [loginAttempts, setLoginAttempts] = useState(0)
  const [errorMessage, setErrorMessage] = useState("")
  const [showMotivation, setShowMotivation] = useState(false)
  const [timeOfDay, setTimeOfDay] = useState("")
  const [animatedBackground, setAnimatedBackground] = useState(0)
  const [isAdmin, setIsAdmin] = useState(false)
  const navigate = useNavigate()

  // Set time of day greeting
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setTimeOfDay("morning")
    else if (hour < 18) setTimeOfDay("afternoon")
    else setTimeOfDay("evening")

    // Change background animation every 10 seconds
    const interval = setInterval(() => {
      setAnimatedBackground((prev) => (prev + 1) % 3)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Validate email as user types
  const validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(String(email).toLowerCase())
  }

  // Handle email submission
  const handleEmailContinue = () => {
    if (validateEmail(email)) {
      // Check if this is an admin email
      if (email === "admin@gofit.com") {
        setIsAdmin(true)
      }
      setLoginStage("password")
    } else {
      setErrorMessage("Please enter a valid email address")
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  // Check password strength
  useEffect(() => {
    if (password) {
      // Check password strength
      let strength = 0
      if (password.length >= 8) strength++
      if (/[A-Z]/.test(password)) strength++
      if (/[0-9]/.test(password)) strength++
      if (/[^A-Za-z0-9]/.test(password)) strength++
      setPasswordStrength(strength)
    } else {
      setPasswordStrength(null)
    }
  }, [password])

  // Simulate login process
  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setLoginStage("verifying")
    setErrorMessage("")

    // Mock login logic with potential failure
    setTimeout(() => {
      // Check if this is an admin login
      if (isAdmin && password === "admin123") {
        localStorage.setItem("adminAuth", "true")
        setLoginStage("success")
        setTimeout(() => {
          setLoading(false)
          navigate("/admin")
        }, 1000)
        return
      }

      // Regular user login
      const success = Math.random() > 0.1

      if (success) {
        setLoginStage("success")
        setTimeout(() => {
          setLoading(false)
          navigate("/")
        }, 1000)
      } else {
        setLoginAttempts((prev) => prev + 1)
        setLoading(false)
        setLoginStage("password")
        setErrorMessage("Invalid email or password. Please try again.")
      }
    }, 1500)
  }

  // Handle keypress for better UX
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      if (loginStage === "email") {
        handleEmailContinue()
      }
    }
  }

  // Return to email stage
  const handleBackToEmail = () => {
    setLoginStage("email")
    setErrorMessage("")
    setIsAdmin(false)
  }

  // Toggle motivation section
  const toggleMotivation = () => {
    setShowMotivation(!showMotivation)
  }

  // Render password strength indicator
  const renderPasswordStrength = () => {
    if (passwordStrength === null) return null

    const strengthLabels = ["Weak", "Fair", "Good", "Strong"]
    const strengthColors = ["bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"]

    return (
      <div className="mt-2">
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((level) => (
            <div
              key={level}
              className={`h-1 flex-1 rounded-full ${level < passwordStrength ? strengthColors[passwordStrength - 1] : "bg-gray-200"}`}
            />
          ))}
        </div>
        <p className="text-xs mt-1 text-gray-500">
          Password strength: {passwordStrength > 0 ? strengthLabels[passwordStrength - 1] : "Too weak"}
        </p>
      </div>
    )
  }

  // Animation variants based on state
  const getBackgroundClass = () => {
    const variants = [
      "bg-gradient-to-br from-red-600 via-purple-600 to-blue-600",
      "bg-gradient-to-br from-blue-600 via-green-600 to-yellow-600",
      "bg-gradient-to-br from-yellow-600 via-red-600 to-purple-600",
    ]
    return variants[animatedBackground]
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
              Good {timeOfDay}
              <span className="text-red-600">.</span>
            </h1>
            <p className="text-gray-600 mt-2">
              {loginStage === "email" && "Let's get you signed in to your GOFIT account"}
              {loginStage === "password" && isAdmin
                ? "Welcome back, Admin"
                : loginStage === "password" && "Welcome back, please enter your password"}
              {loginStage === "verifying" && "Verifying your credentials..."}
              {loginStage === "success" && "Login successful! Redirecting..."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Stage */}
            {loginStage === "email" && (
              <div className="space-y-6">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Email address"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
                    required
                    autoFocus
                  />
                </div>

                <button
                  type="button"
                  onClick={handleEmailContinue}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:scale-105"
                >
                  <span>Continue</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            )}

            {/* Password Stage */}
            {loginStage === "password" && (
              <div className="space-y-6">
                <div className="flex items-center">
                  <button type="button" onClick={handleBackToEmail} className="mr-4 p-2 rounded-full hover:bg-gray-100">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L6.414 9H15a1 1 0 110 2H6.414l3.293 3.293a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                  <div className="flex-1">
                    <p className="text-sm text-gray-500">Signing in as</p>
                    <p className="font-medium text-gray-800">{email}</p>
                  </div>
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
                    autoFocus
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

                {renderPasswordStrength()}

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe(!rememberMe)}
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
                  disabled={loading || !password}
                  className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-red-600"
                >
                  <span>Sign In</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            )}

            {/* Verifying Stage */}
            {loginStage === "verifying" && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin h-12 w-12 mb-4 border-4 border-red-600 border-t-transparent rounded-full"></div>
                <p className="text-gray-600">Verifying your credentials...</p>
              </div>
            )}

            {/* Success Stage */}
            {loginStage === "success" && (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-gray-600">Login successful! Redirecting...</p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Continue with social */}
          {(loginStage === "email" || loginStage === "password") && !isAdmin && (
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                      <path
                        fill="#4285F4"
                        d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                      />
                      <path
                        fill="#34A853"
                        d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"
                      />
                      <path
                        fill="#EA4335"
                        d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"
                      />
                    </g>
                  </svg>
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                >
                  <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96C18.34 21.21 22 17.06 22 12.06C22 6.53 17.5 2.04 12 2.04Z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                >
                  <svg className="h-5 w-5" fill="black" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          <p className="mt-8 text-center text-sm text-gray-600">
            {!isAdmin ? (
              <>
                Don't have an account?{" "}
                <Link to="/signup" className="font-medium text-red-600 hover:text-red-500">
                  Sign up now
                </Link>
              </>
            ) : (
              <>
                Need customer access?{" "}
                <Link to="/login" onClick={handleBackToEmail} className="font-medium text-red-600 hover:text-red-500">
                  Go to customer login
                </Link>
              </>
            )}
          </p>

          {/* Login attempts counter and security notice */}
          {loginAttempts > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center text-amber-600 text-sm">
                <Clock className="h-4 w-4 mr-1" />
                <span>{loginAttempts === 1 ? "1 failed attempt" : `${loginAttempts} failed attempts`}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                For security reasons, your account will be temporarily locked after 5 consecutive failed attempts.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Dynamic Sports Content */}
      <div
        className={`hidden md:block md:w-1/2 relative overflow-hidden transition-all duration-1000 ease-in-out ${getBackgroundClass()}`}
      >
        <div className="absolute inset-0 z-0">
          <div className="absolute -inset-0.5 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute -right-4 -bottom-24 w-72 h-72 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -left-4 -top-12 w-72 h-72 bg-yellow-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative h-full flex flex-col justify-center items-center z-10 p-12 text-white">
          <div className="absolute top-4 right-4">
            <button
              onClick={toggleMotivation}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"
            >
              {showMotivation ? <X className="h-5 w-5" /> : <Activity className="h-5 w-5" />}
            </button>
          </div>

          {!showMotivation ? (
            <>
              <h2 className="text-4xl font-bold mb-6">Reach Your Peak Performance</h2>
              <p className="text-xl mb-8 text-center">
                Access premium sports equipment and supplements designed for champions.
              </p>

              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <h3 className="font-semibold text-lg">Quality Equipment</h3>
                  <p className="text-sm text-gray-200">Professional-grade gear for every athlete</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <h3 className="font-semibold text-lg">Performance Supplements</h3>
                  <p className="text-sm text-gray-200">Scientifically formulated for results</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <h3 className="font-semibold text-lg">Expert Advice</h3>
                  <p className="text-sm text-gray-200">Guidance from fitness professionals</p>
                </div>
                <div className="bg-white/10 p-4 rounded-lg backdrop-blur-sm hover:bg-white/20 transition-all duration-300 transform hover:scale-105 cursor-pointer">
                  <h3 className="font-semibold text-lg">Fast Delivery</h3>
                  <p className="text-sm text-gray-200">Get your gear when you need it</p>
                </div>
              </div>

              <div className="mt-12 text-center">
                <p className="mb-4 text-white/80">Our members achieve</p>
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">30%</div>
                    <div className="text-sm text-white/80">better results</div>
                  </div>
                  <div className="h-12 w-px bg-white/30"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">20K+</div>
                    <div className="text-sm text-white/80">active users</div>
                  </div>
                  <div className="h-12 w-px bg-white/30"></div>
                  <div className="text-center">
                    <div className="text-3xl font-bold">95%</div>
                    <div className="text-sm text-white/80">satisfaction</div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full max-w-md bg-white/10 p-6 rounded-xl backdrop-blur-sm">
              <h3 className="text-2xl font-bold mb-4">Today's Motivation</h3>
              <blockquote className="text-lg italic mb-6">
                "The difference between the impossible and the possible lies in a person's determination."
              </blockquote>
              <p className="mb-4">Welcome back to GOFIT! Your fitness journey continues today. Remember:</p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-300" />
                  <span>You've completed 67% of your weekly goal</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-300" />
                  <span>Your last workout was 2 days ago</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2 text-green-300" />
                  <span>New workout plan available</span>
                </li>
              </ul>
              <div className="w-full bg-white/20 h-2 rounded-full">
                <div className="bg-green-400 h-2 rounded-full" style={{ width: "67%" }}></div>
              </div>
              <div className="text-sm text-right mt-1">67% to weekly goal</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
