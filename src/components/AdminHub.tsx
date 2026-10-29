import React, { useState } from 'react';
import { 
  UserAccount, 
  OrderItem, 
  SaleListing, 
  ScrapListing, 
  LoginRecord 
} from '../types/scrap';
import { compressImageFile } from '../utils/storage';
import { 
  ShieldCheck, 
  X, 
  Plus, 
  Trash2, 
  Boxes, 
  ShoppingBag, 
  Users, 
  IndianRupee, 
  ArrowLeft, 
  Lock, 
  UploadCloud 
} from 'lucide-react';

interface AdminHubProps {
  isOpen: boolean;
  onClose: () => void;
  isAdminLoggedIn: boolean;
  onAdminLogin: () => void;
  onAdminLogout: () => void;
  listings: ScrapListing[];
  orders: OrderItem[];
  sales: SaleListing[];
  users: UserAccount[];
  logins: LoginRecord[];
  onUpdateOrderStatus: (orderId: string, newStatus: OrderItem['status']) => void;
  onDeleteOrder: (orderId: string) => void;
  onUpdateSaleStatus: (saleId: string, newStatus: SaleListing['status']) => void;
  onDeleteSale: (saleId: string) => void;
  onUpdateUserStatus: (userId: string, newStatus: UserAccount['status']) => void;
  onDeleteUser: (userId: string) => void;
  onUpdateLoginStatus: (index: number, newStatus: LoginRecord['status']) => void;
  onDeleteLogin: (index: number) => void;
  onDeleteListing: (listingId: string) => void;
  onAddOperationRecord: (type: 'login' | 'registered' | 'buy' | 'sale', record: any) => void;
}

