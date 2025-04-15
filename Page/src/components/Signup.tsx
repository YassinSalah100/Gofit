"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import {
  Mail,
  Lock,
  User,
  Dumbbell,
  Home,
  Eye,
  EyeOff,
  CheckCircle,
  Calendar,
  Phone,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { MotionPathPlugin } from "gsap/MotionPathPlugin"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader"

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)

interface FormData {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  birthdate: string
  phone: string
  fitnessGoal: string
  fitnessLevel: string // Added missing property
  agreeTerms: boolean
}

const Signup = () => {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    birthdate: "",
    phone: "",
    fitnessGoal: "",
    fitnessLevel: "", // Initialize the missing property
    agreeTerms: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordFeedback, setPasswordFeedback] = useState("")

  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const modelRef = useRef<THREE.Group | null>(null)
  const composerRef = useRef<EffectComposer | null>(null)
  const stepsRef = useRef<(HTMLDivElement | null)[]>([])
  const mousePosition = useRef({ x: 0, y: 0 })

  const fitnessGoals = ["Lose Weight", "Build Muscle", "Improve Endurance", "General Fitness", "Sports Performance"]
  const totalSteps = 3

  // Initialize Three.js scene
  useEffect(() => {
    // Setup scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    // Setup renderer
    if (canvasRef.current) {
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
        antialias: true,
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      rendererRef.current = renderer

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)

      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(5, 5, 5)
      scene.add(directionalLight)

      // Load 3D model (dumbbell)
      const loader = new GLTFLoader()
      loader.load("/placeholder.svg?height=100&width=100&text=3D", (gltf: GLTF) => {
        const model = gltf.scene
        model.scale.set(0.5, 0.5, 0.5)
        model.position.set(0, 0, -2)
        scene.add(model)
        modelRef.current = model

        // Animate the model
        gsap.to(model.rotation, {
          y: Math.PI * 2,
          duration: 20,
          repeat: -1,
          ease: "none",
        })
      })

      // Create dynamic background
      const geometry = new THREE.IcosahedronGeometry(10, 1)
      const material = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        wireframe: true,
        transparent: true,
        opacity: 0.1,
      })
      const backgroundMesh = new THREE.Mesh(geometry, material)
      scene.add(backgroundMesh)

      // Animate background
      gsap.to(backgroundMesh.rotation, {
        x: Math.PI * 2,
        y: Math.PI,
        duration: 40,
        repeat: -1,
        ease: "none",
      })

      // Add post-processing effects
      const composer = new EffectComposer(renderer)
      const renderPass = new RenderPass(scene, camera)
      composer.addPass(renderPass)

      // Add bloom effect
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.3, // strength
        0.2, // radius
        0.7, // threshold
      )
      composer.addPass(bloomPass)

      // Add RGB shift effect
      const rgbShiftPass = new ShaderPass(RGBShiftShader)
      rgbShiftPass.uniforms["amount"].value = 0.0008
      composer.addPass(rgbShiftPass)

      composerRef.current = composer

      // Handle window resize
      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        if (composerRef.current) {
          composerRef.current.setSize(window.innerWidth, window.innerHeight)
        }
      }

      window.addEventListener("resize", handleResize)

      // Track mouse movement
      const handleMouseMove = (event: MouseEvent) => {
        mousePosition.current = {
          x: (event.clientX / window.innerWidth) * 2 - 1,
          y: -(event.clientY / window.innerHeight) * 2 + 1,
        }
      }

      window.addEventListener("mousemove", handleMouseMove)

      // Animation loop
      const animate = () => {
        requestAnimationFrame(animate)

        // Move camera slightly based on mouse position
        if (cameraRef.current && sceneRef.current) {
          cameraRef.current.position.x += (mousePosition.current.x * 2 - cameraRef.current.position.x) * 0.05
          cameraRef.current.position.y += (mousePosition.current.y * 2 - cameraRef.current.position.y) * 0.05
          cameraRef.current.lookAt(sceneRef.current.position)
        }

        // Render with post-processing
        if (composerRef.current) {
          composerRef.current.render()
        }
      }

      animate()

      return () => {
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("mousemove", handleMouseMove)

        // Clean up Three.js resources
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            object.geometry.dispose()
            object.material.dispose()
          }
        })

        renderer.dispose()
      }
    }
  }, [])

  // GSAP animations for form elements
  useEffect(() => {
    // Initial animations
    const tl = gsap.timeline()

    // Fade in the container
    if (containerRef.current) {
      tl.fromTo(containerRef.current, { opacity: 0 }, { opacity: 1, duration: 1, ease: "power3.out" })
    }

    // Animate the logo
    if (logoRef.current) {
      tl.fromTo(
        logoRef.current,
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 1, ease: "elastic.out(1, 0.5)" },
        "-=0.5",
      )
    }

    // Animate the form
    if (formRef.current) {
      tl.fromTo(
        formRef.current,
        { y: 50, opacity: 0, rotationX: 20 },
        { y: 0, opacity: 1, rotationX: 0, duration: 1, ease: "power3.out" },
        "-=0.5",
      )

      // Animate step indicators
      tl.fromTo(
        stepsRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, stagger: 0.1, duration: 0.5, ease: "back.out(2)" },
        "-=0.8",
      )

      // Animate form fields
      const formElements = formRef.current.querySelectorAll(".form-element")
      tl.fromTo(
        formElements,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.8, ease: "power2.out" },
        "-=0.5",
      )
    }

    return () => {
      tl.kill()
    }
  }, [])

  // Update password strength
  useEffect(() => {
    if (formData.password) {
      const hasUpperCase = /[A-Z]/.test(formData.password)
      const hasLowerCase = /[a-z]/.test(formData.password)
      const hasNumbers = /\d/.test(formData.password)
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)
      const isLongEnough = formData.password.length >= 8

      const strength = [hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar, isLongEnough].filter(Boolean).length
      setPasswordStrength(strength)

      if (strength <= 2) {
        setPasswordFeedback("Weak password")
      } else if (strength <= 4) {
        setPasswordFeedback("Good password")
      } else {
        setPasswordFeedback("Strong password")
      }
    } else {
      setPasswordStrength(0)
      setPasswordFeedback("")
    }
  }, [formData.password])

  // Handle step change with animations
  useEffect(() => {
    if (formRef.current) {
      const tl = gsap.timeline()

      // Animate out current form
      tl.to(".form-step-content", {
        opacity: 0,
        y: -20,
        duration: 0.3,
        ease: "power2.in",
      })

      // Update progress bar
      tl.to(
        ".progress-bar-fill",
        {
          width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          duration: 0.5,
          ease: "power2.inOut",
        },
        "-=0.1",
      )

      // Animate in new form
      tl.fromTo(".form-step-content", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })

      // Highlight current step
      stepsRef.current.forEach((step, index) => {
        if (step) {
          gsap.to(step, {
            scale: currentStep === index + 1 ? 1.1 : 1,
            duration: 0.3,
            ease: "back.out(2)",
          })
        }
      })
    }
  }, [currentStep])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Button press animation
    const button = (e.currentTarget as HTMLFormElement).querySelector("button")
    if (button) {
      gsap.to(button, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      })
    }

    if (currentStep < totalSteps) {
      // Animate to next step
      setCurrentStep(currentStep + 1)
      return
    }

    setIsLoading(true)

    // Final submission animation
    const tl = gsap.timeline()

    // Animate the form fields
    if (formRef.current) {
      const formElements = formRef.current.querySelectorAll(".form-element")

      tl.to(formElements, {
        y: -20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.4,
        ease: "power2.in",
      })

      tl.to(formRef.current, {
        scale: 0.95,
        opacity: 0.8,
        duration: 0.3,
        ease: "power2.in",
      })
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Success animation
    if (formRef.current) {
      tl.to(formRef.current, {
        scale: 1.05,
        duration: 0.3,
        ease: "power2.out",
      })

      tl.to(formRef.current, {
        scale: 0,
        opacity: 0,
        rotation: 5,
        duration: 0.5,
        ease: "power3.in",
        onComplete: () => {
          setIsLoading(false)
          navigate("/")
        },
      })
    }
  }

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked

    // Ripple effect on input
    if (type !== "checkbox" && e.target.parentNode) {
      const ripple = document.createElement("div")
      ripple.className = "input-ripple"
      e.target.parentNode.appendChild(ripple)

      const nativeEvent = e.nativeEvent as MouseEvent
      gsap.fromTo(
        ripple,
        { left: nativeEvent.offsetX, top: nativeEvent.offsetY, width: 0, height: 0, opacity: 1 },
        { width: 500, height: 500, opacity: 0, duration: 1, ease: "power2.out", onComplete: () => ripple.remove() },
      )
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const togglePasswordVisibility = () => {
    // Animate the eye icon
    const eyeIcon = document.querySelector(".eye-icon")
    if (eyeIcon) {
      gsap.fromTo(eyeIcon, { scale: 0.5, opacity: 0.5 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" })
    }

    setShowPassword(!showPassword)
  }

  const handleFitnessGoalSelect = (goal: string) => {
    // Animate the selection
    gsap.to(`.goal-option`, {
      scale: 0.95,
      opacity: 0.7,
      duration: 0.2,
      ease: "power2.out",
    })

    gsap.to(`.goal-option[data-goal="${goal}"]`, {
      scale: 1.05,
      opacity: 1,
      duration: 0.3,
      ease: "back.out(1.7)",
    })

    setFormData((prev) => ({ ...prev, fitnessGoal: goal }))
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Three.js Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Back to Home Button with hover effect */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-4 left-4 flex items-center space-x-2 text-white hover:text-red-100 transition-all z-50 group"
      >
        <div className="relative overflow-hidden rounded-full bg-white/10 p-2 group-hover:bg-white/20 transition-all duration-300">
          <Home className="h-5 w-5 text-white" />
          <span className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></span>
        </div>
        <span className="font-medium relative">
          Back to Home
          <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></span>
        </span>
      </button>

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        {/* Logo Section */}
        <div className="flex justify-center">
          <div
            ref={logoRef}
            className="bg-white p-4 rounded-full shadow-xl cursor-pointer relative overflow-hidden"
            onClick={() => navigate("/")}
          >
            <div className="relative z-10">
              <Dumbbell className="h-12 w-12 text-red-600" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500 to-red-600 transform scale-0 hover:scale-100 transition-transform duration-500 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Dumbbell className="h-12 w-12 text-white transform scale-0 hover:scale-100 transition-all duration-500" />
            </div>

            {/* Animated rings around logo */}
            <div className="absolute inset-0 rounded-full border-2 border-red-500 scale-0 animate-ping-slow opacity-0"></div>
            <div className="absolute inset-0 rounded-full border-2 border-red-400 scale-0 animate-ping-slow animation-delay-500 opacity-0"></div>
            <div className="absolute inset-0 rounded-full border-2 border-red-300 scale-0 animate-ping-slow animation-delay-1000 opacity-0"></div>
          </div>
        </div>

        {/* Main Card with 3D effect */}
        <div
          ref={formRef}
          className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 space-y-8 relative border border-white/20 transform perspective-1000"
          style={{
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 40px rgba(255, 255, 255, 0.1) inset",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Progress Steps */}
          <div className="flex justify-between items-center relative">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className="flex flex-col items-center relative z-10"
                ref={(el) => (stepsRef.current[step - 1] = el)}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                    currentStep >= step ? "bg-red-600 text-white" : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step ? <CheckCircle className="h-5 w-5" /> : <span>{step}</span>}
                </div>
                <span className={`text-xs mt-2 font-medium ${currentStep >= step ? "text-red-600" : "text-gray-500"}`}>
                  {step === 1 ? "Account" : step === 2 ? "Personal" : "Preferences"}
                </span>
              </div>
            ))}

            {/* Progress Bar */}
            <div className="absolute top-5 left-0 h-0.5 bg-gray-200 w-full -z-10"></div>
            <div
              className="absolute top-5 left-0 h-0.5 bg-red-600 transition-all duration-500 -z-5 progress-bar-fill"
              style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
            ></div>
          </div>

          <div className="text-center transform" style={{ transform: "translateZ(20px)" }}>
            <h2 className="text-3xl font-extrabold text-gray-900 relative inline-block">
              {currentStep === 1
                ? "Create Your Account"
                : currentStep === 2
                  ? "Personal Information"
                  : "Fitness Preferences"}
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-red-500 opacity-20 rounded"></div>
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {currentStep === 1
                ? "Start your fitness journey with us"
                : currentStep === 2
                  ? "Tell us a bit about yourself"
                  : "Help us customize your experience"}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {/* Step 1: Account Information */}
            {currentStep === 1 && (
              <div className="space-y-5 form-step-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="form-element group relative">
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-medium text-gray-700 mb-1 transform"
                      style={{ transform: "translateZ(30px)" }}
                    >
                      First Name
                    </label>
                    <div
                      className="mt-1 relative rounded-md shadow-sm overflow-hidden transform"
                      style={{ transform: "translateZ(40px)" }}
                    >
                      <input
                        id="firstName"
                        name="firstName"
                        type="text"
                        autoComplete="given-name"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="John"
                      />
                      <User className="absolute right-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                      <div className="absolute bottom-0 left-0 h-0.5 bg-red-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-300"></div>
                    </div>
                  </div>

                  <div className="form-element group relative">
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-medium text-gray-700 mb-1 transform"
                      style={{ transform: "translateZ(30px)" }}
                    >
                      Last Name
                    </label>
                    <div
                      className="mt-1 relative rounded-md shadow-sm overflow-hidden transform"
                      style={{ transform: "translateZ(40px)" }}
                    >
                      <input
                        id="lastName"
                        name="lastName"
                        type="text"
                        autoComplete="family-name"
                        required
                        value={formData.lastName}
                        onChange={handleChange}
                        className="block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                        placeholder="Doe"
                      />
                      <User className="absolute right-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                      <div className="absolute bottom-0 left-0 h-0.5 bg-red-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-300"></div>
                    </div>
                  </div>
                </div>

                <div className="form-element group relative">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1 transform"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    Email address
                  </label>
                  <div
                    className="mt-1 relative rounded-md shadow-sm overflow-hidden transform"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="john@example.com"
                    />
                    <Mail className="absolute right-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                    <div className="absolute bottom-0 left-0 h-0.5 bg-red-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-300"></div>
                  </div>
                </div>

                <div className="form-element group relative">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 mb-1 transform"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    Password
                  </label>
                  <div
                    className="mt-1 relative rounded-md shadow-sm overflow-hidden transform"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors eye-icon"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                    <div className="absolute bottom-0 left-0 h-0.5 bg-red-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-300"></div>
                  </div>

                  {/* Password strength indicator */}
                  {formData.password && (
                    <div className="mt-2 transform" style={{ transform: "translateZ(30px)" }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-700">{passwordFeedback}</span>
                      </div>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-300 ${
                            passwordStrength <= 2
                              ? "bg-red-500"
                              : passwordStrength <= 4
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                          style={{ width: `${passwordStrength * 20}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-element group relative">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 mb-1 transform"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    Confirm Password
                  </label>
                  <div
                    className="mt-1 relative rounded-md shadow-sm overflow-hidden transform"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="••••••••"
                    />
                    <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                    <div className="absolute bottom-0 left-0 h-0.5 bg-red-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-300"></div>
                  </div>
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <div className="space-y-5 form-step-content">
                <div className="form-element group relative">
                  <label
                    htmlFor="birthdate"
                    className="block text-sm font-medium text-gray-700 mb-1 transform"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    Date of Birth
                  </label>
                  <div
                    className="mt-1 relative rounded-md shadow-sm overflow-hidden transform"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <input
                      id="birthdate"
                      name="birthdate"
                      type="date"
                      required
                      value={formData.birthdate}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                    />
                    <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                    <div className="absolute bottom-0 left-0 h-0.5 bg-red-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-300"></div>
                  </div>
                </div>

                <div className="form-element group relative">
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-1 transform"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    Phone Number (optional)
                  </label>
                  <div
                    className="mt-1 relative rounded-md shadow-sm overflow-hidden transform"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className="block w-full px-4 py-3 rounded-lg border border-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                      placeholder="+1 (555) 123-4567"
                    />
                    <Phone className="absolute right-3 top-3 h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                    <div className="absolute bottom-0 left-0 h-0.5 bg-red-500 transform scale-x-0 group-focus-within:scale-x-100 transition-transform origin-left duration-300"></div>
                  </div>
                </div>

                {/* Animated divider */}
                <div className="relative h-px bg-gray-200 my-8 overflow-hidden">
                  <div className="absolute h-full w-20 bg-red-500 animate-pulse-flow"></div>
                </div>

                <div className="form-element relative">
                  <p
                    className="text-sm font-medium text-gray-700 mb-3 transform"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    Your fitness experience helps us personalize your journey
                  </p>
                  <div className="grid grid-cols-2 gap-4 transform" style={{ transform: "translateZ(40px)" }}>
                    {["Beginner", "Intermediate", "Advanced", "Professional"].map((level) => (
                      <div
                        key={level}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 hover:shadow-md ${
                          formData.fitnessLevel === level
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-200 hover:border-red-200 hover:bg-red-50/30"
                        }`}
                        onClick={() => setFormData({ ...formData, fitnessLevel: level })}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                              formData.fitnessLevel === level ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            {formData.fitnessLevel === level && <div className="w-3 h-3 rounded-full bg-red-500"></div>}
                          </div>
                          <span className="font-medium">{level}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Fitness Preferences */}
            {currentStep === 3 && (
              <div className="space-y-5 form-step-content">
                <div className="form-element group relative">
                  <label
                    htmlFor="fitnessGoal"
                    className="block text-sm font-medium text-gray-700 mb-1 transform"
                    style={{ transform: "translateZ(30px)" }}
                  >
                    Primary Fitness Goal
                  </label>
                  <div
                    className="mt-1 grid grid-cols-1 md:grid-cols-2 gap-3 transform"
                    style={{ transform: "translateZ(40px)" }}
                  >
                    {fitnessGoals.map((goal) => (
                      <div
                        key={goal}
                        data-goal={goal}
                        onClick={() => handleFitnessGoalSelect(goal)}
                        className={`p-4 border rounded-lg cursor-pointer transition-all duration-300 goal-option ${
                          formData.fitnessGoal === goal
                            ? "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-200 hover:border-red-200 hover:bg-red-50/30"
                        }`}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 ${
                              formData.fitnessGoal === goal ? "border-red-500" : "border-gray-300"
                            }`}
                          >
                            {formData.fitnessGoal === goal && (
                              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
                            )}
                          </div>
                          <span className="font-medium">{goal}</span>
                        </div>

                        {/* Animated highlight when selected */}
                        {formData.fitnessGoal === goal && (
                          <div className="absolute inset-0 rounded-lg border-2 border-red-500 scale-105 animate-pulse-border"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  className="form-element flex items-center mt-6 transform"
                  style={{ transform: "translateZ(30px)" }}
                >
                  <div className="relative">
                    <input
                      id="agreeTerms"
                      name="agreeTerms"
                      type="checkbox"
                      required
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-colors opacity-0 absolute"
                    />
                    <div
                      className={`w-4 h-4 border ${formData.agreeTerms ? "bg-red-600 border-red-600" : "border-gray-300"} rounded flex items-center justify-center transition-colors duration-200`}
                    >
                      {formData.agreeTerms && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      )}
                    </div>
                  </div>
                  <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{" "}
                    <a href="#" className="text-red-600 hover:text-red-500">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-red-600 hover:text-red-500">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 transform" style={{ transform: "translateZ(50px)" }}>
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all group"
                >
                  <ChevronLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                  Back
                </button>
              ) : (
                <div></div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="group relative inline-flex justify-center py-2 px-6 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                {/* Animated background layers */}
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform translate-x-0 -skew-x-12 bg-gradient-to-r from-red-700 to-red-900 group-hover:skew-x-12 group-hover:translate-x-full"></span>
                <span className="absolute inset-0 w-full h-full transition-all duration-300 ease-out transform skew-x-12 bg-gradient-to-r from-red-600 to-red-800 group-hover:-skew-x-12 group-hover:translate-x-full"></span>

                {/* Button content */}
                <span className="relative flex items-center">
                  {isLoading ? (
                    <div className="flex items-center">
                      {/* Custom animated loader */}
                      <div className="relative h-5 w-5 mr-2">
                        <div className="absolute inset-0 rounded-full border-2 border-white border-t-transparent animate-spin"></div>
                        <div
                          className="absolute inset-0 rounded-full border-2 border-white border-t-transparent border-b-transparent animate-spin animation-delay-500"
                          style={{ animationDirection: "reverse" }}
                        ></div>
                      </div>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <>
                      <span>{currentStep < totalSteps ? "Continue" : "Create Account"}</span>
                      <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>

                {/* Ripple effect on click */}
                <span className="absolute inset-0 h-full w-full bg-white/30 scale-0 rounded-full group-active:scale-100 transition-transform duration-500 origin-center"></span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* CSS for animations */}
      <style>
        {`
          .input-ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(239, 68, 68, 0.1);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-index: -1;
          }
          
          @keyframes ping-slow {
            0% {
              transform: scale(0);
              opacity: 0;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              transform: scale(2.5);
              opacity: 0;
            }
          }
          
          @keyframes pulse-flow {
            0% {
              transform: translateX(-100%);
            }
            100% {
              transform: translateX(500%);
            }
          }
          
          @keyframes pulse-border {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }
          
          .animate-ping-slow {
            animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
          }
          
          .animate-pulse-flow {
            animation: pulse-flow 3s linear infinite;
          }
          
          .animate-pulse-border {
            animation: pulse-border 2s ease-in-out infinite;
          }
          
          .animation-delay-500 {
            animation-delay: 0.5s;
          }
          
          .animation-delay-1000 {
            animation-delay: 1s;
          }
          
          .perspective-1000 {
            perspective: 1000px;
          }
        `}
      </style>
    </div>
  )
}

export default Signup
