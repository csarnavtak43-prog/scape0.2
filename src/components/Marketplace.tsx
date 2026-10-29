import React, { useState, useMemo } from 'react';
import { ScrapListing, ScrapCategory } from '../types/scrap';
import { Search, SlidersHorizontal, MapPin, Star, ShoppingCart, Info, CheckCircle2, PackageCheck } from 'lucide-react';

interface MarketplaceProps {
  listings: ScrapListing[];
  onAddToCart: (listing: ScrapListing, qtyKg?: number) => void;
  onInspectListing: (listing: ScrapListing) => void;
}

export const Marketplace: React.FC<MarketplaceProps> = ({
  listings,
  onAddToCart,
  onInspectListing,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ScrapCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'stock'>('featured');

  const categories = [
    { id: 'all', label: 'All Scrap' },
    { id: 'metal', label: 'Non-Ferrous Metals' },
    { id: 'ferrous', label: 'Iron & Steel' },
    { id: 'ewaste', label: 'Electronic Waste' },
    { id: 'paper', label: 'Paper & Cardboard' },
    { id: 'plastic', label: 'Polymers & Plastic' },
  ];

  const filteredListings = useMemo(() => {
    return listings
      .filter((item) => {
        const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          item.title.toLowerCase().includes(q) ||
          item.location.toLowerCase().includes(q) ||
          item.seller.toLowerCase().includes(q) ||
          (item.grade && item.grade.toLowerCase().includes(q));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price;
        if (sortBy === 'price-high') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'stock') return b.availableKg - a.availableKg;
        return 0; // featured default
      });
  }, [listings, selectedCategory, searchQuery, sortBy]);

  return (
    <section id="buy" className="space-y-6 pt-4">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
            <PackageCheck className="w-4 h-4 text-emerald-600" /> Circular B2B & Retail Marketplace
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
            Browse Scrap Stock & Sorted Raw Materials
          </h2>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-2xl">
            Purchase verified industrial offcuts, secondary metals, clean e-waste, and baled paper directly from certified recyclers.
          </p>
        </div>

        {/* Search & Sort Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search copper, iron, city, grade..."
              className="w-full pl-10 pr-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-slate-400 hidden sm:inline" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="py-2 px-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden transition shadow-2xs font-medium text-slate-700"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="stock">Largest Available Stock</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as ScrapCategory)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                isActive
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Scrap Grid */}
      {filteredListings.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          <p className="text-4xl mb-3">🔍</p>
          <h3 className="font-bold text-slate-800 text-base">No scrap material found matching your query</h3>
          <p className="text-xs text-slate-500 mt-1">
            Try adjusting your search keyword or switching category tabs.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Image & Location Badge */}
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span className="truncate max-w-[140px]">{item.location}</span>
                  </span>

                  {item.grade && (
                    <span className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-xs text-emerald-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-xs">
                      {item.grade}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {item.category.toUpperCase()}
                    </span>
                    <div className="flex items-center text-xs font-bold text-amber-500 gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating}</span>
                      <span className="text-slate-400 text-[11px]">({item.reviewsCount || 15})</span>
                    </div>
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-base leading-snug line-clamp-2">
                    {item.title}
                  </h3>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-emerald-600">₹{item.price}</span>
                    <span className="text-xs font-medium text-slate-500">/ kg</span>
                    <span className="text-[11px] text-slate-400 ml-1.5">
                      (₹{(item.price * 1000).toLocaleString()} / MT)
                    </span>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Available Stock:</span>
                      <strong className="text-slate-800">{item.availableKg.toLocaleString()} kg</strong>
                    </p>
                    <p className="flex items-center justify-between">
                      <span className="text-slate-400">Verified Seller:</span>
                      <span className="text-slate-800 font-semibold truncate max-w-[140px]">
                        {item.seller}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                <button
                  onClick={() => onInspectListing(item)}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                  title="View grading specifications and certificates"
                >
                  <Info className="w-3.5 h-3.5 text-slate-500" /> Specs
                </button>
                <button
                  onClick={() => onAddToCart(item)}
                  className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <ShoppingCart className="w-3.5 h-3.5" /> Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};
