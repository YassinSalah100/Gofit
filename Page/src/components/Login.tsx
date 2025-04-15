"use client"
import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Mail, ArrowRight, Dumbbell, Home, Eye, EyeOff } from "lucide-react"
import gsap from "gsap"
import * as THREE from "three"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass"
import { RGBShiftShader } from "three/examples/jsm/shaders/RGBShiftShader"

interface FormData {
  email: string
  password: string
  rememberMe: boolean
}

const Login = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Refs for animations
  const containerRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const composerRef = useRef<EffectComposer | null>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const raycaster = useRef(new THREE.Raycaster())
  const pointer = useRef(new THREE.Vector2())

  // Initialize Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return

    // Setup scene
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5
    cameraRef.current = camera

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    rendererRef.current = renderer

    // Create particles
    const particleGeometry = new THREE.BufferGeometry()
    const particleCount = 2000

    const posArray = new Float32Array(particleCount * 3)
    const colorArray = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i++) {
      // Position
      posArray[i] = (Math.random() - 0.5) * 15

      // Color - red theme
      if (i % 3 === 0) {
        colorArray[i] = Math.random() * 0.5 + 0.5 // R: 0.5-1.0
      } else if (i % 3 === 1) {
        colorArray[i] = Math.random() * 0.2 // G: 0-0.2
      } else {
        colorArray[i] = Math.random() * 0.2 // B: 0-0.2
      }
    }

    particleGeometry.setAttribute("position", new THREE.BufferAttribute(posArray, 3))
    particleGeometry.setAttribute("color", new THREE.BufferAttribute(colorArray, 3))

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
    })

    const particleMesh = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particleMesh)
    particlesRef.current = particleMesh

    // Add post-processing effects
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    // Add bloom effect
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      0.5, // strength
      0.4, // radius
      0.85, // threshold
    )
    composer.addPass(bloomPass)

    // Add RGB shift effect
    const rgbShiftPass = new ShaderPass(RGBShiftShader)
    rgbShiftPass.uniforms["amount"].value = 0.0015
    composer.addPass(rgbShiftPass)

    composerRef.current = composer

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current && composerRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, window.innerHeight)
        composerRef.current.setSize(window.innerWidth, window.innerHeight)
      }
    }

    window.addEventListener("resize", handleResize)

    // Track mouse movement but don't use it for camera movement
    const handleMouseMove = (event: MouseEvent) => {
      // Store mouse position for raycaster
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener("mousemove", handleMouseMove)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Rotate particles
      if (particlesRef.current) {
        particlesRef.current.rotation.x += 0.0003
        particlesRef.current.rotation.y += 0.0005

        // Make particles react to mouse
        if (cameraRef.current) {
          raycaster.current.setFromCamera(pointer.current, cameraRef.current)
          const intersects = raycaster.current.intersectObject(particlesRef.current)

          if (intersects.length > 0) {
            const positions = particlesRef.current.geometry.attributes.position.array
            const colors = particlesRef.current.geometry.attributes.color.array

            for (let i = 0; i < intersects.length; i++) {
              const idx = intersects[i].index

              if (idx !== undefined) {
                // Pulse the intersected particles
                const x = positions[idx * 3]
                const y = positions[idx * 3 + 1]
                const z = positions[idx * 3 + 2]

                positions[idx * 3] = x + (Math.random() - 0.5) * 0.01
                positions[idx * 3 + 1] = y + (Math.random() - 0.5) * 0.01
                positions[idx * 3 + 2] = z + (Math.random() - 0.5) * 0.01

                // Brighten the color
                colors[idx * 3] = 1.0 // Full red
                colors[idx * 3 + 1] = 0.3 // Some green
                colors[idx * 3 + 2] = 0.3 // Some blue
              }
            }

            particlesRef.current.geometry.attributes.position.needsUpdate = true
            particlesRef.current.geometry.attributes.color.needsUpdate = true
          }
        }
      }

      // Camera stays fixed - no movement with mouse
      if (cameraRef.current && sceneRef.current) {
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

      if (rendererRef.current) {
        rendererRef.current.dispose()
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

  // Handle form submission with animation
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

    setIsLoading(true)

    // Animate the form fields
    const tl = gsap.timeline()

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target

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

      <div className="max-w-md w-full space-y-8 relative z-10">
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
          <div className="text-center transform" style={{ transform: "translateZ(20px)" }}>
            <h2 className="text-3xl font-extrabold text-gray-900 relative inline-block">
              Welcome Back!
              <div className="absolute -bottom-1 left-0 w-full h-1 bg-red-500 opacity-20 rounded"></div>
            </h2>
            <p className="mt-2 text-sm text-gray-600">Ready to continue your fitness journey?</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
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
                    autoComplete="current-password"
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
              </div>
            </div>

            <div
              className="form-element flex items-center justify-between transform"
              style={{ transform: "translateZ(30px)" }}
            >
              <div className="flex items-center">
                <div className="relative">
                  <input
                    id="remember-me"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded transition-colors opacity-0 absolute"
                  />
                  <div
                    className={`w-4 h-4 border ${formData.rememberMe ? "bg-red-600 border-red-600" : "border-gray-300"} rounded flex items-center justify-center transition-colors duration-200`}
                  >
                    {formData.rememberMe && (
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
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Stay signed in
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-red-600 hover:text-red-500 transition-colors relative group">
                  Forgot password?
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              </div>
            </div>

            <div className="form-element transform" style={{ transform: "translateZ(50px)" }}>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
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
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </span>

                {/* Ripple effect on click */}
                <span className="absolute inset-0 h-full w-full bg-white/30 scale-0 rounded-full group-active:scale-100 transition-transform duration-500 origin-center"></span>
              </button>
            </div>
          </form>

          {/* Don't have an account section */}
          <div className="form-element text-center transform" style={{ transform: "translateZ(30px)" }}>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/signup")}
                className="font-medium text-red-600 hover:text-red-500 transition-colors relative group"
              >
                Sign up now
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-red-500 group-hover:w-full transition-all duration-300"></span>
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* CSS for ripple effect */}
      <style>
        {`
          .input-ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(239, 68, 68, 0.1);
            transform: translate(-50%, -50%);
            pointer-events: none;
            z-68,68,0.1);
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
          
          .animate-ping-slow {
            animation: ping-slow 3s cubic-bezier(0, 0, 0.2, 1) infinite;
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

export default Login
