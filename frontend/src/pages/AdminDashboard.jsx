import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// ✅ ඔයාගේ Railway URL එක මෙතනට මම ඇතුළත් කළා
const API_BASE_URL = 'https://vehicle-service-production-198a.up.railway.app/api';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [messages, setMessages] = useState([]);
  const [reviews, setReviews] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [newService, setNewService] = useState({ 
    serviceName: '', 
    vehicleType: '', 
    price: '' 
  });
  
  const navigate = useNavigate();

  const handleLogout = useCallback(() => { 
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.clear();
    navigate('/admin-login', { replace: true }); 
  }, [navigate]);

  const getAuthConfig = useCallback(() => {
    const token = localStorage.getItem('adminToken');
    return {
      headers: { 'Authorization': `Bearer ${token}` }
    };
  }, []);

  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (!token || isAuthenticated !== 'true') {
      handleLogout();
      return;
    }

    try {
      const config = getAuthConfig();
      // Fetching data from Railway
      const [bRes, sRes, mRes, rRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/bookings`, config),
        axios.get(`${API_BASE_URL}/services`, config),
        axios.get(`${API_BASE_URL}/messages`, config),
        axios.get(`${API_BASE_URL}/reviews`, config)
      ]);

      setBookings(bRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); 
      setServices(sRes.data);
      setMessages(mRes.data);
      setReviews(rRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    } catch (err) {
      console.error("Backend Connection Error:", err);
      setLoading(false); 
      // Error එකක් ආවොත් alert එකක් දෙනවා URL එක check කරන්න කියලා
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        handleLogout();
      }
    }
  }, [handleLogout, getAuthConfig]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- UI Actions ---
  const updateStatus = async (id, newStatus) => {
    try {
      let updateData = { status: newStatus };
      if (newStatus === 'Completed') {
        const currentBooking = bookings.find(b => b._id === id);
        const serviceInfo = services.find(s => s.serviceName === currentBooking?.serviceType);
        if (serviceInfo) updateData.price = serviceInfo.price;
      }
      await axios.put(`${API_BASE_URL}/bookings/${id}/status`, updateData, getAuthConfig());
      fetchData();
    } catch (err) { alert("Error updating status"); }
  };

  const deleteItem = async (type, id) => {
    if (window.confirm(`Delete this ${type}?`)) {
      try {
        await axios.delete(`${API_BASE_URL}/${type}/${id}`, getAuthConfig());
        fetchData();
      } catch (err) { alert(`Error deleting ${type}`); }
    }
  };

  // --- Calculations ---
  const calculateIncome = () => {
    const now = new Date();
    let daily = 0; let monthly = 0;
    bookings.filter(b => b.status === 'Completed').forEach(b => {
      const bDate = new Date(b.createdAt);
      const bPrice = Number(b.price) || 0;
      if (bDate.toDateString() === now.toDateString()) daily += bPrice;
      if (bDate.getMonth() === now.getMonth()) monthly += bPrice;
    });
    return { daily, monthly };
  };

  const { daily, monthly } = calculateIncome();
  const chartData = [
    { name: 'Pending', value: bookings.filter(b => b.status === 'Pending').length, color: '#facc15' },
    { name: 'Approved', value: bookings.filter(b => b.status === 'Approved').length, color: '#60a5fa' },
    { name: 'Completed', value: bookings.filter(b => b.status === 'Completed').length, color: '#4ade80' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-500 font-bold animate-pulse text-xs uppercase">Connecting to Railway Server...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent uppercase">AutoCare Admin</h1>
          <button onClick={handleLogout} className="bg-red-500/10 text-red-400 border border-red-500/20 px-6 py-2 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold text-xs uppercase">Logout</button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl w-fit mb-10">
          {['bookings', 'analytics', 'services'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}>{tab}</button>
          ))}
        </div>

        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <input type="text" placeholder="Search Vehicle..." className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm outline-none focus:border-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
               <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] text-blue-400 font-black uppercase">
                    <tr>
                      <th className="p-6">Client</th>
                      <th className="p-6">Vehicle</th>
                      <th className="p-6 text-center">Status</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.filter(b => b.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())).map((b) => (
                      <tr key={b._id} className="hover:bg-white/[0.02]">
                        <td className="p-6 font-bold">{b.customerName}</td>
                        <td className="p-6 font-mono text-xs text-blue-200">{b.vehicleNumber}</td>
                        <td className="p-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${getStatusStyle(b.status)}`}>{b.status}</span>
                        </td>
                        <td className="p-6 text-right space-x-2">
                           {b.status === 'Pending' && <button onClick={() => updateStatus(b._id, 'Approved')} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">✓</button>}
                           {b.status === 'Approved' && <button onClick={() => updateStatus(b._id, 'Completed')} className="p-2 bg-green-500/10 text-green-400 rounded-lg">✓</button>}
                           <button onClick={() => deleteItem('bookings', b._id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg">✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const getStatusStyle = (status) => {
  if (status === 'Pending') return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  if (status === 'Approved') return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  return 'bg-green-500/10 text-green-400 border-green-500/20';
};

export default AdminDashboard;
