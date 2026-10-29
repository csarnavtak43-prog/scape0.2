export type ScrapCategory = 'all' | 'metal' | 'ferrous' | 'ewaste' | 'paper' | 'plastic';

export interface ScrapListing {
  id: string;
  title: string;
  category: ScrapCategory;
  price: number; // per kg in ₹
  availableKg: number;
  minOrderKg: number;
  location: string;
  seller: string;
  sellerEmail?: string;
  sellerPhone?: string;
  rating: number;
  reviewsCount?: number;
  image: string;
  grade?: string;
  verifiedBadge?: boolean;
  description?: string;
  industrialCompliant?: boolean;
}

export interface CartItem {
  id: string;
  listingId: string;
  title: string;
  category: ScrapCategory;
  price: number;
  qtyKg: number;
  image: string;
  seller: string;
  availableKg: number;
}

export interface OrderItem {
  orderId: string;
  date: string;
  pickupDate: string;
  slot: string;
  address: string;
  items: CartItem[];
  total: number;
  paymentMethod: string;
  photo?: string;
  buyerName: string;
  buyerEmail: string;
  contactPhone?: string;
  status: 'Scheduled for Pickup' | 'Confirmed' | 'Out for Delivery' | 'Completed' | 'Cancelled';
  greenImpact?: {
    co2SavedKg: number;
    treesEquivalent: number;
    waterSavedLiters: number;
  };
}

export interface SaleListing {
  saleId: string;
  date: string;
  sellerId: string;
  seller: string;
  sellerEmail: string;
  sellerPhone?: string;
  material: string;
  category: string;
  quantityKg: number;
  ratePerKg: number;
  estimatedPayout: number;
  address: string;
  details: string;
  photo?: string;
  status: 'Pickup Requested' | 'Confirmed' | 'Collected' | 'Paid' | 'Cancelled';
  listingId?: string;
  wasteManifestRequested?: boolean;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  photo?: string;
  role: 'Individual Seller' | 'Industrial Business' | 'Recycler Dealer' | 'Admin';
  companyName?: string;
  status: 'Active' | 'Pending' | 'Blocked';
  registeredAt: string;
}

export interface LoginRecord {
  id?: string;
  email: string;
  name: string;
  status: 'Login Successful' | 'Login Failed' | 'Registered & Logged In' | 'Logout';
  date: string;
}

export interface DailyRate {
  id: string;
  name: string;
  icon: string;
  rate: number;
  unit: string;
  changePercent: number;
  trend: 'up' | 'down' | 'neutral';
  category: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}