export const AdminHub: React.FC<AdminHubProps> = ({
  isOpen,
  onClose,
  isAdminLoggedIn,
  onAdminLogin,
  onAdminLogout,
  listings,
  orders,
  sales,
  users,
  logins,
  onUpdateOrderStatus,
  onDeleteOrder,
  onUpdateSaleStatus,
  onDeleteSale,
  onUpdateUserStatus,
  onDeleteUser,
  onUpdateLoginStatus,
  onDeleteLogin,
  onDeleteListing,
  onAddOperationRecord,
}) => {
  if (!isOpen) return null;

  // Login credentials state if not logged in
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');

  // Active table view
  const [activeTable, setActiveTable] = useState<'login' | 'registered' | 'buy' | 'listing' | 'sale'>('sale');

  // Add Data Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [operationType, setOperationType] = useState<'login' | 'registered' | 'buy' | 'sale'>('sale');

  // Dynamic Add Form state
  const [formData, setFormData] = useState<any>({
    email: '',
    name: '',
    status: '',
    phone: '',
    material: '',
    quantityKg: 100,
    ratePerKg: 450,
    address: 'Mumbai, MH',
    orderId: '',
    amount: 25000,
    itemsText: 'Heavy Copper Wire (50kg)',
    photo: '',
  });

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      (adminUsername === 'admin' && adminPassword === 'admin123') ||
      (adminUsername.toLowerCase() === 'admin@scrapex.com' && adminPassword === 'Admin@123')
    ) {
      onAdminLogin();
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Use demo: admin / admin123');
    }
  };

  const totalOrderRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalTradedKg = orders.reduce(
    (sum, o) => sum + o.items.reduce((iSum, it) => iSum + it.qtyKg, 0),
    0
  );

  const handleOpenAddModal = (type: 'login' | 'registered' | 'buy' | 'sale') => {
    setOperationType(type);
    let defaultStatus = 'Active';
    if (type === 'login') defaultStatus = 'Login Successful';
    if (type === 'buy') defaultStatus = 'Scheduled for Pickup';
    if (type === 'sale') defaultStatus = 'Pickup Requested';

    setFormData({
      email: 'newuser@example.com',
      name: 'Rohan Deshmukh',
      status: defaultStatus,
      phone: '+91 98200 99887',
      material: 'Industrial Copper Transformer Scrap',
      quantityKg: 120,
      ratePerKg: 450,
      address: 'Plot 18, Rabale MIDC, Navi Mumbai',
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      amount: 45000,
      itemsText: 'Aluminium Section (150kg)',
      photo: '',
    });
    setIsAddModalOpen(true);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 500, 0.7);
      setFormData((prev: any) => ({ ...prev, photo: compressed }));
    } catch (err: any) {
      alert(err.message || 'Error processing photo');
    }
  };

  const handleSaveOperationData = (e: React.FormEvent) => {
    e.preventDefault();
    onAddOperationRecord(operationType, formData);
    setIsAddModalOpen(false);
  };

  // If not authenticated as Admin, show login prompt
  if (!isAdminLoggedIn) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
          <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm sm:text-base">ScrapEx Admin Login</h3>
            </div>
            <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleAdminAuthSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
            {loginError && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Admin Username
              </label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
              />
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
              Demo credentials: <strong className="text-slate-800">admin</strong> /{' '}
              <strong className="text-slate-800">admin123</strong>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
            >
              Sign In to Admin Hub
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 overflow-y-auto">
      <div className="min-h-screen pb-12">
        {/* Top Bar */}
        <header className="sticky top-0 z-10 bg-slate-950 text-white border-b border-slate-800 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-black text-sm sm:text-base tracking-tight">ScrapEx Admin Hub</h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  Management & Database Operations
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onAdminLogout}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 transition"
              >
                Logout
              </button>
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white/10 hover:bg-white/20 transition flex items-center gap-1.5 text-white"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to App
              </button>
            </div>
          </div>
        </header>

        {/* Admin Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Listings</p>
              <p className="text-3xl font-black text-emerald-600 mt-1">{listings.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Buy Orders</p>
              <p className="text-3xl font-black text-blue-600 mt-1">{orders.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Registered Users</p>
              <p className="text-3xl font-black text-purple-600 mt-1">{users.length}</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Traded Volume</p>
              <p className="text-3xl font-black text-amber-600 mt-1">₹{totalOrderRevenue.toLocaleString()}</p>
            </div>
          </div>

          {/* Table Management Container */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-black text-lg text-slate-900">📊 Admin Management Tables</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage Logins, Registered Users, Buy Orders, Marketplace Stock, and Sale Scrap submissions.
                </p>
              </div>

              <button
                onClick={() => handleOpenAddModal(activeTable === 'listing' ? 'sale' : activeTable)}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Add Operation Record
              </button>
            </div>

            {/* Table Navigation Buttons */}
            <div className="p-4 border-b border-slate-200 flex flex-wrap gap-2 bg-slate-50/50">
              <button
                onClick={() => setActiveTable('sale')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTable === 'sale'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                💰 Sale Scrap ({sales.length})
              </button>
              <button
                onClick={() => setActiveTable('buy')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTable === 'buy'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                🛒 Buy / Orders ({orders.length})
              </button>
              <button
                onClick={() => setActiveTable('registered')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTable === 'registered'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                👥 Registered Users ({users.length})
              </button>
              <button
                onClick={() => setActiveTable('login')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTable === 'login'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                🔐 Login Records ({logins.length})
              </button>
              <button
                onClick={() => setActiveTable('listing')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                  activeTable === 'listing'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                📦 Marketplace Stock ({listings.length})
              </button>
            </div>

            {/* TABLE 1: SALE SCRAP */}
            {activeTable === 'sale' && (
              <div className="p-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Sale ID</th>
                      <th className="p-3">Photo</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Seller</th>
                      <th className="p-3">Material</th>
                      <th className="p-3">Qty (kg)</th>
                      <th className="p-3">Rate / kg</th>
                      <th className="p-3">Payout</th>
                      <th className="p-3">Address</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.length === 0 ? (
                      <tr>
                        <td colSpan={11} className="p-6 text-center text-slate-400">
                          No sale scrap submissions recorded.
                        </td>
                      </tr>
                    ) : (
                      sales.map((s) => (
                        <tr key={s.saleId} className="border-b border-slate-100 hover:bg-slate-50 align-top">
                          <td className="p-3 font-mono font-bold">{s.saleId}</td>
                          <td className="p-3">
                            {s.photo ? (
                              <img src={s.photo} alt="Scrap" className="w-9 h-9 rounded-lg object-cover border" />
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="p-3 text-slate-500">{s.date}</td>
                          <td className="p-3 font-bold text-slate-900">
                            {s.seller}
                            <div className="text-[10px] text-slate-400 font-normal">{s.sellerEmail}</div>
                          </td>
                          <td className="p-3 font-semibold text-slate-800">{s.material}</td>
                          <td className="p-3">{s.quantityKg} kg</td>
                          <td className="p-3 font-bold text-emerald-700">₹{s.ratePerKg}</td>
                          <td className="p-3 font-black text-emerald-600">₹{s.estimatedPayout.toLocaleString()}</td>
                          <td className="p-3 max-w-xs truncate text-slate-600">{s.address}</td>
                          <td className="p-3">
                            <select
                              value={s.status}
                              onChange={(e) => onUpdateSaleStatus(s.saleId, e.target.value as any)}
                              className="px-2 py-1 border border-slate-300 rounded-lg bg-white font-medium text-[11px]"
                            >
                              <option value="Pickup Requested">Pickup Requested</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Collected">Collected</option>
                              <option value="Paid">Paid</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => onDeleteSale(s.saleId)}
                              className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition"
                              title="Delete record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TABLE 2: BUY / ORDERS */}
            {activeTable === 'buy' && (
              <div className="p-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Photo</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Items Purchased</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Address</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-6 text-center text-slate-400">
                          No buy / pickup orders recorded.
                        </td>
                      </tr>
                    ) : (
                      orders.map((o) => {
                        const itemSummary = o.items.map((i) => `${i.title} (${i.qtyKg}kg)`).join(', ');
                        return (
                          <tr key={o.orderId} className="border-b border-slate-100 hover:bg-slate-50 align-top">
                            <td className="p-3 font-mono font-bold">{o.orderId}</td>
                            <td className="p-3">
                              {o.photo ? (
                                <img src={o.photo} alt="Order" className="w-9 h-9 rounded-lg object-cover border" />
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="p-3 text-slate-500">{o.pickupDate || o.date}</td>
                            <td className="p-3 max-w-xs text-slate-800 font-medium">{itemSummary}</td>
                            <td className="p-3 font-black text-emerald-600">₹{o.total.toLocaleString()}</td>
                            <td className="p-3 max-w-xs text-slate-600 truncate">{o.address}</td>
                            <td className="p-3">
                              <select
                                value={o.status}
                                onChange={(e) => onUpdateOrderStatus(o.orderId, e.target.value as any)}
                                className="px-2 py-1 border border-slate-300 rounded-lg bg-white font-medium text-[11px]"
                              >
                                <option value="Scheduled for Pickup">Scheduled for Pickup</option>
                                <option value="Confirmed">Confirmed</option>
                                <option value="Out for Delivery">Out for Delivery</option>
                                <option value="Completed">Completed</option>
                                <option value="Cancelled">Cancelled</option>
                              </select>
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => onDeleteOrder(o.orderId)}
                                className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition"
                                title="Delete order"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* TABLE 3: REGISTERED USERS */}
            {activeTable === 'registered' && (
              <div className="p-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Photo</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">Email</th>
                      <th className="p-3">Phone</th>
                      <th className="p-3">Role</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, idx) => (
                      <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 align-top">
                        <td className="p-3 font-mono">{idx + 1}</td>
                        <td className="p-3">
                          {u.photo ? (
                            <img src={u.photo} alt={u.name} className="w-8 h-8 rounded-full object-cover border" />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
                              {u.name.charAt(0)}
                            </div>
                          )}
                        </td>
                        <td className="p-3 font-bold text-slate-900">{u.name}</td>
                        <td className="p-3 text-slate-600">{u.email}</td>
                        <td className="p-3 text-slate-600">{u.phone}</td>
                        <td className="p-3 text-slate-700 font-medium">{u.role}</td>
                        <td className="p-3">
                          <select
                            value={u.status}
                            onChange={(e) => onUpdateUserStatus(u.id, e.target.value as any)}
                            className="px-2 py-1 border border-slate-300 rounded-lg bg-white font-medium text-[11px]"
                          >
                            <option value="Active">Active</option>
                            <option value="Pending">Pending</option>
                            <option value="Blocked">Blocked</option>
                          </select>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => onDeleteUser(u.id)}
                            className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TABLE 4: LOGIN RECORDS */}
            {activeTable === 'login' && (
              <div className="p-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">Email Address</th>
                      <th className="p-3">User Name</th>
                      <th className="p-3">Login Status</th>
                      <th className="p-3">Timestamp</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logins.map((l, idx) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3 font-mono">{idx + 1}</td>
                        <td className="p-3 font-medium text-slate-900">{l.email}</td>
                        <td className="p-3 text-slate-700">{l.name}</td>
                        <td className="p-3">
                          <select
                            value={l.status}
                            onChange={(e) => onUpdateLoginStatus(idx, e.target.value as any)}
                            className="px-2 py-1 border border-slate-300 rounded-lg bg-white font-medium text-[11px]"
                          >
                            <option value="Login Successful">Login Successful</option>
                            <option value="Login Failed">Login Failed</option>
                            <option value="Registered & Logged In">Registered & Logged In</option>
                            <option value="Logout">Logout</option>
                          </select>
                        </td>
                        <td className="p-3 text-slate-500">{l.date}</td>
                        <td className="p-3">
                          <button
                            onClick={() => onDeleteLogin(idx)}
                            className="text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition"
                            title="Delete login log"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TABLE 5: MARKETPLACE STOCK LISTINGS */}
            {activeTable === 'listing' && (
              <div className="p-5 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 uppercase text-[10px] font-bold">
                    <tr>
                      <th className="p-3">Listing ID</th>
                      <th className="p-3">Material Title</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Seller</th>
                      <th className="p-3">Price / kg</th>
                      <th className="p-3">Available Stock</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {listings.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-600">{item.id}</td>
                        <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{item.title}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-emerald-50 text-emerald-800">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-3 text-slate-700">{item.seller}</td>
                        <td className="p-3 font-black text-emerald-600">₹{item.price}</td>
                        <td className="p-3">{item.availableKg} kg</td>
                        <td className="p-3">
                          <button
                            onClick={() => onDeleteListing(item.id)}
                            className="text-rose-600 hover:bg-rose-50 px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
      </div>

      {/* ADMIN ADD OPERATION DATA MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <div>
                <h3 className="font-bold text-base">➕ Add Administrative Data Record</h3>
                <p className="text-[10px] text-slate-400">Insert custom records directly into the database</p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveOperationData} className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Operation Type
                </label>
                <select
                  value={operationType}
                  onChange={(e) => handleOpenAddModal(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 font-bold text-slate-800"
                >
                  <option value="sale">💰 Sale Scrap Record</option>
                  <option value="buy">🛒 Buy / Order Record</option>
                  <option value="registered">👥 Registered User Record</option>
                  <option value="login">🔐 Login Record</option>
                </select>
              </div>

              {/* Dynamic inputs based on operationType */}
              {operationType === 'sale' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Seller Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Seller Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Material Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.material}
                      onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Quantity (kg)
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.quantityKg}
                        onChange={(e) => setFormData({ ...formData, quantityKg: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-xl font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Rate / kg (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.ratePerKg}
                        onChange={(e) => setFormData({ ...formData, ratePerKg: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Pickup Address
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </>
              )}

              {operationType === 'buy' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Order ID
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.orderId}
                        onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Amount (₹)
                      </label>
                      <input
                        type="number"
                        required
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                        className="w-full px-3 py-2 border rounded-xl font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Items Description
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.itemsText}
                      onChange={(e) => setFormData({ ...formData, itemsText: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </>
              )}

              {operationType === 'registered' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border rounded-xl"
                    />
                  </div>
                </>
              )}

              {operationType === 'login' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                        User Name
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-xl"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Status Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Status
                </label>
                <input
                  type="text"
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl font-bold"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Attach Photo (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300">
                    <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                    <span>Choose Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                  {formData.photo && (
                    <img src={formData.photo} alt="Preview" className="w-8 h-8 rounded-lg object-cover border" />
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1 py-3 border border-slate-300 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition shadow-md"
                >
                  Insert Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
