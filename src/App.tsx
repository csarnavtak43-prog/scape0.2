/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  ScrapListing, 
  CartItem, 
  OrderItem, 
  SaleListing, 
  UserAccount, 
  LoginRecord, 
  DailyRate, 
  ToastMessage 
} from './types/scrap';
import { 
  INITIAL_DAILY_RATES, 
  INITIAL_SCRAP_ITEMS, 
  INITIAL_REGISTERED_USERS, 
  INITIAL_LOGIN_HISTORY, 
  INITIAL_ORDERS, 
  INITIAL_SALES 
} from './data/scrapData';
import { 
  STORAGE_KEYS, 
  getLocal, 
  setLocal, 
  initializeDataIfEmpty, 
  calculateGreenImpact 
} from './utils/storage';

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { Marketplace } from './components/Marketplace';
import { SellScrapSection } from './components/SellScrapSection';
import { ActivityDashboard } from './components/ActivityDashboard';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { MaterialModal } from './components/MaterialModal';
import { EcoImpactModal } from './components/EcoImpactModal';
import { AuthModal } from './components/AuthModal';
import { AdminHub } from './components/AdminHub';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';

export default function App() {
  // Initialize storage seeds on first load
  useEffect(() => {
    initializeDataIfEmpty();
  }, []);

  // Primary State
  const [dailyRates] = useState<DailyRate[]>(INITIAL_DAILY_RATES);
  const [listings, setListings] = useState<ScrapListing[]>(() =>
    getLocal<ScrapListing[]>(STORAGE_KEYS.SCRAP_LISTINGS, INITIAL_SCRAP_ITEMS)
  );
  const [cart, setCart] = useState<CartItem[]>(() =>
    getLocal<CartItem[]>(STORAGE_KEYS.CART, [])
  );
  const [orders, setOrders] = useState<OrderItem[]>(() =>
    getLocal<OrderItem[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS)
  );
  const [sales, setSales] = useState<SaleListing[]>(() =>
    getLocal<SaleListing[]>(STORAGE_KEYS.SALES, INITIAL_SALES)
  );
  const [users, setUsers] = useState<UserAccount[]>(() =>
    getLocal<UserAccount[]>(STORAGE_KEYS.USERS, INITIAL_REGISTERED_USERS)
  );
  const [logins, setLogins] = useState<LoginRecord[]>(() =>
    getLocal<LoginRecord[]>(STORAGE_KEYS.LOGINS, INITIAL_LOGIN_HISTORY)
  );
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() =>
    getLocal<UserAccount | null>(STORAGE_KEYS.CURRENT_USER, null)
  );
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() =>
    getLocal<boolean>(STORAGE_KEYS.ADMIN_LOGGED_IN, false)
  );

  // Modals & Drawers state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [authModalState, setAuthModalState] = useState<{ isOpen: boolean; tab: 'login' | 'register' }>({
    isOpen: false,
    tab: 'login',
  });
  const [isAdminHubOpen, setIsAdminHubOpen] = useState(false);
  const [isEcoCalculatorOpen, setIsEcoCalculatorOpen] = useState(false);
  const [inspectedListing, setInspectedListing] = useState<ScrapListing | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Synchronize state with LocalStorage
  useEffect(() => {
    setLocal(STORAGE_KEYS.SCRAP_LISTINGS, listings);
  }, [listings]);

  useEffect(() => {
    setLocal(STORAGE_KEYS.CART, cart);
  }, [cart]);

  useEffect(() => {
    setLocal(STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  useEffect(() => {
    setLocal(STORAGE_KEYS.SALES, sales);
  }, [sales]);

  useEffect(() => {
    setLocal(STORAGE_KEYS.USERS, users);
  }, [users]);

  useEffect(() => {
    setLocal(STORAGE_KEYS.LOGINS, logins);
  }, [logins]);

  useEffect(() => {
    setLocal(STORAGE_KEYS.CURRENT_USER, currentUser);
  }, [currentUser]);

  useEffect(() => {
    setLocal(STORAGE_KEYS.ADMIN_LOGGED_IN, isAdminLoggedIn);
  }, [isAdminLoggedIn]);

  // Smooth scroll helper
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  /* ================= CART OPERATIONS ================= */
  const handleAddToCart = (item: ScrapListing, qtyKg = item.minOrderKg || 20) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.listingId === item.id);
      if (existing) {
        return prev.map((c) =>
          c.listingId === item.id ? { ...c, qtyKg: c.qtyKg + qtyKg } : c
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random()}`,
          listingId: item.id,
          title: item.title,
          category: item.category,
          price: item.price,
          qtyKg,
          image: item.image,
          seller: item.seller,
          availableKg: item.availableKg,
        },
      ];
    });
    showToast(`Added ${qtyKg} kg of "${item.title}" to cart!`);
  };

  const handleUpdateCartQty = (itemId: string, deltaKg: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.qtyKg + deltaKg;
            return newQty > 0 ? { ...item, qtyKg: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((i) => i.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const handleProceedCheckout = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty!', 'error');
      return;
    }
    if (!currentUser) {
      showToast('Please login or register to schedule pickup & checkout.', 'info');
      setAuthModalState({ isOpen: true, tab: 'login' });
      return;
    }
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  /* ================= CHECKOUT / ORDER CREATION ================= */
  const handleConfirmOrder = (orderData: {
    address: string;
    pickupDate: string;
    slot: string;
    contactPhone: string;
    paymentMethod: string;
    photo: string;
  }) => {
    const totalWeight = cart.reduce((sum, item) => sum + item.qtyKg, 0);
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qtyKg, 0);
    const logisticsFee = totalWeight >= 100 || cart.length === 0 ? 0 : 250;
    const total = subtotal + logisticsFee;
    const impact = calculateGreenImpact(cart[0]?.category || 'metal', totalWeight);

    const newOrder: OrderItem = {
      orderId: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString(),
      pickupDate: orderData.pickupDate,
      slot: orderData.slot,
      address: orderData.address,
      items: [...cart],
      total,
      paymentMethod: orderData.paymentMethod,
      photo: orderData.photo,
      buyerName: currentUser?.name || 'Verified Recycler',
      buyerEmail: currentUser?.email || 'buyer@example.com',
      contactPhone: orderData.contactPhone,
      status: 'Scheduled for Pickup',
      greenImpact: impact,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setIsCheckoutOpen(false);
    showToast(`Order scheduled! Pickup ID: ${newOrder.orderId}`);

    setTimeout(() => {
      scrollTo('myOrders');
    }, 400);
  };

  /* ================= SELL SCRAP SUBMISSION ================= */
  const handleSubmitSale = (saleData: {
    material: string;
    category: string;
    quantityKg: number;
    ratePerKg: number;
    address: string;
    details: string;
    photo: string;
    wasteManifestRequested: boolean;
  }) => {
    const newListingId = `s-${Date.now()}`;

    // 1. Add to Marketplace listings so buyers can browse it
    const newMarketplaceListing: ScrapListing = {
      id: newListingId,
      title: saleData.material,
      category: saleData.category as any,
      price: saleData.ratePerKg,
      availableKg: saleData.quantityKg,
      minOrderKg: Math.min(20, saleData.quantityKg),
      location: saleData.address,
      seller: currentUser ? currentUser.name : 'Verified Seller',
      sellerEmail: currentUser?.email,
      sellerPhone: currentUser?.phone,
      rating: 5.0,
      reviewsCount: 1,
      image:
        saleData.photo ||
        'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
      grade: 'Customer Verified',
      verifiedBadge: true,
      description: saleData.details || 'Sorted scrap material ready for doorstep digital scale collection.',
      industrialCompliant: saleData.wasteManifestRequested,
    };

    setListings((prev) => [newMarketplaceListing, ...prev]);

    // 2. Add to User's Sale Activity
    const newSaleRecord: SaleListing = {
      saleId: `SALE-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleString(),
      sellerId: currentUser?.id || 'GUEST',
      seller: currentUser ? currentUser.name : 'Verified Seller',
      sellerEmail: currentUser?.email || 'seller@example.com',
      sellerPhone: currentUser?.phone,
      material: saleData.material,
      category: saleData.category,
      quantityKg: saleData.quantityKg,
      ratePerKg: saleData.ratePerKg,
      estimatedPayout: saleData.quantityKg * saleData.ratePerKg,
      address: saleData.address,
      details: saleData.details,
      photo: saleData.photo,
      status: 'Pickup Requested',
      listingId: newListingId,
      wasteManifestRequested: saleData.wasteManifestRequested,
    };

    setSales((prev) => [newSaleRecord, ...prev]);
    showToast('Scrap listing published & pickup requested successfully!');

    setTimeout(() => {
      scrollTo('myOrders');
    }, 400);
  };

  /* ================= USER AUTHENTICATION ================= */
  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);

    // Record login log
    const newLog: LoginRecord = {
      id: `LOG-${Date.now()}`,
      email: user.email,
      name: user.name,
      status: 'Login Successful',
      date: new Date().toLocaleString(),
    };
    setLogins((prev) => [newLog, ...prev.slice(0, 99)]);
    showToast(`Welcome back, ${user.name}!`);
  };

  const handleRegister = (user: UserAccount) => {
    setUsers((prev) => [user, ...prev]);
    setCurrentUser(user);

    const newLog: LoginRecord = {
      id: `LOG-${Date.now()}`,
      email: user.email,
      name: user.name,
      status: 'Registered & Logged In',
      date: new Date().toLocaleString(),
    };
    setLogins((prev) => [newLog, ...prev.slice(0, 99)]);
    showToast(`Welcome ${user.name}! Account created.`);
  };

  const handleLogout = () => {
    if (currentUser) {
      const newLog: LoginRecord = {
        id: `LOG-${Date.now()}`,
        email: currentUser.email,
        name: currentUser.name,
        status: 'Logout',
        date: new Date().toLocaleString(),
      };
      setLogins((prev) => [newLog, ...prev.slice(0, 99)]);
    }
    setCurrentUser(null);
    showToast('Logged out successfully', 'info');
  };

  /* ================= ADMIN ACTIONS ================= */
  const handleAdminLogin = () => {
    setIsAdminLoggedIn(true);
    showToast('Admin session started.');
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setIsAdminHubOpen(false);
    showToast('Admin logged out.', 'info');
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderItem['status']) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status: newStatus } : o))
    );
    showToast(`Order ${orderId} updated to ${newStatus}`);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Delete order ${orderId}?`)) {
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
      showToast(`Order ${orderId} deleted`, 'info');
    }
  };

  const handleUpdateSaleStatus = (saleId: string, newStatus: SaleListing['status']) => {
    setSales((prev) =>
      prev.map((s) => (s.saleId === saleId ? { ...s, status: newStatus } : s))
    );
    showToast(`Sale ${saleId} status updated to ${newStatus}`);
  };

  const handleDeleteSale = (saleId: string) => {
    if (window.confirm(`Delete sale record ${saleId}?`)) {
      const target = sales.find((s) => s.saleId === saleId);
      setSales((prev) => prev.filter((s) => s.saleId !== saleId));
      if (target?.listingId) {
        setListings((prev) => prev.filter((l) => l.id !== target.listingId));
      }
      showToast(`Sale ${saleId} deleted`, 'info');
    }
  };

  const handleUpdateUserStatus = (userId: string, newStatus: UserAccount['status']) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
    );
    showToast('User status updated');
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Delete this registered user?')) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      showToast('User account deleted', 'info');
    }
  };

  const handleUpdateLoginStatus = (index: number, newStatus: LoginRecord['status']) => {
    setLogins((prev) => {
      const copy = [...prev];
      if (copy[index]) copy[index].status = newStatus;
      return copy;
    });
    showToast('Login status updated');
  };

  const handleDeleteLogin = (index: number) => {
    setLogins((prev) => prev.filter((_, i) => i !== index));
    showToast('Login record deleted', 'info');
  };

  const handleDeleteListing = (listingId: string) => {
    if (window.confirm('Remove this marketplace scrap listing?')) {
      setListings((prev) => prev.filter((l) => l.id !== listingId));
      showToast('Listing removed', 'info');
    }
  };

  const handleAddOperationRecord = (type: 'login' | 'registered' | 'buy' | 'sale', record: any) => {
    const now = new Date().toLocaleString();

    if (type === 'sale') {
      const newSale: SaleListing = {
        saleId: `SALE-${Math.floor(100000 + Math.random() * 900000)}`,
        date: now,
        sellerId: 'ADMIN-ADDED',
        seller: record.name || 'Admin Added Seller',
        sellerEmail: record.email || 'admin-seller@example.com',
        material: record.material || 'Heavy Copper Wire',
        category: 'metal',
        quantityKg: Number(record.quantityKg) || 100,
        ratePerKg: Number(record.ratePerKg) || 450,
        estimatedPayout: (Number(record.quantityKg) || 100) * (Number(record.ratePerKg) || 450),
        address: record.address || 'Mumbai, MH',
        details: 'Admin inserted sale scrap record',
        photo: record.photo,
        status: record.status || 'Pickup Requested',
      };
      setSales((prev) => [newSale, ...prev]);
      showToast('Sale scrap record inserted.');
    } else if (type === 'buy') {
      const newOrder: OrderItem = {
        orderId: record.orderId || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString(),
        pickupDate: new Date().toLocaleDateString(),
        slot: '10:00 AM - 01:00 PM',
        address: record.address || 'MIDC Industrial Area, Mumbai',
        items: [
          {
            id: `item-${Date.now()}`,
            listingId: 'admin-item',
            title: record.itemsText || 'Sorted Copper Scrap',
            category: 'metal',
            price: 450,
            qtyKg: 50,
            image: record.photo || 'https://images.unsplash.com/photo-1605152276897-4f618f831968?auto=format&fit=crop&w=800&q=80',
            seller: 'Admin Source',
            availableKg: 500,
          },
        ],
        total: Number(record.amount) || 22500,
        paymentMethod: 'Instant UPI / QR',
        photo: record.photo,
        buyerName: 'Admin Added Buyer',
        buyerEmail: 'buyer@example.com',
        status: record.status || 'Scheduled for Pickup',
      };
      setOrders((prev) => [newOrder, ...prev]);
      showToast('Buy / order record inserted.');
    } else if (type === 'registered') {
      const newUser: UserAccount = {
        id: `USR-${Date.now()}`,
        name: record.name || 'Rohan Deshmukh',
        email: record.email || 'rohan@example.com',
        phone: record.phone || '+91 98200 11223',
        role: 'Industrial Business',
        status: record.status || 'Active',
        registeredAt: now,
      };
      setUsers((prev) => [newUser, ...prev]);
      showToast('User registration record added.');
    } else if (type === 'login') {
      const newLogin: LoginRecord = {
        id: `LOG-${Date.now()}`,
        email: record.email || 'user@example.com',
        name: record.name || 'User',
        status: record.status || 'Login Successful',
        date: now,
      };
      setLogins((prev) => [newLogin, ...prev]);
      showToast('Login record logged.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Navbar */}
      <Navbar
        dailyRates={dailyRates}
        cartCount={cart.length}
        currentUser={currentUser}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAuth={(tab) => setAuthModalState({ isOpen: true, tab })}
        onLogout={handleLogout}
        onOpenAdmin={() => setIsAdminHubOpen(true)}
        onOpenEcoCalculator={() => setIsEcoCalculatorOpen(true)}
        activeSection="home"
      />

      {/* Hero Section */}
      <HeroSection
        onScrollToSell={() => scrollTo('sell')}
        onScrollToBuy={() => scrollTo('buy')}
      />

      {/* Main App Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
        {/* Marketplace: Buy Scrap */}
        <Marketplace
          listings={listings}
          onAddToCart={(item, qty) => handleAddToCart(item, qty)}
          onInspectListing={(item) => setInspectedListing(item)}
        />

        {/* Sell Scrap & Schedule Pickup */}
        <SellScrapSection
          currentUser={currentUser}
          onOpenAuth={() => setAuthModalState({ isOpen: true, tab: 'login' })}
          onSubmitSale={handleSubmitSale}
        />

        {/* User Activity Dashboard */}
        <ActivityDashboard
          orders={orders}
          sales={sales}
          onRefresh={() => {
            setOrders(getLocal(STORAGE_KEYS.ORDERS, INITIAL_ORDERS));
            setSales(getLocal(STORAGE_KEYS.SALES, INITIAL_SALES));
            showToast('Activity dashboard updated');
          }}
          onScrollToBuy={() => scrollTo('buy')}
          onScrollToSell={() => scrollTo('sell')}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenEcoCalculator={() => setIsEcoCalculatorOpen(true)}
        onScrollToBuy={() => scrollTo('buy')}
        onScrollToSell={() => scrollTo('sell')}
      />

      {/* ================= MODALS & DRAWERS ================= */}
      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveFromCart}
        onProceedCheckout={handleProceedCheckout}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cart={cart}
        currentUser={currentUser}
        onConfirmOrder={handleConfirmOrder}
      />

      {/* Material Detailed Specifications Modal */}
      <MaterialModal
        listing={inspectedListing}
        onClose={() => setInspectedListing(null)}
        onAddToCart={(item, qty) => handleAddToCart(item, qty)}
      />

      {/* Eco Sustainability Impact Calculator Modal */}
      <EcoImpactModal
        isOpen={isEcoCalculatorOpen}
        onClose={() => setIsEcoCalculatorOpen(false)}
      />

      {/* User Login & Register Modal */}
      <AuthModal
        isOpen={authModalState.isOpen}
        initialTab={authModalState.tab}
        onClose={() => setAuthModalState({ isOpen: false, tab: 'login' })}
        onLogin={handleLogin}
        onRegister={handleRegister}
        registeredUsers={users}
      />

      {/* Comprehensive Admin Management Hub */}
      <AdminHub
        isOpen={isAdminHubOpen}
        onClose={() => setIsAdminHubOpen(false)}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogin={handleAdminLogin}
        onAdminLogout={handleAdminLogout}
        listings={listings}
        orders={orders}
        sales={sales}
        users={users}
        logins={logins}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onDeleteOrder={handleDeleteOrder}
        onUpdateSaleStatus={handleUpdateSaleStatus}
        onDeleteSale={handleDeleteSale}
        onUpdateUserStatus={handleUpdateUserStatus}
        onDeleteUser={handleDeleteUser}
        onUpdateLoginStatus={handleUpdateLoginStatus}
        onDeleteLogin={handleDeleteLogin}
        onDeleteListing={handleDeleteListing}
        onAddOperationRecord={handleAddOperationRecord}
      />

      {/* Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
