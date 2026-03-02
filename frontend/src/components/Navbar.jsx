import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className="fixed top-0 w-full z-50 group">
      {/* Trigger Area */}
      <div className="h-6 w-full absolute top-0 z-[60]" /> 

      <nav className="bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 py-4 flex justify-between items-center transform transition-transform duration-500 ease-in-out -translate-y-full group-hover:translate-y-0 group-active:translate-y-0 shadow-2xl">
        
        <Link to="/" className="text-white font-black tracking-tighter text-lg md:text-xl italic">
          AUTO-CARE <span className="text-blue-500 font-black">ELITE</span>
        </Link>
        
        <div className="flex gap-4 md:gap-8 text-[10px] md:text-[12px] font-black uppercase tracking-widest text-white/70 items-center">
          <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact</Link>
          
           <Link to="/about" className="hover:text-blue-400 transition-colors">
          About Us
          </Link>

          <Link to="/reviews" className="hover:text-blue-400 transition-colors">
            Reviews
          </Link>
          
          <Link to="/check-status" className="text-blue-400 border border-blue-400/30 px-3 py-1.5 md:px-4 md:py-2 rounded-xl hover:bg-blue-400 hover:text-white transition-all duration-300">
            Track
          </Link>

          
        </div>
      </nav>
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-1 bg-blue-500/20 rounded-full group-hover:opacity-0 transition-opacity" />
    </div>
  );
};

export default Navbar;