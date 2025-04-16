import type React from "react"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import FeaturedProducts from "./components/FeaturedProducts"
import Categories from "./components/Categories"
import Newsletter from "./components/Newsletter"
import Footer from "./components/Footer"
import Checkout from "./components/Checkout"
import OrderConfirmation from "./components/OrderConfirmation"
import Login from "./components/Login"
import Signup from "./components/Signup"

// Admin components
import AdminLogin from "./components/AdminLogin"
import AdminDashboard from "./components/AdminDashboard"
import AdminHome from "./components/AdminHome"
import ProductList from "./components/ProductList"
import ProductForm from "./components/ProductForm"
// Define the type for the AdminRoute props
interface AdminRouteProps {
  children: React.ReactNode
}

// Admin route guard
const AdminRoute = ({ children }: AdminRouteProps) => {
  const isAdmin = localStorage.getItem("adminAuth") === "true"
  return isAdmin ? <>{children}</> : <Navigate to="/admin/login" />
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          {/* Customer routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main>
                  <Hero />
                  <Categories />
                  <FeaturedProducts />
                  <Newsletter />
                </main>
                <Footer />
              </>
            }
          />
          <Route
            path="/checkout"
            element={
              <>
                <Navbar />
                <Checkout />
                <Footer />
              </>
            }
          />
          <Route
            path="/order-confirmation"
            element={
              <>
                <Navbar />
                <OrderConfirmation />
                <Footer />
              </>
            }
          />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
          </Route>
        </Routes>
      </div>
    </Router>
  )
}

export default App
