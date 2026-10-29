import React, { useState } from 'react';
import { X, Leaf, Trees, Droplets, Trash2, Sparkles, Scale } from 'lucide-react';
import { calculateGreenImpact } from '../utils/storage';

interface EcoImpactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EcoImpactModal: React.FC<EcoImpactModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [selectedCat, setSelectedCat] = useState('metal');
  const [weightKg, setWeightKg] = useState(250);

  const metrics = calculateGreenImpact(selectedCat, weightKg);
  const landfillDivertedCubicMeters = (weightKg * 0.0018).toFixed(2);
  const rawOreMiningAvoidedKg = Math.round(weightKg * 2.8);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-emerald-200">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950 to-teal-950 text-white flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Leaf className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Sustainability & ESG Impact Calculator</h3>
              <p className="text-[10px] text-emerald-300">Measure landfill diversion and carbon savings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition"
            aria-label="Close calculator"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Scrap Material Type
              </label>
              <select
                value={selectedCat}
                onChange={(e) => setSelectedCat(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-medium text-slate-800"
              >
                <option value="metal">Copper & Aluminium (Non-Ferrous)</option>
                <option value="ferrous">Iron & Steel (Ferrous)</option>
                <option value="ewaste">Electronic & PCB Waste</option>
                <option value="paper">Corrugated Paper & Cardboard</option>
                <option value="plastic">Industrial HDPE / Polymers</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Recycled Volume (kg)
              </label>
              <input
                type="number"
                min="10"
                max="50000"
                step="10"
                value={weightKg}
                onChange={(e) => setWeightKg(Math.max(1, Number(e.target.value) || 1))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden font-bold text-slate-800"
              />
            </div>
          </div>

          {/* Quick Slider */}
          <div>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>Slider Adjustment</span>
              <span className="font-bold text-emerald-700">{weightKg.toLocaleString()} kg</span>
            </div>
            <input
              type="range"
              min="20"
              max="5000"
              step="20"
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
          </div>

          {/* Live Calculated ESG Metrics Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-2 text-emerald-800 mb-1">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider">CO₂ Avoided</span>
              </div>
              <p className="text-2xl font-black text-emerald-700">{metrics.co2SavedKg.toLocaleString()} kg</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Greenhouse gas emission offset</p>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200">
              <div className="flex items-center gap-2 text-teal-800 mb-1">
                <Trees className="w-4 h-4 text-teal-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Trees Equiv.</span>
              </div>
              <p className="text-2xl font-black text-teal-700">{metrics.treesEquivalent} trees</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Annual CO₂ absorption equivalent</p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200">
              <div className="flex items-center gap-2 text-sky-800 mb-1">
                <Droplets className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Water Saved</span>
              </div>
              <p className="text-2xl font-black text-sky-700">{metrics.waterSavedLiters.toLocaleString()} L</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Industrial smelting water conserved</p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
              <div className="flex items-center gap-2 text-amber-800 mb-1">
                <Trash2 className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Landfill Diverted</span>
              </div>
              <p className="text-2xl font-black text-amber-700">{landfillDivertedCubicMeters} m³</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Municipal landfill space saved</p>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Scale className="w-3.5 h-3.5 text-emerald-600" /> Raw Ore Mining Conservation:
            </p>
            <p>
              By recycling {weightKg} kg of secondary materials, you eliminate the need to mine approximately{' '}
              <strong className="text-emerald-700">{rawOreMiningAvoidedKg} kg</strong> of virgin earth mineral deposits.
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition"
          >
            Close Calculator
          </button>
        </div>

      </div>
    </div>
  );
};
