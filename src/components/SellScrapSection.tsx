import React, { useState } from 'react';
import { UserAccount } from '../types/scrap';
import { compressImageFile, calculateGreenImpact } from '../utils/storage';
import { 
  Truck, 
  CheckCircle2, 
  Headphones, 
  Sparkles, 
  UploadCloud, 
  Leaf, 
  Scale, 
  Clock, 
  FileText 
} from 'lucide-react';

interface SellScrapSectionProps {
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onSubmitSale: (saleData: {
    material: string;
    category: string;
    quantityKg: number;
    ratePerKg: number;
    address: string;
    details: string;
    photo: string;
    wasteManifestRequested: boolean;
  }) => void;
}

const COMMON_MATERIALS = [
  { name: 'Heavy Copper Wire (Millberry)', rate: 450, cat: 'metal' },
  { name: 'Aluminium Section Extrusion 6063', rate: 135, cat: 'metal' },
  { name: 'Industrial Heavy Melting Steel (HMS)', rate: 54, cat: 'ferrous' },
  { name: 'Brass Utensil & Valve Scrap', rate: 320, cat: 'metal' },
  { name: 'Old Motherboards & PCB E-Waste', rate: 230, cat: 'ewaste' },
  { name: 'Baled Corrugated OCC Cardboard', rate: 14, cat: 'paper' },
  { name: 'Industrial HDPE Drum Scrap', rate: 42, cat: 'plastic' },
  { name: 'Lead Inverter & Auto Battery', rate: 98, cat: 'metal' },
];

