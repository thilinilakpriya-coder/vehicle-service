import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const CheckStatus = () => {
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Railway Backend URL එක මෙතනට ආදේශ කර ඇත
  const API_BASE_URL = "https://vehicle-service-production-198a.up.railway.app/api";

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setBookingData(null);

    try {
      // Localhost වෙනුවට Railway URL එක භාවිතා කර සෙවීම සිදු කරයි
      const res = await axios.get(`${API_BASE_URL}/bookings/status/${vehicleNumber.toUpperCase()}`);
      setBookingData(res.data);
    } catch (err) {
      setError('වාහන අංකය හමු නොවීය. කරුණාකර නිවැරදි අංකය ඇතුළත් කරන්න.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-6 overflow-hidden bg-slate-950">
      
      {/* Background Section */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20000ms] scale-110 motion-safe:animate-pulse"
        style={{ 
          backgroundImage: `url('https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=1920')`, 
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-slate-950/90 to-blue-900/40 backdrop-blur-sm"></div>
      </div>

      <div className="relative z-10 w-full max-w-md bg-black/60 backdrop-blur-2xl border border-white/10 p-8 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.8)]">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mb-4 border border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <h2 className="text-2xl font-black text-center uppercase tracking-tighter text-blue-400">
              Track Your <span className="text-white">Service</span>
            </h2>
            <p className="text-gray-500 text-[9px] font-black uppercase tracking-[0.4em] mt-1 italic">Real-time status monitor</p>
        </div>

        <form onSubmit={handleSearch} className="space-y-4 mb-8">
          <div className="relative">
            <label className="text-[10px] font-black text-blue-500/70 uppercase tracking-widest ml-1 mb-2 block">Enter Vehicle Number</label>
            <input 
              type="text" 
              placeholder="WP CAB-1234"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all font-bold tracking-widest uppercase text-white text-center placeholder:text-gray-700"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
              required 
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-blue-600 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/40 active:scale-95"
          >
            {loading ? 'Analyzing...' : 'Search Records'}
          </button>
        </form>

        {error && (
            <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 text-[11px] font-bold text-center italic animate-bounce">
                ⚠️ {error}
            </div>
        )}

        {bookingData && (
          <div className="bg-gradient-to-b from-white/10 to-transparent border border-white/10 rounded-3xl p-6 animate-fadeIn">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[9px] text-blue-400 font-black uppercase tracking-widest mb-1">Owner Name</p>
                <h4 className="font-bold text-lg text-white">{bookingData.customerName}</h4>
              </div>
              <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(bookingData.status)}`}>
                {bookingData.status}
              </div>
            </div>

            <div className="space-y-3 border-t border-white/10 pt-4">
              <div className="flex justify-between text-[11px] uppercase tracking-wider">
                <span className="text-gray-500 font-bold">Service Type</span>
                <span className="font-bold text-blue-200">{bookingData.serviceType}</span>
              </div>
              <div className="flex justify-between text-[11px] uppercase tracking-wider">
                <span className="text-gray-500 font-bold">Booked Date</span>
                <span className="font-bold text-white">{new Date(bookingData.date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Premium Progress Bar */}
            <div className="mt-8">
                <div className="flex justify-between text-[8px] font-black uppercase text-gray-500 mb-3 tracking-widest">
                    <span className={bookingData.status === 'Pending' ? 'text-yellow-400' : 'text-gray-600'}>Received</span>
                    <span className={bookingData.status === 'Approved' ? 'text-blue-400' : 'text-gray-600'}>Working</span>
                    <span className={bookingData.status === 'Completed' ? 'text-green-400' : 'text-gray-600'}>Ready</span>
                </div>
                <div className="w-full h-1.5 bg-white/5 rounded-full p-[1px]">
                    <div className={`h-full transition-all duration-1000 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)] ${getProgressWidth(bookingData.status)}`}></div>
                </div>
            </div>
          </div>
        )}

        <div className="text-center mt-10">
            <Link to="/" className="text-[10px] text-gray-500 hover:text-blue-400 transition-colors uppercase tracking-[0.3em] font-black">
              ← Return To Dashboard
            </Link>
        </div>
      </div>

      <p className="relative z-10 mt-8 text-gray-800 text-[10px] tracking-[0.5em] font-black uppercase">Elite Vehicle Tracking System</p>
    </div>
  );
};

// Helper Functions
const getStatusStyle = (status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.1)]';
    case 'Approved': return 'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]';
    case 'Completed': return 'bg-green-500/10 text-green-400 border-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.1)]';
    default: return 'bg-red-500/10 text-red-500 border-red-500/20';
  }
};

const getProgressWidth = (status) => {
    if(status === 'Pending') return 'w-1/3 bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]';
    if(status === 'Approved') return 'w-2/3 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]';
    if(status === 'Completed') return 'w-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]';
    return 'w-0';
}

export default CheckStatus;
