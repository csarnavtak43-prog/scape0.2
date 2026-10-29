import React, { useState } from 'react';
import { OrderItem, SaleListing } from '../types/scrap';
import { 
  ClipboardList, 
  ShoppingBag, 
  Truck, 
  RotateCw, 
  CheckCircle, 
  Clock, 
  Package, 
  Leaf, 
  Calendar, 
  Award, 
  X,
  FileCheck2
} from 'lucide-react';

interface ActivityDashboardProps {
  orders: OrderItem[];
  sales: SaleListing[];
  onRefresh: () => void;
  onScrollToBuy: () => void;
  onScrollToSell: () => void;
}

export const ActivityDashboard: React.FC<ActivityDashboardProps> = ({
  orders,
  sales,
  onRefresh,
  onScrollToBuy,
  onScrollToSell,
}) => {
  const [activeTab, setActiveTab] = useState<'purchases' | 'sales'>('purchases');
  const [selectedCertificate, setSelectedCertificate] = useState<OrderItem | null>(null);

  const getOrderStatusBadge = (status: OrderItem['status']) => {
    switch (status) {
      case 'Scheduled for Pickup':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Out for Delivery':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getSaleStatusBadge = (status: SaleListing['status']) => {
    switch (status) {
      case 'Pickup Requested':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Collected':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Paid':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <section id="myOrders" className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-emerald-600" /> Real-time Activity
          </span>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            My Scrap Trading Dashboard
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track your scrap purchases, doorstep pickup requests, weighing scale receipts, and green compliance certificates.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={onRefresh}
            className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition flex items-center gap-1.5"
            title="Reload latest state"
          >
            <RotateCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('purchases')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'purchases'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Scrap Purchases / Orders ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('sales')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition ${
            activeTab === 'sales'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-4 h-4" />
          My Scrap Sales & Pickups ({sales.length})
        </button>
      </div>

      {/* Tab 1: PURCHASES */}
      {activeTab === 'purchases' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <Package className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700 text-sm">No scrap purchases placed yet</p>
              <p className="text-xs text-slate-500">
                Explore the marketplace to source sorted secondary metals, paper, and electronic materials.
              </p>
              <button
                onClick={onScrollToBuy}
                className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
              >
                Browse Marketplace Stock
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {orders.map((order) => {
                const totalKg = order.items.reduce((sum, it) => sum + it.qtyKg, 0);

                return (
                  <div
                    key={order.orderId}
                    className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition space-y-3.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                          {order.orderId}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getOrderStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Pickup: {order.pickupDate} ({order.slot})</span>
                      </div>
                    </div>

                    {/* Items List */}
                    <div className="space-y-2">
                      {order.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                          <div className="flex items-center gap-2.5 min-w-0">
                            {it.image && (
                              <img
                                src={it.image}
                                alt={it.title}
                                className="w-9 h-9 rounded-md object-cover border border-slate-200 shrink-0"
                              />
                            )}
                            <div className="truncate">
                              <p className="font-bold text-slate-800 truncate">{it.title}</p>
                              <p className="text-[10px] text-slate-400">Seller: {it.seller}</p>
                            </div>
                          </div>
                          <div className="text-right shrink-0 ml-3">
                            <span className="font-bold text-slate-800">{it.qtyKg} kg</span>
                            <span className="text-slate-400 block text-[10px]">₹{it.price}/kg</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Footer Details & Certificate trigger */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                      <div>
                        <p className="text-slate-500 text-[11px]">
                          <strong>Delivery Location:</strong> {order.address}
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          <strong>Payment:</strong> {order.paymentMethod} • Contact: {order.contactPhone || 'On File'}
                        </p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3">
                        <button
                          onClick={() => setSelectedCertificate(order)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-200 transition flex items-center gap-1.5 text-xs"
                        >
                          <Award className="w-3.5 h-3.5 text-emerald-600" /> Eco Certificate
                        </button>
                        <span className="text-base font-black text-emerald-600">
                          ₹{order.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: SALES */}
      {activeTab === 'sales' && (
        <div className="space-y-4">
          {sales.length === 0 ? (
            <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <Truck className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700 text-sm">No scrap sales submitted yet</p>
              <p className="text-xs text-slate-500">
                Turn your metal offcuts, old machinery, or paper waste into instant digital revenue.
              </p>
              <button
                onClick={onScrollToSell}
                className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
              >
                Schedule Doorstep Pickup
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {sales.map((sale) => (
                <div
                  key={sale.saleId}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-black text-slate-900 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        {sale.saleId}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getSaleStatusBadge(
                          sale.status
                        )}`}
                      >
                        {sale.status}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{sale.date}</span>
                  </div>

                  <div className="flex items-start gap-3.5">
                    {sale.photo ? (
                      <img
                        src={sale.photo}
                        alt={sale.material}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                        <Package className="w-6 h-6" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-slate-900 text-sm truncate">{sale.material}</h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Quantity: <strong>{sale.quantityKg} kg</strong> • Asking Rate: <strong>₹{sale.ratePerKg}/kg</strong>
                      </p>
                      {sale.details && (
                        <p className="text-[11px] text-slate-400 mt-1 line-clamp-1 italic">
                          "{sale.details}"
                        </p>
                      )}
                      <p className="text-[11px] text-slate-500 mt-1">
                        📍 Pickup Address: {sale.address}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs text-slate-400 block font-medium">Estimated Payout</span>
                      <span className="text-base font-black text-emerald-600">
                        ₹{sale.estimatedPayout.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* GREEN CIRCULARITY CERTIFICATE MODAL */}
      {selectedCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden border border-emerald-300 p-6 space-y-5 relative">
            <button
              onClick={() => setSelectedCertificate(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Award className="w-7 h-7" />
              </div>
              <span className="inline-block text-[10px] font-black uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                Verified Circular Economy Certificate
              </span>
              <h3 className="text-lg font-black text-slate-900">
                Green Recycling & Emission Offset Pass
              </h3>
              <p className="text-xs text-slate-500">
                Issued for Order <strong>#{selectedCertificate.orderId}</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-xl font-black text-emerald-700">
                  {selectedCertificate.greenImpact?.co2SavedKg || 180} kg
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-bold mt-0.5">CO₂ Offset</p>
              </div>
              <div>
                <p className="text-xl font-black text-emerald-700">
                  {selectedCertificate.greenImpact?.treesEquivalent || 12}
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-bold mt-0.5">Trees Saved</p>
              </div>
              <div>
                <p className="text-xl font-black text-emerald-700">
                  {selectedCertificate.greenImpact?.waterSavedLiters || 1500} L
                </p>
                <p className="text-[10px] text-slate-500 uppercase font-bold mt-0.5">Water Conserved</p>
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1.5 border-t border-slate-200 pt-3">
              <div className="flex justify-between">
                <span>Beneficiary:</span>
                <strong className="text-slate-900">{selectedCertificate.buyerName || 'Authorized Recycler'}</strong>
              </div>
              <div className="flex justify-between">
                <span>Verification Authority:</span>
                <span className="text-emerald-700 font-bold">CPCB Circular Standard v2.4</span>
              </div>
              <div className="flex justify-between">
                <span>Date of Issuance:</span>
                <span className="text-slate-800">{selectedCertificate.pickupDate}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedCertificate(null)}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </section>
  );
};