export const SellScrapSection: React.FC<SellScrapSectionProps> = ({
  currentUser,
  onOpenAuth,
  onSubmitSale,
}) => {
  const [material, setMaterial] = useState('');
  const [weight, setWeight] = useState<number | ''>(50);
  const [price, setPrice] = useState<number | ''>(450);
  const [address, setAddress] = useState('');
  const [details, setDetails] = useState('');
  const [photoData, setPhotoData] = useState<string>('');
  const [manifestRequested, setManifestRequested] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numWeight = Number(weight) || 0;
  const numPrice = Number(price) || 0;
  const estimatedPayout = numWeight * numPrice;

  // Infer category
  const inferCategory = (m: string) => {
    const l = m.toLowerCase();
    if (l.includes('iron') || l.includes('steel') || l.includes('hms')) return 'ferrous';
    if (l.includes('paper') || l.includes('cardboard') || l.includes('kraft')) return 'paper';
    if (l.includes('e-waste') || l.includes('circuit') || l.includes('pcb') || l.includes('computer')) return 'ewaste';
    if (l.includes('plastic') || l.includes('hdpe') || l.includes('drum') || l.includes('polymer')) return 'plastic';
    return 'metal';
  };

  const greenPreview = calculateGreenImpact(inferCategory(material), numWeight);

  const handleSelectPreset = (item: (typeof COMMON_MATERIALS)[0]) => {
    setMaterial(item.name);
    setPrice(item.rate);
  };

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
    if (!currentUser) {
      onOpenAuth();
      return;
    }
    if (numWeight <= 0 || numPrice <= 0) {
      alert('Please enter valid quantity and price values.');
      return;
    }

    setIsSubmitting(true);
    onSubmitSale({
      material,
      category: inferCategory(material),
      quantityKg: numWeight,
      ratePerKg: numPrice,
      address,
      details,
      photo: photoData,
      wasteManifestRequested: manifestRequested,
    });

    // Reset fields
    setMaterial('');
    setWeight(50);
    setPrice(450);
    setAddress('');
    setDetails('');
    setPhotoData('');
    setIsSubmitting(false);
  };

  return (
    <section id="sell" className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
      <div className="grid lg:grid-cols-12 gap-0">
        
        {/* Left Information Banner */}
        <div className="lg:col-span-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-teal-950 p-8 lg:p-12 text-white flex flex-col justify-between">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 text-emerald-300 text-xs font-bold rounded-full uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Doorstep Collection & Instant Payout
            </span>

            <h3 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              Sell Your Scrap at Guaranteed Benchmark Rates
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Submit your scrap details. Our certified collection vehicle arrives equipped with calibrated digital scales. We weigh on-site and transfer instant payment directly to your bank account or UPI.
            </p>

            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-200 pt-2">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Standard Digital Scales:</strong> Calibrated scales with live tamper-proof LCD display.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Zero Transport Cost on Bulk:</strong> 100% free doorstep pickup on volumes over 50 kg.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Immediate Instant Payout:</strong> Instant UPI, NEFT, or Cash upon on-site scale confirmation.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>CPCB Green Circularity Manifest:</strong> Official certificate for your company's ESG & audit records.
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-8 border-t border-white/10 mt-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400 font-medium">Need immediate seller dispatch support?</p>
                <p className="text-sm font-bold text-white tracking-wide">+91 1800-SCRAP-EX (Toll Free)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7 p-6 sm:p-10">
          <div className="mb-6">
            <h4 className="text-xl font-black text-slate-900">Request Scrap Pickup & List for Sale</h4>
            <p className="text-xs text-slate-500 mt-1">
              Select or type your scrap material to get live pricing and instant pickup scheduling.
            </p>
          </div>

          {/* Quick presets */}
          <div className="mb-5">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Popular Materials (Click to Auto-Fill Benchmark Rate):
            </label>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_MATERIALS.map((cm) => (
                <button
                  type="button"
                  key={cm.name}
                  onClick={() => handleSelectPreset(cm)}
                  className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-800 text-slate-700 transition"
                >
                  {cm.name} (₹{cm.rate}/kg)
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Scrap Material Name & Specification *
              </label>
              <input
                type="text"
                required
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                placeholder="e.g. Clean Stripped Copper Wire, Factory Turning Scrap, Mixed Server PCBs"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden transition font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
                  <span>Estimated Quantity (kg) *</span>
                  <span className="text-[10px] text-slate-400 lowercase">min 1 kg</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.5"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden transition font-bold"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    kg
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1 flex items-center justify-between">
                  <span>Asking Rate (₹ / kg) *</span>
                  <span className="text-[10px] text-slate-400">Benchmark rate</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden transition font-bold"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    ₹ / kg
                  </span>
                </div>
              </div>
            </div>

            {/* Estimated Total Calculation & Green Impact Preview */}
            {numWeight > 0 && numPrice > 0 && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-emerald-900 font-bold flex items-center gap-1.5">
                      <Scale className="w-4 h-4 text-emerald-600" /> Estimated Instant Selling Payout:
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Subject to digital scale verification during doorstep collection
                    </p>
                  </div>
                  <p className="text-xl sm:text-2xl font-black text-emerald-700">
                    ₹{estimatedPayout.toLocaleString()}
                  </p>
                </div>

                <div className="pt-2 border-t border-emerald-200/60 flex items-center gap-2 text-[11px] text-emerald-800">
                  <Leaf className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Eco Impact:</strong> Recycling this {numWeight} kg saves ~
                    <strong>{greenPreview.co2SavedKg} kg CO₂</strong> and is equivalent to planting{' '}
                    <strong>{greenPreview.treesEquivalent} trees</strong>!
                  </span>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Pickup Address & City *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Factory / Warehouse / Residence, Industrial Estate, City, PIN"
                className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Material Details, Condition & Packaging
              </label>
              <textarea
                rows={2}
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="e.g. Baled in bags, sorted wire coils, magnet tested, dry warehouse storage..."
                className="w-full px-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-hidden transition"
              />
            </div>

            {/* Photo Upload with preview */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Scrap Photo (Optional)
              </label>
              <div className="flex items-center gap-3">
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition border border-slate-300">
                  <UploadCloud className="w-4 h-4 text-slate-500" />
                  <span>Choose Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
                <span className="text-[11px] text-slate-400">
                  Clear photo helps buyers verify material faster
                </span>
              </div>
              {photoData && (
                <div className="mt-2 relative inline-block">
                  <img
                    src={photoData}
                    alt="Preview"
                    className="w-20 h-20 object-cover rounded-xl border border-emerald-300 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setPhotoData('')}
                    className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>

            {/* Waste Manifest Checkbox */}
            <div className="flex items-center gap-2.5 pt-1">
              <input
                type="checkbox"
                id="manifestCheck"
                checked={manifestRequested}
                onChange={(e) => setManifestRequested(e.target.checked)}
                className="w-4 h-4 text-emerald-600 rounded-sm focus:ring-emerald-500 border-slate-300"
              />
              <label htmlFor="manifestCheck" className="text-xs text-slate-600 cursor-pointer">
                Generate official <strong>CPCB Form 6 Green Recycling Manifest</strong> for corporate tax / ESG compliance.
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition flex items-center justify-center gap-2 text-sm"
            >
              <Truck className="w-4 h-4" />
              Publish Scrap Listing & Schedule Pickup
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};
