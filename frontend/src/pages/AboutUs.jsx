import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-12 px-4 md:px-6 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-blue-900 via-slate-900 to-black flex flex-col items-center">
      <div className="w-full max-w-5xl">
        
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Our <span className="text-blue-500">Legacy</span>
          </h2>
          <p className="text-gray-400 mt-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em] opacity-70 px-4">
            Redefining Auto Care Excellence Since 2015
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {/* Main Description Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl">
            <h3 className="text-xl md:text-2xl font-bold text-blue-400 mb-4 text-center md:text-left">Who We Are</h3>
            <p className="text-gray-300 leading-relaxed text-sm text-center md:text-left">
              Auto-Care Elite is more than just a service station. We are a team of passionate engineers and technicians dedicated to keeping your vehicle in peak condition. Using state-of-the-art diagnostic tools and genuine parts, we ensure every ride is safe and smooth.
            </p>
          </div>

          {/* Stats Sub-Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-600/20 border border-blue-500/20 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-center flex flex-col justify-center items-center transition-transform hover:scale-105">
              <h4 className="text-2xl md:text-4xl font-black text-white">10K+</h4>
              <p className="text-[9px] md:text-[10px] text-blue-400 font-bold uppercase mt-2 tracking-wider">Services Done</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] text-center flex flex-col justify-center items-center transition-transform hover:scale-105">
              <h4 className="text-2xl md:text-4xl font-black text-white">15+</h4>
              <p className="text-[9px] md:text-[10px] text-gray-400 font-bold uppercase mt-2 tracking-wider">Expert Staff</p>
            </div>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="mt-8 md:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {[
            { label: 'Genuine Parts', desc: 'Original Manufacturer Parts' },
            { label: 'High-Tech Tools', desc: 'Precision Diagnostics' },
            { label: 'Fast Service', desc: 'Quick & Efficient Turnaround' }
          ].map((item) => (
            <div key={item.label} className="p-5 md:p-6 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl flex items-center gap-4 hover:bg-white/10 transition-colors group">
              <div className="min-w-[40px] h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all">
                ✓
              </div>
              <div className="flex flex-col">
                <span className="text-white font-bold text-sm tracking-wide">{item.label}</span>
                <span className="text-gray-500 text-[10px] font-medium uppercase tracking-tighter">{item.desc}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note (Optional but fills space on mobile nicely) */}
        <div className="mt-16 text-center">
          <p className="text-gray-500 text-[11px] font-medium tracking-widest uppercase italic">
            "Your safety is our priority."
          </p>
        </div>

      </div>
    </div>
  );
};

export default AboutUs;