import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

// ✅ ඔයාගේ Railway Backend URL එක මෙතනට දාන්න
const API_BASE_URL = 'https://vehicle-service-production-198a.up.railway.app/api';

const CustomerBooking = () => {
  const navigate = useNavigate();

  const initialFormState = {
    customerName: '',
    phone: '',
    vehicleNumber: '',
    vehicleModel: '',
    serviceType: '', 
    date: '',
    time: '',
    notes: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [services, setServices] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // 1. සර්විස් වර්ග (Services) ටික Backend එකෙන් ගෙන්වා ගැනීම
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // ✅ Localhost වෙනුවට Railway URL එක පාවිච්චි කරයි
        const res = await axios.get(`${API_BASE_URL}/services`);
        setServices(res.data);
        if (res.data.length > 0) {
          setFormData(prev => ({ ...prev, serviceType: res.data[0].serviceName }));
        }
      } catch (err) {
        console.error("Error fetching services:", err);
        setServerError("Could not load services from the server.");
      }
    };
    fetchServices();
  }, []);

  // 2. Booking එක Submit කිරීම
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setServerError('');
    
    try {
      // ✅ Localhost වෙනුවට Railway URL එක පාවිච්චි කරයි
      const response = await axios.post(`${API_BASE_URL}/bookings`, formData);
      if (response.status === 201 || response.status === 200) {
        navigate('/success'); 
      }
    } catch (error) {
      const msg = error.response?.data?.message || "The booking could not be forwarded. Please try again.";
      setServerError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
      
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-scale duration-[10000ms] hover:scale-110"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1920&auto=format&fit=crop')`, 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/70 to-blue-900/40 backdrop-blur-[2px]"></div>
      </div>

      {/* Main Form Container */}
      <div className="relative z-10 w-full max-w-xl bg-black/40 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-500">
        
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-2xl bg-blue-500/20 mb-4 animate-pulse">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Vehicle <span className="text-blue-500 uppercase">Booking</span></h2>
          <p className="text-blue-400/60 mt-2 text-[10px] font-black uppercase tracking-[0.4em]">Elite Maintenance Portal</p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-2xl text-red-400 text-xs font-bold text-center animate-bounce">
            ⚠️ {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Customer Name */}
          <div className="group">
            <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Customer Name</label>
            <input 
              type="text" 
              value={formData.customerName}
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:bg-white/10 focus:border-blue-500/50 outline-none transition-all font-medium"
              placeholder="Ex: Sunil Perera"
              onChange={(e) => setFormData({...formData, customerName: e.target.value})}
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Phone Number</label>
              <input 
                type="tel" 
                value={formData.phone}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:bg-white/10 outline-none font-medium"
                placeholder="077 123 4567"
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Vehicle Number</label>
              <input 
                type="text" 
                value={formData.vehicleNumber}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:bg-white/10 outline-none uppercase font-bold tracking-widest"
                placeholder="WP CAB-1234"
                onChange={(e) => setFormData({...formData, vehicleNumber: e.target.value})}
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Vehicle Model</label>
              <input 
                type="text" 
                value={formData.vehicleModel}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white focus:bg-white/10 outline-none font-medium"
                placeholder="Ex: Toyota Aqua"
                onChange={(e) => setFormData({...formData, vehicleModel: e.target.value})}
                required 
              />
            </div>
            
            <div>
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Service & Price</label>
              <div className="relative">
                <select 
                  value={formData.serviceType}
                  className="w-full bg-slate-900 border border-white/10 p-4 rounded-2xl text-white focus:border-blue-500 outline-none cursor-pointer appearance-none font-bold text-sm"
                  onChange={(e) => setFormData({...formData, serviceType: e.target.value})}
                  required
                >
                  <option value="" disabled>Choose service...</option>
                  {services.map(s => (
                    <option key={s._id} value={s.serviceName} className="bg-slate-900 text-white">
                      {s.serviceName} — Rs.{s.price}
                    </option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Booking Date</label>
              <input 
                type="date" 
                value={formData.date}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none font-medium [color-scheme:dark]"
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required 
              />
            </div>
            <div>
              <label className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] ml-1 mb-2 block">Time Slot</label>
              <input 
                type="time" 
                value={formData.time}
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none font-medium [color-scheme:dark]"
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-2xl shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-3 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-blue-500/50'}`}
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Confirm Appointment'}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col items-center gap-4">
          <Link 
            to="/check-status" 
            className="group flex items-center gap-3 bg-white/5 border border-white/10 px-8 py-3 rounded-2xl hover:bg-white/10 transition-all duration-300"
          >
            <span className="text-blue-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-300 group-hover:text-white transition-colors">Track My Vehicle Status</span>
          </Link>

          <Link 
            to="/admin-login" 
            className="text-[10px] font-bold text-white/20 hover:text-blue-400 uppercase tracking-[0.2em] transition-colors duration-300"
          >
            Staff Login
          </Link>
        </div>
      </div>
      
      <p className="relative z-10 mt-6 text-gray-500 text-[10px] tracking-[0.4em] font-black uppercase">Auto-Care Elite Premium Portal</p>
    </div>
  );
};

export default CustomerBooking;
