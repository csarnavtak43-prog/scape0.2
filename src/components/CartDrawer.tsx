import React from 'react';
import { CartItem } from '../types/scrap';
import { ShoppingCart, X, Trash2, ArrowRight, Truck, Plus, Minus, Scale } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQty: (itemId: string, deltaKg: number) => void;
  onRemoveItem: (itemId: string) => void;
  onProceedCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQty,
  onRemoveItem,
  onProceedCheckout,
}) => {
  if (!isOpen) return null;

  const totalWeightKg = cart.reduce((sum, item) => sum + item.qtyKg, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qtyKg, 0);
  const freeThreshold = 100;
  const isFreeLogistics = totalWeightKg >= freeThreshold;
  const logisticsFee = isFreeLogistics || cart.length === 0 ? 0 : 250;
  const totalAmount = subtotal + logisticsFee;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600/30 text-emerald-400 flex items-center justify-center">
                <ShoppingCart className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold">Your Scrap Cart</h2>
                <p className="text-[10px] text-slate-400">
                  {cart.length} item{cart.length === 1 ? '' : 's'} • {totalWeightKg} kg total weight
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg transition"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bulk Free Logistics Progress Bar */}
          {cart.length > 0 && (
            <div className="bg-emerald-50 px-4 py-2.5 border-b border-emerald-100 text-xs">
              <div className="flex justify-between items-center text-emerald-950 font-semibold mb-1">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  {isFreeLogistics ? (
                    <span className="text-emerald-700 font-bold">🎉 You unlocked FREE Pickup & Transport!</span>
                  ) : (
                    <span>Add {freeThreshold - totalWeightKg} kg more for 100% FREE logistics</span>
                  )}
                </span>
                <span className="text-[10px] font-bold text-emerald-700">
                  {Math.min(100, Math.round((totalWeightKg / freeThreshold) * 100))}%
                </span>
              </div>
              <div className="w-full bg-emerald-200 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (totalWeightKg / freeThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {cart.length === 0 ? (
              <div className="py-20 text-center text-slate-400 space-y-3">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-300">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <p className="font-bold text-slate-700 text-sm">Your scrap cart is currently empty</p>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Browse verified listings in the marketplace and add sorted metals, paper, or e-waste to begin.
                </p>
                <button
                  onClick={onClose}
                  className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
                >
                  Explore Scrap Material
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemTotal = item.price * item.qtyKg;
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 shadow-2xs"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-14 h-14 rounded-lg object-cover border border-slate-200 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-800 text-xs truncate">{item.title}</h4>
                      <p className="text-[11px] text-slate-500 font-medium">₹{item.price} / kg</p>

                      {/* Weight Stepper */}
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <button
                          onClick={() => onUpdateQty(item.id, -10)}
                          className="w-6 h-6 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
                          title="Reduce 10kg"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-black text-slate-900 px-1 min-w-[48px] text-center">
                          {item.qtyKg} kg
                        </span>
                        <button
                          onClick={() => onUpdateQty(item.id, 10)}
                          className="w-6 h-6 bg-white border border-slate-300 rounded text-slate-700 hover:bg-slate-100 flex items-center justify-center transition"
                          title="Add 10kg"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => onUpdateQty(item.id, 50)}
                          className="px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded text-[10px] font-bold hover:bg-slate-300"
                          title="Add 50kg bulk"
                        >
                          +50kg
                        </button>
                      </div>
                    </div>

                    <div className="text-right flex flex-col justify-between h-full shrink-0">
                      <p className="font-black text-emerald-600 text-sm">₹{itemTotal.toLocaleString()}</p>
                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition self-end p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Drawer Footer / Checkout */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 space-y-3.5">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal ({totalWeightKg} kg):</span>
                  <span className="font-bold text-slate-800">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-slate-400" /> Doorstep Logistics & Weighing:
                  </span>
                  {isFreeLogistics ? (
                    <span className="text-emerald-700 font-extrabold uppercase">FREE</span>
                  ) : (
                    <span className="font-bold text-slate-800">₹{logisticsFee}</span>
                  )}
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                  <span>Total Payable:</span>
                  <span className="text-emerald-600">₹{totalAmount.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={onProceedCheckout}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 text-xs sm:text-sm"
              >
                Proceed to Schedule Pickup & Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
