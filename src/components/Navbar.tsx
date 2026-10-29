import React, { useState } from 'react';
import { DailyRate, UserAccount } from '../types/scrap';
import { 
  Recycle, 
  ShoppingCart, 
  ShieldCheck, 
  TrendingUp, 
  TrendingDown, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Leaf, 
  Store, 
  Truck, 
  ClipboardList 
} from 'lucide-react';

interface NavbarProps {
  dailyRates: DailyRate[];
  cartCount: number;
  currentUser: UserAccount | null;
  onOpenCart: () => void;
  onOpenAuth: (tab: 'login' | 'register') => void;
  onLogout: () => void;
  onOpenAdmin: () => void;
  onOpenEcoCalculator: () => void;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  dailyRates,
  cartCount,
  currentUser,
  onOpenCart,
  onOpenAuth,
  onLogout,
  onOpenAdmin,
  onOpenEcoCalculator,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* LIVE MARKET SCRAP RATES TICKER */}
      <div className="bg-slate-950 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-emerald-400 font-bold shrink-0 tracking-wide">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>LIVE SCRAP BENCHMARK RATES:</span>
          </div>

          <div className="overflow-hidden flex-1 ml-4 whitespace-nowrap">
            <div className="animate-ticker flex items-center text-slate-300 font-medium">
              {dailyRates.concat(dailyRates).map((rate, idx) => (
                <span key={`${rate.id}-${idx}`} className="inline-flex items-center gap-1.5 mx-5 text-[11px] sm:text-xs">
                  <span>{rate.icon} {rate.name}:</span>
                  <strong className="text-white font-bold">₹{rate.rate}/{rate.unit}</strong>
                  {rate.changePercent > 0 ? (
                    <span className="text-emerald-400 inline-flex items-center text-[10px] font-bold">
                      <TrendingUp className="w-3 h-3 mr-0.5" /> +{rate.changePercent}%
                    </span>
                  ) : rate.changePercent < 0 ? (
                    <span className="text-rose-400 inline-flex items-center text-[10px] font-bold">
                      <TrendingDown className="w-3 h-3 mr-0.5" /> {rate.changePercent}%
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[10px] font-bold">0.0%</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN HEADER NAVIGATION */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white text-xl shadow-md group-hover:scale-105 transition-transform duration-200">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black text-slate-900 tracking-tight flex items-center">
                Scrap<span className="text-emerald-600">Ex</span>
                <span className="ml-1.5 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded">Circular</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-400 -mt-1 font-semibold">
                Trade & Doorstep Recycle
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 font-medium text-slate-600 text-sm">
            <a href="#buy" className="hover:text-emerald-600 transition flex items-center gap-1.5 font-semibold">
              <Store className="w-4 h-4 text-emerald-600" /> Buy Scrap
            </a>
            <a href="#sell" className="hover:text-emerald-600 transition flex items-center gap-1.5 font-semibold">
              <Truck className="w-4 h-4 text-emerald-600" /> Sell & Pickup
            </a>
            <a href="#myOrders" className="hover:text-emerald-600 transition flex items-center gap-1.5 font-semibold">
              <ClipboardList className="w-4 h-4 text-emerald-600" /> My Activity
            </a>
            <button
              onClick={onOpenEcoCalculator}
              className="hover:text-emerald-600 transition flex items-center gap-1.5 font-semibold text-slate-600"
            >
              <Leaf className="w-4 h-4 text-emerald-600" /> Eco Impact
            </button>
          </nav>

          {/* User, Cart & Admin Controls */}
          <div className="flex items-center gap-3">
            {/* Shopping Cart Button */}
            <button
              onClick={onOpenCart}
              className="relative p-2.5 text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-xl transition border border-transparent hover:border-slate-200"
              title="View Scrap Cart"
              aria-label="Open Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Auth / User Status */}
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-slate-200">
                <div className="text-right">
                  <span className="block text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="block text-[10px] text-emerald-700 font-semibold">
                    {currentUser.role || 'Verified Trader'}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition flex items-center gap-1"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Login
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-3.5 py-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs transition"
                >
                  Register
                </button>
              </div>
            )}

            {/* Admin Hub Button */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 hover:text-emerald-700 rounded-xl transition border border-slate-300"
              title="Open Admin Management Panel"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Admin Hub</span>
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-700 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
            <div className="flex flex-col gap-2 font-medium text-slate-700">
              <a
                href="#buy"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center gap-2.5"
              >
                <Store className="w-4 h-4 text-emerald-600" /> Buy Scrap Material
              </a>
              <a
                href="#sell"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center gap-2.5"
              >
                <Truck className="w-4 h-4 text-emerald-600" /> Sell Scrap & Doorstep Pickup
              </a>
              <a
                href="#myOrders"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center gap-2.5"
              >
                <ClipboardList className="w-4 h-4 text-emerald-600" /> My Activity Dashboard
              </a>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenEcoCalculator();
                }}
                className="py-2 px-3 rounded-lg hover:bg-slate-50 flex items-center gap-2.5 text-left w-full"
              >
                <Leaf className="w-4 h-4 text-emerald-600" /> Eco Impact Calculator
              </button>
            </div>

            <div className="pt-3 border-t border-slate-200">
              {currentUser ? (
                <div className="flex items-center justify-between">
                  <div>
                    <span className="block text-xs font-bold text-slate-900">{currentUser.name}</span>
                    <span className="block text-[10px] text-emerald-700">{currentUser.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 rounded-lg flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('login');
                    }}
                    className="w-full py-2 text-xs font-bold text-slate-700 border border-slate-300 rounded-xl hover:bg-slate-50"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('register');
                    }}
                    className="w-full py-2 text-xs font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                  >
                    Register
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
