import React, { useState } from 'react';
import axios from 'axios';

// ✅ ඔයාගේ Railway Backend URL එක මෙතනට ඇතුළත් කළා
const API_BASE_URL = 'https://vehicle-service-production-198a.up.railway.app/api';

const ContactUs = () => {
  // hold the data in the form
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // Updating the state when the input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // ✅ Localhost වෙනුවට Railway URL එක පාවිච්චි කරයි
      const response = await axios.post(`${API_BASE_URL}/messages`, formData);
      if (response.status === 201 || response.status === 200) {
        setSent(true);
        setFormData({ fullName: '', email: '', message: '' }); 
        setTimeout(() => setSent(false), 5000); 
      }
    } catch (error) {
      console.error("Message error:", error);
      alert("පණිවිඩය යැවීමට නොහැකි විය. පසුව උත්සාහ කරන්න.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black p-6 flex flex-col items-center justify-center">
      
      <div className="w-full max-w-5xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-500">
        <div className="flex flex-col md:flex-row">
          
          {/* 📞 Contact Information Section */}
          <div className="w-full md:w-1/2 p-10 bg-gradient-to-br from-blue-600 to-indigo-800 text-white flex flex-col justify-center">
            <h2 className="text-4xl font-black mb-6">Get in <span className="text-blue-200">Touch</span></h2>
            <p className="text-blue-100/80 mb-10 text-sm leading-relaxed tracking-wide">
              Have questions about our service? Reach out to our expert team for any technical inquiries or booking assistance.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-2xl text-xl">📍</div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Our Location</p>
                  <p className="font-bold text-sm">No. 123, Galle Road, Colombo 03, Sri Lanka.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-2xl text-xl">📞</div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Call Us</p>
                  <p className="font-bold">+94 112 345 678</p>
                  <p className="text-xs font-medium text-blue-100">+94 777 123 456 (WhatsApp)</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-2xl text-xl">✉️</div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-200">Email Address</p>
                  <p className="font-bold text-sm">support@autocareelite.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* 📩 Send Message Form Section */}
          <div className="w-full md:w-1/2 p-10 bg-slate-900/50">
            <h3 className="text-2xl font-black text-white mb-8">Send a <span className="text-blue-500">Message</span></h3>
            
            {sent && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-2xl text-green-400 text-xs font-bold text-center animate-bounce">
                ✅ Your message has been sent successfully!
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
                <input 
                  type="text" 
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
                  placeholder="Enter your name" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1 mb-2 block">Email Address</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all" 
                  placeholder="email@example.com" 
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-blue-400 uppercase tracking-widest ml-1 mb-2 block">Message</label>
                <textarea 
                  rows="4" 
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all resize-none" 
                  placeholder="How can we help you?"
                ></textarea>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className={`w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95 flex justify-center items-center gap-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

        </div>
      </div>

      <p className="mt-8 text-gray-600 text-[10px] tracking-[0.4em] font-bold uppercase">© 2026 Auto-Care Elite Premium</p>
    </div>
  );
};

export default ContactUs;
