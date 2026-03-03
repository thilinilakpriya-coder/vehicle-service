import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(''); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(''); 
    
    try {
      //  API call to your Backend
     const response = await axios.post('https://vehicle-service-production-198a.up.railway.app/api/auth/login', {
  username: credentials.username.trim(),
  password: credentials.password.trim()
});
      
      if (response.data.success) {
        console.log("Login Success!");

        /**
         *  SECURITY STORAGE
         * 1. adminToken: The actual encrypted key required by the Backend.
         * 2. isAuthenticated: A flag for simple Frontend routing checks.
         */
        localStorage.setItem('adminToken', response.data.token);
        localStorage.setItem('isAuthenticated', 'true');
        
        // Redirect to protected dashboard
        navigate('/dashboard'); 
      }
    } catch (error) {
      console.error("Login Error:", error.response);
      
      // Capture the specific error message from your Backend
      const message = error.response?.data?.message || "Invalid credentials or Server error!";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f1d] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-72 h-72 bg-blue-600/20 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-72 h-72 bg-indigo-600/20 rounded-full blur-[120px]"></div>

      <div className="w-full max-w-md z-10">
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
          
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/30 mb-6 rotate-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002-2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight italic">AUTOCARE <span className="text-blue-500 text-sm align-top">ADMIN</span></h2>
            <p className="text-gray-400 mt-2 text-sm uppercase tracking-widest font-semibold">Security Portal</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-1">Username</label>
              <input 
                type="text" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-600 text-sm"
                placeholder="Enter username"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                required 
              />
            </div>

            <div>
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-1">Password</label>
              <input 
                type="password" 
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-600 text-sm"
                placeholder="••••••••"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required 
              />
            </div>

            {/* Error Message Display */}
            {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl text-xs text-center font-bold animate-pulse">
                   ⚠️ {errorMsg}
                </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 transform transition active:scale-95 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  Secure Login
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <button 
              onClick={() => navigate('/')}
              className="text-gray-500 text-[10px] font-bold uppercase tracking-widest hover:text-blue-400 transition"
            >
              ← Back to Main Site
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
