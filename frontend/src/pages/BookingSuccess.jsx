import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BookingSuccess = () => {
  const navigate = useNavigate();

  // තත්පර 10 කට පසු ස්වයංක්‍රීයව Home Page එකට යැවීම
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black overflow-hidden relative">
      
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-green-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[3rem] shadow-2xl text-center z-10 border-b-green-500/30 animate-fadeIn">
        
        {/* Animated Success Checkmark */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping opacity-25"></div>
            <div className="w-24 h-24 bg-gradient-to-br from-green-500/20 to-emerald-500/10 rounded-full flex items-center justify-center border border-green-500/30 relative shadow-[0_0_30px_rgba(34,197,94,0.2)]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Success Message */}
        <h2 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Booking <span className="text-green-400">Received!</span></h2>
        <div className="h-1 w-12 bg-green-500 mx-auto mb-6 rounded-full"></div>
        
        <p className="text-gray-400 mb-8 leading-relaxed text-sm font-medium px-4">
          Thank you for choosing <span className="text-blue-400 font-bold uppercase tracking-tighter">Auto-Care Elite</span>. 
          Your appointment is being processed. Our team will contact you shortly to confirm your time slot.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          
          {/* Get Directions (Corrected Google Maps Link) */}
          <a 
            href="https://www.google.com/maps?q=Auto+Care+Elite+Colombo" 
            target="_blank" 
            rel="noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95 group"
          >
            <svg className="h-4 w-4 text-blue-400 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Get Directions
          </a>

          {/* Call Center Support */}
          <a 
            href="tel:+94112345678" 
            className="flex items-center justify-center gap-3 w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl shadow-xl shadow-blue-500/20 transition-all active:scale-95"
          >
             <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            Emergency Contact
          </a>

          <div className="pt-4">
            <p className="text-[9px] text-gray-600 uppercase tracking-widest mb-4 italic">Redirecting to home in 10 seconds...</p>
            <Link 
              to="/" 
              className="inline-block text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black hover:text-white transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>

      </div>
      
      {/* Subtle Footer */}
      <p className="absolute bottom-10 text-gray-800 text-[9px] tracking-[0.5em] font-bold uppercase">© 2026 Auto-Care Elite Premium</p>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default BookingSuccess;
