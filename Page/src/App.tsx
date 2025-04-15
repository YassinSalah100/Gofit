import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import FeaturedProducts from './components/FeaturedProducts';
import Categories from './components/Categories';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={
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
          } />
          <Route path="/checkout" element={
            <>
              <Navbar />
              <Checkout />
              <Footer />
            </>
          } />
          <Route path="/order-confirmation" element={
            <>
              <Navbar />
              <OrderConfirmation />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;