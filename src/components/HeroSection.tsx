import React from 'react';
import { Truck, Search, Scale, Handshake, IndianRupee, ShieldCheck, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onScrollToSell: () => void;
  onScrollToBuy: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollToSell, onScrollToBuy }) => {
  return (
    <section id="home" className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white py-14 sm:py-20 overflow-hidden border-b border-emerald-950">
      {/* Background circular accents */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Headline and Call-to-actions */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Sustainable B2B & Local Circular Economy Platform</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-black tracking-tight leading-[1.15]">
            Turn Industrial & Household Scrap Into{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 underline decoration-emerald-500/40">
              Instant Verified Revenue
            </span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            Connect directly with verified scrap recyclers, foundries, and bulk buyers. Transparent digital weighing scales, live market benchmarks, and zero-landfill compliance certification.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-3">
            <button
              onClick={onScrollToSell}
              className="w-full sm:w-auto px-7 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition transform hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm"
            >
              <Truck className="w-4 h-4" />
              Schedule Doorstep Pickup
            </button>
            <button
              onClick={onScrollToBuy}
              className="w-full sm:w-auto px-7 py-3.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 font-semibold rounded-xl transition flex items-center justify-center gap-2 text-sm"
            >
              <Search className="w-4 h-4 text-emerald-400" />
              Explore Marketplace Stock
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 pt-2 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Free pickup on bulk &gt; 50 kg
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> Digital calibrated scales
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" /> CPCB Green manifest
            </span>
          </div>
        </div>

        {/* Right Column: Visual Stats Grid */}
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 hover:border-emerald-500/40 transition shadow-xl">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl mb-3">
              <Scale className="w-5 h-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">18,500+</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              Metric Tons Recycled
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 hover:border-blue-500/40 transition shadow-xl">
            <div className="w-11 h-11 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl mb-3">
              <Handshake className="w-5 h-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">5,400+</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              Verified Recyclers
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 hover:border-amber-500/40 transition shadow-xl">
            <div className="w-11 h-11 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl mb-3">
              <IndianRupee className="w-5 h-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">100%</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              Instant UPI / Cash Payout
            </p>
          </div>

          <div className="bg-slate-900/80 backdrop-blur-md p-5 rounded-2xl border border-slate-800 hover:border-purple-500/40 transition shadow-xl">
            <div className="w-11 h-11 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-white">4.9 / 5.0</p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
              Trader Trust Rating
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
