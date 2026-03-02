import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

  /**
    clear all when logout
   */
  const handleLogout = useCallback(() => { 
    localStorage.removeItem('adminToken');
    localStorage.removeItem('isAuthenticated');
    localStorage.clear(); // Safe measure
    navigate('/admin-login', { replace: true }); 
  }, [navigate]);

  /**
   *  Putting the Token in the Header
   */
  const getAuthConfig = useCallback(() => {
    const token = localStorage.getItem('adminToken');
    return {
      headers: { 
        'Authorization': `Bearer ${token}`
      }
    };
  }, []);

  /**
   * Auth Check
   */
  const fetchData = useCallback(async () => {
    const token = localStorage.getItem('adminToken');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    //  SECURITY: Token checking
    if (!token || isAuthenticated !== 'true') {
      handleLogout();
      return;
    }

    try {
      const config = getAuthConfig();
      const [bRes, sRes, mRes, rRes] = await Promise.all([
        axios.get('http://localhost:5000/api/bookings', config),
        axios.get('http://localhost:5000/api/services', config),
        axios.get('http://localhost:5000/api/messages', config),
        axios.get('http://localhost:5000/api/reviews', config)
      ]);

      setBookings(bRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))); 
      setServices(sRes.data);
      setMessages(mRes.data);
      setReviews(rRes.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      // Force logout on 401 (Unauthorized) or 403 (Forbidden) errors
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        handleLogout();
      }
    }
  }, [handleLogout, getAuthConfig]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- API ACTIONS ---
  const updateStatus = async (id, newStatus) => {
    try {
      let updateData = { status: newStatus };
      if (newStatus === 'Completed') {
        const currentBooking = bookings.find(b => b._id === id);
        const serviceInfo = services.find(s => s.serviceName === currentBooking?.serviceType);
        if (serviceInfo) updateData.price = serviceInfo.price;
      }
      await axios.put(`http://localhost:5000/api/bookings/${id}/status`, updateData, getAuthConfig());
      fetchData();
    } catch (err) { alert("Error updating status"); }
  };

  const updateReviewStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/reviews/${id}/status`, { status: newStatus }, getAuthConfig());
      fetchData();
    } catch (err) { alert("Error updating review status"); }
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/services', newService, getAuthConfig());
      setNewService({ serviceName: '', vehicleType: '', price: '' });
      fetchData();
    } catch (err) { alert("Error adding service"); }
  };

  const deleteItem = async (type, id) => {
    if (window.confirm(`Want to delete this forever?`)) {
      try {
        await axios.delete(`http://localhost:5000/api/${type}/${id}`, getAuthConfig());
        fetchData();
      } catch (err) { alert(`Error deleting ${type}`); }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-500 font-bold animate-pulse tracking-widest uppercase text-xs">Verifying Access...</p>
        </div>
      </div>
    );
  }
  

  // Analytics logic
  const calculateIncome = () => {
    const now = new Date();
    const todayStr = now.toDateString();
    let daily = 0; let monthly = 0;
    bookings.filter(b => b.status === 'Completed').forEach(b => {
      const bDate = new Date(b.createdAt);
      const bPrice = Number(b.price) || 0;
      if (bDate.toDateString() === todayStr) daily += bPrice;
      if (bDate.getMonth() === now.getMonth() && bDate.getFullYear() === now.getFullYear()) monthly += bPrice;
    });
    return { daily, monthly };
  };
  const { daily, monthly } = calculateIncome();
  const chartData = [
    { name: 'Pending', value: bookings.filter(b => b.status === 'Pending').length, color: '#facc15' },
    { name: 'Approved', value: bookings.filter(b => b.status === 'Approved').length, color: '#60a5fa' },
    { name: 'Completed', value: bookings.filter(b => b.status === 'Completed').length, color: '#4ade80' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 md:p-8 lg:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent uppercase tracking-tighter">AutoCare Admin</h1>
            <p className="text-gray-500 text-[10px] uppercase tracking-[0.3em] mt-1 font-bold">Encrypted Session Active</p>
          </div>
          <button onClick={handleLogout} className="w-full sm:w-auto flex justify-center items-center gap-2 bg-red-500/10 text-red-400 border border-red-500/20 px-6 py-2.5 rounded-xl hover:bg-red-500 hover:text-white transition-all font-bold text-xs uppercase tracking-widest">Logout</button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl w-full sm:w-fit mb-10 overflow-x-auto">
          {['bookings', 'analytics', 'services', 'messages', 'reviews'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`px-6 md:px-8 py-3 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* --- BOOKINGS TAB --- */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <StatCard title="Total" value={bookings.length} color="blue" />
               <StatCard title="Pending" value={bookings.filter(b => b.status === 'Pending').length} color="yellow" />
               <StatCard title="Approved" value={bookings.filter(b => b.status === 'Approved').length} color="indigo" />
               <StatCard title="Done" value={bookings.filter(b => b.status === 'Completed').length} color="green" />
            </div>
            
            <input type="text" placeholder="Search from Vehicle Number..." className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-sm focus:border-blue-500 outline-none transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden overflow-x-auto">
               <table className="w-full text-left min-w-[700px]">
                  <thead className="bg-white/5 text-[10px] text-blue-400 font-black uppercase">
                    <tr>
                      <th className="p-6">Client</th>
                      <th className="p-6">Vehicle</th>
                      <th className="p-6">Service</th>
                      <th className="p-6 text-center">Status</th>
                      <th className="p-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {bookings.filter(b => b.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase())).map((b) => (
                      <tr key={b._id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="p-6">
                          <div className="font-bold text-sm">{b.customerName}</div>
                          <div className="text-[9px] text-gray-500">{b.phone}</div>
                        </td>
                        <td className="p-6 font-mono text-xs text-blue-200">{b.vehicleNumber}</td>
                        <td className="p-6 text-xs">{b.serviceType}</td>
                        <td className="p-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase border ${getStatusStyle(b.status)}`}>{b.status}</span>
                        </td>
                        <td className="p-6 text-right space-x-2">
                           {b.status === 'Pending' && <button onClick={() => updateStatus(b._id, 'Approved')} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white transition-all">✓</button>}
                           {b.status === 'Approved' && <button onClick={() => updateStatus(b._id, 'Completed')} className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500 hover:text-white transition-all">✓</button>}
                           <button onClick={() => deleteItem('bookings', b._id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition-all">✕</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          </div>
        )}

        {/* --- ANALYTICS TAB --- */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 rounded-3xl text-center">
                <p className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Today's Income</p>
                <h2 className="text-3xl font-black mt-2">Rs. {daily.toLocaleString()}</h2>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 p-8 rounded-3xl text-center">
                <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest">Monthly Income</p>
                <h2 className="text-3xl font-black mt-2">Rs. {monthly.toLocaleString()}</h2>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                  <XAxis dataKey="name" tick={{fill: '#94a3b8', fontSize: 10}} />
                  <YAxis tick={{fill: '#94a3b8', fontSize: 10}} />
                  <Tooltip cursor={{fill: '#ffffff05'}} contentStyle={{backgroundColor: '#0f172a', border: 'none', borderRadius: '12px'}} />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                    {chartData.map((e, i) => <Cell key={i} fill={e.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* --- SERVICES TAB --- */}
        {activeTab === 'services' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
            <div className="lg:col-span-1">
              <form onSubmit={handleAddService} className="bg-white/5 border border-white/10 p-6 rounded-3xl space-y-4 sticky top-6">
                <h2 className="text-sm font-black uppercase tracking-widest text-blue-400 mb-4">Add New Service</h2>
                <input required type="text" placeholder="Service Name" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-blue-500" value={newService.serviceName} onChange={e => setNewService({...newService, serviceName: e.target.value})} />
                <input required type="text" placeholder="Vehicle Type (Bike/Car)" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-blue-500" value={newService.vehicleType} onChange={e => setNewService({...newService, vehicleType: e.target.value})} />
                <input required type="number" placeholder="Price (Rs.)" className="w-full bg-slate-900 border border-white/10 p-3 rounded-xl text-xs text-white outline-none focus:border-blue-500" value={newService.price} onChange={e => setNewService({...newService, price: e.target.value})} />
                <button type="submit" className="w-full bg-blue-600 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg shadow-blue-600/20">Add Service</button>
              </form>
            </div>
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map(s => (
                <div key={s._id} className="bg-white/5 border border-white/10 p-6 rounded-3xl relative group hover:border-blue-500/50 transition-all">
                  <button onClick={() => deleteItem('services', s._id)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-all p-2 bg-red-500/10 rounded-lg">✕</button>
                  <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">{s.vehicleType}</p>
                  <h3 className="font-black text-lg">{s.serviceName}</h3>
                  <p className="text-xl font-mono text-emerald-400 mt-2">Rs. {s.price}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- MESSAGES TAB --- */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
            {messages.map(m => (
              <div key={m._id} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:border-blue-500/30 transition-all">
                <div className="flex justify-between mb-4">
                  <h3 className="font-bold text-blue-300">{m.name}</h3>
                  <button onClick={() => deleteItem('messages', m._id)} className="text-red-400 text-[10px] font-black uppercase px-3 py-1 bg-red-500/10 rounded-lg">Delete</button>
                </div>
                <p className="text-xs text-gray-400 mb-4 italic leading-relaxed">"{m.message}"</p>
                <div className="pt-4 border-t border-white/5">
                   <p className="text-[10px] text-gray-500 font-mono">{m.email}</p>
                   <p className="text-[10px] text-blue-400 font-mono mt-1">{m.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- REVIEWS TAB --- */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeIn">
            {reviews.map(r => (
              <div key={r._id} className={`bg-white/5 border p-6 rounded-3xl flex flex-col justify-between transition-all ${r.status === 'Pending' ? 'border-yellow-500/20 shadow-lg shadow-yellow-500/5' : 'border-white/10'}`}>
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-sm text-blue-400">{r.customerName}</h4>
                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase border ${r.status === 'Pending' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/5' : 'text-green-500 border-green-500/20 bg-green-500/5'}`}>
                      {r.status || 'Pending'}
                    </span>
                  </div>
                  <div className="flex text-yellow-400 text-[10px] mb-3">
                    {"★".repeat(r.rating)}{"☆".repeat(5-r.rating)}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed mb-6 italic">"{r.comment}"</p>
                </div>

                <div className="flex gap-2">
                  {r.status === 'Pending' && (
                    <button 
                      onClick={() => updateReviewStatus(r._id, 'Approved')} 
                      className="flex-1 bg-blue-600 hover:bg-blue-500 text-white text-[9px] font-black uppercase py-2.5 rounded-xl transition-all"
                    >
                      Approve
                    </button>
                  )}
                  <button 
                    onClick={() => deleteItem('reviews', r._id)} 
                    className="px-4 py-2.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl hover:bg-red-500 hover:text-white transition-all text-[9px] font-black uppercase"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

// Helper Components
const StatCard = ({ title, value, color }) => {
  const colors = { 
    blue: 'text-blue-400 bg-blue-400/5', 
    yellow: 'text-yellow-400 bg-yellow-400/5', 
    indigo: 'text-indigo-400 bg-indigo-400/5', 
    green: 'text-green-400 bg-green-400/5' 
  };
  return (
    <div className={`bg-white/5 border border-white/10 p-6 rounded-3xl text-center transition-transform hover:scale-105 ${colors[color]}`}>
      <p className="text-gray-500 text-[9px] font-black uppercase mb-1 tracking-widest">{title}</p>
      <h3 className="text-2xl font-black">{value}</h3>
    </div>
  );
};

const getStatusStyle = (status) => {
  if (status === 'Pending') return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
  if (status === 'Approved') return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  return 'bg-green-500/10 text-green-400 border-green-500/20';
};

export default AdminDashboard;