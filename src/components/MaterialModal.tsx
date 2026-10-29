import React, { useState } from 'react';
import { ScrapListing } from '../types/scrap';
import { 
  X, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Boxes, 
  Scale, 
  ShoppingCart, 
  FileCheck2, 
  Phone, 
  Mail, 
  Check 
} from 'lucide-react';

interface MaterialModalProps {
  listing: ScrapListing | null;
  onClose: () => void;
  onAddToCart: (listing: ScrapListing, qtyKg: number) => void;
}

export const MaterialModal: React.FC<MaterialModalProps> = ({ listing, onClose, onAddToCart }) => {
  if (!listing) return null;

  const [customQty, setCustomQty] = useState(listing.minOrderKg || 20);

  const handleAdd = () => {
    onAddToCart(listing, customQty);
    onClose();
  };

  const totalPrice = customQty * listing.price;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white">
              {listing.category.toUpperCase()}
            </span>
            <h3 className="font-bold text-sm sm:text-base truncate max-w-md">{listing.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          <div className="grid sm:grid-cols-2 gap-6 items-start">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-100 aspect-4/3">
              <img
                src={listing.image}
                alt={listing.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80';
                }}
                className="w-full h-full object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {listing.location}
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                    {listing.grade || 'Standard Secondary Scrap'}
                  </span>
                  <div className="flex items-center text-amber-500 text-xs font-bold gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{listing.rating}</span>
                    <span className="text-slate-400 font-normal">({listing.reviewsCount || 12})</span>
                  </div>
                </div>

                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-3xl font-black text-emerald-600">₹{listing.price}</span>
                  <span className="text-xs text-slate-500 font-medium">/ kg</span>
                  <span className="text-xs text-slate-400 ml-2">
                    (₹{(listing.price * 1000).toLocaleString()}/ton)
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Boxes className="w-4 h-4 text-emerald-600" /> Total Available Stock:
                  </span>
                  <strong className="text-slate-800">{listing.availableKg.toLocaleString()} kg</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Scale className="w-4 h-4 text-emerald-600" /> Minimum Order Quantity:
                  </span>
                  <strong className="text-slate-800">{listing.minOrderKg} kg</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" /> Regulatory Compliance:
                  </span>
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> CPCB Compliant
                  </span>
                </div>
              </div>

              {/* Seller Information */}
              <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/50 text-xs space-y-1">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Seller: {listing.seller}
                </p>
                {listing.sellerPhone && (
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> {listing.sellerPhone}
                  </p>
                )}
                {listing.sellerEmail && (
                  <p className="text-slate-600 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> {listing.sellerEmail}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Material Specification & Grading
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              {listing.description ||
                'Inspected industrial sorted scrap. Free from excessive moisture, slag, and foreign contaminations. Digital scale verified.'}
            </p>
          </div>

          {/* Order Quantity Selector */}
          <div className="p-4 bg-emerald-50/70 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Select Purchase Quantity (kg):
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={listing.minOrderKg}
                  max={listing.availableKg}
                  step={10}
                  value={customQty}
                  onChange={(e) => setCustomQty(Math.max(listing.minOrderKg, Number(e.target.value) || listing.minOrderKg))}
                  className="w-28 px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg font-bold text-slate-800 focus:outline-emerald-500"
                />
                <span className="text-xs text-slate-600 font-semibold">kg</span>
                <span className="text-[11px] text-slate-500">(Min: {listing.minOrderKg} kg)</span>
              </div>
            </div>

            <div className="text-right sm:text-right w-full sm:w-auto">
              <span className="text-xs text-slate-500 block">Total Estimated Amount:</span>
              <span className="text-2xl font-black text-emerald-700">₹{totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition"
          >
            Close
          </button>
          <button
            onClick={handleAdd}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" /> Add {customQty} kg to Scrap Cart
          </button>
        </div>
      </div>
    </div>
  );
};
