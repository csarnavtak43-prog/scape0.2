import React, { useState } from 'react';
import { CartItem, UserAccount } from '../types/scrap';
import { compressImageFile, calculateGreenImpact } from '../utils/storage';
import { X, Truck, Calendar, Clock, CreditCard, UploadCloud, Leaf, ShieldCheck, MapPin } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currentUser: UserAccount | null;
  onConfirmOrder: (orderData: {
    address: string;
    pickupDate: string;
    slot: string;
    contactPhone: string;
    paymentMethod: string;
    photo: string;
  }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  currentUser,
  onConfirmOrder,
}) => {
  if (!isOpen) return null;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [address, setAddress] = useState(
    currentUser?.companyName ? `${currentUser.companyName}, Industrial Estate, Mumbai` : ''
  );
  const [pickupDate, setPickupDate] = useState(defaultDate);
  const [slot, setSlot] = useState('10:00 AM - 01:00 PM');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');
  const [paymentMethod, setPaymentMethod] = useState('Instant UPI / QR');
  const [photoData, setPhotoData] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalWeightKg = cart.reduce((sum, item) => sum + item.qtyKg, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qtyKg, 0);
  const logisticsFee = totalWeightKg >= 100 || cart.length === 0 ? 0 : 250;
  const grandTotal = subtotal + logisticsFee;

  const primaryCategory = cart[0]?.category || 'metal';
  const greenMetrics = calculateGreenImpact(primaryCategory, totalWeightKg);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file);
      setPhotoData(compressed);
    } catch (err: any) {
      alert(err.message || 'Error processing photo');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      alert('Please enter a delivery or warehouse address.');
      return;
    }
    setIsSubmitting(true);
    onConfirmOrder({
      address,
      pickupDate,
      slot,
      contactPhone,
      paymentMethod,
      photo: photoData,
    });
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base">Schedule Scrap Pickup & Delivery</h3>
              <p className="text-[10px] text-slate-400">Doorstep digital scale logistics</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
          {/* Order Summary Pill */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
            <div className="flex justify-between font-medium text-slate-600">
              <span>Selected Scrap Items:</span>
              <span className="font-bold text-slate-900">{cart.length} item(s) • {totalWeightKg} kg</span>
            </div>
            <div className="flex justify-between font-black text-slate-900 text-sm pt-1 border-t border-slate-200">
              <span>Total Payable Amount:</span>
              <span className="text-emerald-600">₹{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Green Impact Preview */}
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center gap-2.5 text-[11px] text-emerald-800">
            <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              <strong>Circular Impact:</strong> This purchase diverts <strong>{totalWeightKg} kg</strong> from landfills and avoids ~<strong>{greenMetrics.co2SavedKg} kg of CO₂</strong> emissions!
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Full Delivery / Factory Address *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Factory / Warehouse #12, MIDC Industrial Area, Mumbai"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Preferred Date *
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  value={pickupDate}
                  onChange={(e) => setPickupDate(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Time Slot
              </label>
              <select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              >
                <option>10:00 AM - 01:00 PM (Morning)</option>
                <option>02:00 PM - 06:00 PM (Afternoon)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Contact Phone Number *
            </label>
            <input
              type="tel"
              required
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Optional Photo Attachment */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Delivery Site / Unloading Dock Photo (Optional)
            </label>
            <div className="flex items-center gap-3">
              <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300">
                <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                <span>Choose Photo</span>
                <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </label>
              <span className="text-[11px] text-slate-400">Helps truck driver locate dock</span>
            </div>
            {photoData && (
              <div className="mt-2 relative inline-block">
                <img src={photoData} alt="Dock preview" className="w-16 h-16 object-cover rounded-lg border border-emerald-300" />
                <button
                  type="button"
                  onClick={() => setPhotoData('')}
                  className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                >
                  ×
                </button>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label
                className={`p-3 border rounded-xl flex items-center gap-2 cursor-pointer transition ${
                  paymentMethod === 'Instant UPI / QR'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payMethod"
                  value="Instant UPI / QR"
                  checked={paymentMethod === 'Instant UPI / QR'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-emerald-600"
                />
                <span>Instant UPI / QR</span>
              </label>

              <label
                className={`p-3 border rounded-xl flex items-center gap-2 cursor-pointer transition ${
                  paymentMethod === 'Cash on Scale Verification'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payMethod"
                  value="Cash on Scale Verification"
                  checked={paymentMethod === 'Cash on Scale Verification'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="text-emerald-600"
                />
                <span>Cash on Scale Verification</span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 text-xs sm:text-sm mt-2"
          >
            <ShieldCheck className="w-4 h-4" /> Confirm & Schedule Order
          </button>
        </form>
      </div>
    </div>
  );
};
