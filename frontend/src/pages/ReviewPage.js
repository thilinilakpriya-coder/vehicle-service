import React, { useState, useEffect } from 'react';
import axios from 'axios';

// ✅ ඔයාගේ Railway Backend URL එක මෙතනට ඇතුළත් කළා
const API_BASE_URL = 'https://vehicle-service-production-198a.up.railway.app/api';

const ReviewPage = () => {
    const [reviews, setReviews] = useState([]);
    const [formData, setFormData] = useState({
        customerName: '',
        rating: 5,
        comment: ''
    });
    const [loading, setLoading] = useState(false);

    // ✅ Approved Reviews පමණක් Fetch කිරීම
    const fetchReviews = async () => {
        try {
            const res = await axios.get(`${API_BASE_URL}/reviews/approved`);
            setReviews(res.data);
        } catch (err) {
            console.error("Reviews fetching error:", err);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    // ✅ Review එකක් Submit කිරීම
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/reviews`, formData);
            alert("ස්තුතියි! ඔබගේ අදහස අපට ලැබුණා. Admin අනුමත කළ පසු එය මෙහි දිස්වනු ඇත.");
            setFormData({ customerName: '', rating: 5, comment: '' });
        } catch (err) {
            console.error("Submit error:", err);
            alert("Review එක යැවීමට නොහැකි විය. පසුව උත්සාහ කරන්න.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#05080a] text-white pt-28 pb-10 px-4 font-sans">
            {/* Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="max-w-6xl mx-auto">
                
                {/* Header Section */}
                <div className="text-center mb-16 animate-fadeIn">
                    <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4 leading-none">
                        CUSTOMER <span className="bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent">FEEDBACK</span>
                    </h2>
                    <div className="flex justify-center items-center gap-4">
                        <div className="h-[1px] w-12 bg-blue-500/50"></div>
                        <p className="text-gray-500 uppercase tracking-[0.3em] text-[10px] font-bold">Share Your Experience</p>
                        <div className="h-[1px] w-12 bg-blue-500/50"></div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Left: Review Form */}
                    <div className="lg:col-span-5 bg-white/[0.03] backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl sticky top-28">
                        <h4 className="text-2xl font-black mb-8 italic uppercase tracking-tighter">
                            Write a <span className="text-blue-500">Review</span> ✍️
                        </h4>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-black ml-1 mb-2 block">Your Full Name</label>
                                <input 
                                    type="text" placeholder="Ex: Kamal Perera" required 
                                    value={formData.customerName}
                                    onChange={(e) => setFormData({...formData, customerName: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-700"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-black ml-1 mb-2 block">Rating Experience</label>
                                <div className="relative">
                                    <select 
                                        value={formData.rating}
                                        onChange={(e) => setFormData({...formData, rating: e.target.value})}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="5" className="bg-[#0a0a0a]">⭐⭐⭐⭐⭐ (Excellent)</option>
                                        <option value="4" className="bg-[#0a0a0a]">⭐⭐⭐⭐ (Good)</option>
                                        <option value="3" className="bg-[#0a0a0a]">⭐⭐⭐ (Average)</option>
                                        <option value="2" className="bg-[#0a0a0a]">⭐⭐ (Poor)</option>
                                        <option value="1" className="bg-[#0a0a0a]">⭐ (Very Bad)</option>
                                    </select>
                                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500 text-xs font-black italic">SELECT</div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] uppercase tracking-[0.2em] text-blue-400 font-black ml-1 mb-2 block">Your Feedback</label>
                                <textarea 
                                    placeholder="Describe your experience with our service..." required rows="4"
                                    value={formData.comment}
                                    onChange={(e) => setFormData({...formData, comment: e.target.value})}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-gray-700 resize-none"
                                />
                            </div>

                            <button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl transition-all duration-500 shadow-xl shadow-blue-600/20 uppercase tracking-widest text-xs italic group">
                                <span className="group-hover:mr-2 transition-all">{loading ? 'Submitting...' : 'Submit Review'}</span> 🚀
                            </button>
                        </form>
                    </div>

                    {/* Right: Review List */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex items-center justify-between">
                            <h4 className="text-xl font-black uppercase tracking-tighter italic">
                                Latest <span className="text-blue-500">Testimonials</span> 💬
                            </h4>
                            <span className="bg-blue-500/10 text-blue-400 px-4 py-1 rounded-full text-[10px] font-black border border-blue-500/20 uppercase">
                                {reviews.length} Feedbacks
                            </span>
                        </div>
                        
                        <div className="max-h-[700px] overflow-y-auto pr-4 space-y-6 custom-review-scroll">
                            {reviews.length === 0 ? (
                                <div className="bg-white/[0.02] border border-dashed border-white/10 p-20 rounded-[2.5rem] text-center">
                                    <div className="text-4xl mb-4 opacity-20">📭</div>
                                    <p className="text-gray-500 italic text-sm font-medium tracking-wide">No feedback yet. Be the first to share!</p>
                                </div>
                            ) : (
                                reviews.map(r => (
                                    <div key={r._id} className="group bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] hover:bg-white/[0.06] transition-all duration-500 hover:-translate-y-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center font-black text-xl italic shadow-lg shadow-blue-500/20">
                                                    {r.customerName ? r.customerName.charAt(0) : '?'}
                                                </div>
                                                <div>
                                                    <h5 className="font-black text-white leading-none uppercase tracking-tight text-lg">{r.customerName}</h5>
                                                    <div className="flex text-[10px] mt-2 tracking-[0.2em]">
                                                        {"⭐".repeat(r.rating)}
                                                        <span className="ml-2 text-gray-600">({r.rating}.0)</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest bg-black/30 px-3 py-1 rounded-lg">
                                                {new Date(r.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute -left-2 -top-2 text-4xl text-blue-500/10 font-serif">"</span>
                                            <p className="text-gray-400 text-sm leading-relaxed italic relative z-10 pl-4 border-l border-blue-500/30 ml-2">
                                                {r.comment}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* Custom CSS */}
            <style jsx>{`
                .custom-review-scroll::-webkit-scrollbar { width: 5px; }
                .custom-review-scroll::-webkit-scrollbar-track { background: transparent; }
                .custom-review-scroll::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.2); border-radius: 20px; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default ReviewPage;
