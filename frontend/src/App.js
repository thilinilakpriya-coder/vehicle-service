import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout Components
import Navbar from './components/Navbar'; 

// Pages
import CustomerBooking from './pages/CustomerBooking';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import BookingSuccess from './pages/BookingSuccess';
import CheckStatus from './pages/CheckStatus';
import AboutUs from './pages/AboutUs';    
import ContactUs from './pages/ContactUs'; 
import ReviewPage from './pages/ReviewPage';

/**
 protected ProtectedRoute
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('adminToken');
  const authStatus = localStorage.getItem('isAuthenticated') === 'true';
  
  // If there is no Token or if AuthStatus is false, send it to Login
  if (!token || !authStatus) {
    return <Navigate to="/admin-login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <div className="App font-sans selection:bg-blue-500 selection:text-white">
        <Navbar /> 

        <Routes>
          
          <Route path="/" element={<CustomerBooking />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/reviews" element={<ReviewPage />} /> 
          <Route path="/success" element={<BookingSuccess />} /> 
          <Route path="/check-status" element={<CheckStatus />} /> 
          <Route path="/admin-login" element={<AdminLogin />} />

          {/*  Protected Dashboard Route -  */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />

          {/* 404 Redirect - If you enter a wrong URL, go to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;