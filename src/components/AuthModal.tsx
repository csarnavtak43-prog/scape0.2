import React, { useState } from 'react';
import { UserAccount } from '../types/scrap';
import { compressImageFile } from '../utils/storage';
import { X, Lock, UserPlus, UploadCloud, Shield, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialTab?: 'login' | 'register';
  onClose: () => void;
  onLogin: (user: UserAccount) => void;
  onRegister: (user: UserAccount) => void;
  registeredUsers: UserAccount[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialTab = 'login',
  onClose,
  onLogin,
  onRegister,
  registeredUsers,
}) => {
  if (!isOpen) return null;

  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserAccount['role']>('Industrial Business');
  const [companyName, setCompanyName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [photoData, setPhotoData] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 400, 0.7);
      setPhotoData(compressed);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing profile photo');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const trimmedEmail = email.trim().toLowerCase();
    const found = registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);

    if (!found) {
      setErrorMessage('Account not found with this email. Please register or use demo accounts below.');
      return;
    }

    if (found.status === 'Blocked') {
      setErrorMessage('This user account has been suspended by the platform administrator.');
      return;
    }

    onLogin(found);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    const trimmedEmail = email.trim().toLowerCase();
    if (registeredUsers.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      setErrorMessage('An account with this email already exists. Please login instead.');
      return;
    }

    const newUser: UserAccount = {
      id: `USR-${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      phone: phone.trim(),
      role,
      companyName: companyName.trim() || undefined,
      password,
      photo: photoData,
      status: 'Active',
      registeredAt: new Date().toLocaleString(),
    };

    onRegister(newUser);
    onClose();
  };

  const handleQuickDemoLogin = (demoEmail: string) => {
    const found = registeredUsers.find((u) => u.email.toLowerCase() === demoEmail.toLowerCase());
    if (found) {
      onLogin(found);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Header / Tabs */}
        <div className="flex border-b border-slate-200 bg-slate-50">
          <button
            onClick={() => {
              setTab('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition ${
              tab === 'login'
                ? 'text-emerald-700 border-b-2 border-emerald-600 bg-white'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5" /> Sign In
          </button>
          <button
            onClick={() => {
              setTab('register');
              setErrorMessage('');
            }}
            className={`flex-1 py-3.5 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition ${
              tab === 'register'
                ? 'text-emerald-700 border-b-2 border-emerald-600 bg-white'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" /> Register Trader
          </button>
          <button
            onClick={onClose}
            className="px-4 text-slate-400 hover:text-slate-600 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {errorMessage && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {errorMessage}
            </div>
          )}

          {/* Quick Demo Login Presets */}
          <div className="mb-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1.5 text-xs">
            <span className="font-bold text-emerald-950 block">⚡ Quick 1-Click Demo Accounts:</span>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('rajesh@example.com')}
                className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-300 text-[11px] transition shadow-2xs"
              >
                Rajesh (Industrial Trader)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('priya@example.com')}
                className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 font-bold rounded-lg border border-emerald-300 text-[11px] transition shadow-2xs"
              >
                Priya (Recycler Dealer)
              </button>
            </div>
          </div>

          {/* LOGIN FORM */}
          {tab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. rajesh@example.com"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition"
              >
                Login to ScrapEx
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs sm:text-sm max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Anand Mahindra"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@business.com"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Account Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium"
                  >
                    <option value="Industrial Business">Industrial Business</option>
                    <option value="Recycler Dealer">Recycler Dealer</option>
                    <option value="Individual Seller">Individual Seller</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Company / Firm Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Apex Recycling Ltd"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Profile Photo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Profile Photo (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <label className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg border border-slate-300">
                    <UploadCloud className="w-3.5 h-3.5 text-slate-500" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                  {photoData && (
                    <img src={photoData} alt="Avatar" className="w-8 h-8 rounded-full object-cover border" />
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition mt-2"
              >
                Create Verified Account
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
