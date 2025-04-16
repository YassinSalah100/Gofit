"use client"

import type React from "react"

import { useState } from "react"
import {
  LayoutDashboard,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
} from "lucide-react"
import { Link, Outlet, useLocation } from "react-router-dom"

// Define the type for the navigation items
interface NavItem {
  name: string
  href: string
  icon: React.ElementType
}

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const navigation: NavItem[] = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ]

  const isActive = (path: string): boolean => {
    return location.pathname === path
  }

  // GOFIT Logo component
  const GofitLogo = () => (
    <div className="flex items-center">
      <svg width="40" height="40" viewBox="0 0 40 40" className="mr-2">
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4b2b" />
            <stop offset="100%" stopColor="#ff416c" />
          </linearGradient>
        </defs>
        <circle cx="20" cy="20" r="18" fill="white" stroke="url(#logoGradient)" strokeWidth="2.5" />
        <path d="M14 20 A6 6 0 1 1 26 20 A6 6 0 1 1 14 20" stroke="url(#logoGradient)" strokeWidth="2.5" fill="none" />
        <path d="M20 12 L20 8" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M20 32 L20 28" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12 20 L8 20" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M32 20 L28 20" stroke="url(#logoGradient)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M17 13 L15 11" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
        <path d="M25 29 L23 27" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
        <path d="M13 17 L11 15" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
        <path d="M29 25 L27 23" stroke="url(#logoGradient)" strokeWidth="2" strokeLinecap="round" />
      </svg>
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-gray-900">
          GO<span className="text-red-600">FIT</span>
        </span>
        <span className="text-xs tracking-wider font-medium text-gray-500">ADMIN PANEL</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-gray-900/80" onClick={() => setSidebarOpen(false)}></div>
        <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white">
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <GofitLogo />
            <button onClick={() => setSidebarOpen(false)}>
              <X className="h-6 w-6 text-gray-500" />
            </button>
          </div>
          <nav className="mt-4 px-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg ${
                  isActive(item.href) ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${isActive(item.href) ? "text-red-600" : "text-gray-400"}`} />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
            <button className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
              <LogOut className="mr-3 h-5 w-5 text-gray-400" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <GofitLogo />
          </div>
          <nav className="flex flex-1 flex-col px-4 py-4">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="space-y-1">
                  {navigation.map((item) => (
                    <li key={item.name}>
                      <Link
                        to={item.href}
                        className={`group flex items-center gap-x-3 px-4 py-3 text-sm font-medium rounded-lg ${
                          isActive(item.href) ? "bg-red-50 text-red-600" : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon
                          className={`h-5 w-5 ${
                            isActive(item.href) ? "text-red-600" : "text-gray-400 group-hover:text-gray-500"
                          }`}
                        />
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <Link
                  to="/"
                  className="group flex items-center gap-x-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <LogOut className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                  Sign out
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top header */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
          <button type="button" className="lg:hidden -m-2.5 p-2.5 text-gray-700" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>

          {/* Search */}
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="relative flex flex-1 items-center">
              <Search className="pointer-events-none absolute left-4 h-5 w-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search..."
                className="h-full w-full border-0 bg-transparent py-4 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-0"
              />
            </div>
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              <button className="relative p-1 text-gray-400 hover:text-gray-500">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-600"></span>
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button className="flex items-center gap-x-3 text-sm font-medium text-gray-700">
                  <img
                    src="/placeholder.svg?height=32&width=32"
                    alt="User"
                    className="h-8 w-8 rounded-full bg-gray-100"
                  />
                  <span>Admin User</span>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard
