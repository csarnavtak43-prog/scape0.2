import React from 'react';
import { Recycle, ShieldCheck, Heart, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onOpenEcoCalculator: () => void;
  onScrollToBuy: () => void;
  onScrollToSell: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenEcoCalculator,
  onScrollToBuy,
  onScrollToSell,
}) => {
  return (
    <footer className="bg-slate-950 text-slate-400 text-xs py-14 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Col 1: Brand & Mission */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 text-white">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center font-bold shadow-md">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight">
              Scrap<span className="text-emerald-500">Ex</span>
            </span>
          </div>
          <p className="leading-relaxed text-slate-400">
            India's premier circular economy scrap trading platform connecting bulk industrial suppliers with certified metal foundries, paper mills, and eco-recyclers.
          </p>
          <div className="pt-1 text-[11px] text-slate-500 space-y-1">
            <p className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>BKC Bandra East, Mumbai, Maharashtra 400051</span>
            </p>
            <p className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>1800-SCRAP-EX (Toll Free 24/7)</span>
            </p>
            <p className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>support@scrapex.in</span>
            </p>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h5 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
            Platform Solutions
          </h5>
          <ul className="space-y-2.5">
            <li>
              <button onClick={onScrollToBuy} className="hover:text-emerald-400 transition">
                Buy Sorted Scrap Bulk
              </button>
            </li>
            <li>
              <button onClick={onScrollToSell} className="hover:text-emerald-400 transition">
                Sell Scrap with Doorstep Pickup
              </button>
            </li>
            <li>
              <a href="#home" className="hover:text-emerald-400 transition">
                Live Daily Scrap Benchmarks
              </a>
            </li>
            <li>
              <button onClick={onOpenEcoCalculator} className="hover:text-emerald-400 transition">
                ESG Carbon Impact Calculator
              </button>
            </li>
            <li>
              <a href="#myOrders" className="hover:text-emerald-400 transition">
                Weighing Scale Receipts & Tracking
              </a>
            </li>
          </ul>
        </div>

        {/* Col 3: Categories */}
        <div>
          <h5 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
            Scrap Categories
          </h5>
          <ul className="space-y-2.5">
            <li>
              <button onClick={onScrollToBuy} className="hover:text-emerald-400 transition">
                Copper Millberry & Armature Wire
              </button>
            </li>
            <li>
              <button onClick={onScrollToBuy} className="hover:text-emerald-400 transition">
                Aluminium Section 6063 & Castings
              </button>
            </li>
            <li>
              <button onClick={onScrollToBuy} className="hover:text-emerald-400 transition">
                Heavy Melting Steel (HMS 1 & 2)
              </button>
            </li>
            <li>
              <button onClick={onScrollToBuy} className="hover:text-emerald-400 transition">
                Commercial E-Waste & Server Motherboards
              </button>
            </li>
            <li>
              <button onClick={onScrollToBuy} className="hover:text-emerald-400 transition">
                OCC Baler Cardboard & Kraft Cartons
              </button>
            </li>
          </ul>
        </div>

        {/* Col 4: Sustainability & ESG */}
        <div className="space-y-3">
          <h5 className="text-white font-bold mb-4 uppercase tracking-wider text-xs">
            Regulatory Compliance
          </h5>
          <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
              <span>CPCB & EPR Compliant</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              100% compliant e-waste handling, certified metal smelting circularity, and zero-landfill diversion protocols.
            </p>
          </div>
          <p className="text-[11px] text-slate-500 pt-2">
            © {new Date().getFullYear()} ScrapEx Circular Technologies Ltd. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};
