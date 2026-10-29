import { ScrapListing, CartItem, OrderItem, SaleListing, UserAccount, LoginRecord } from '../types/scrap';
import { INITIAL_SCRAP_ITEMS, INITIAL_REGISTERED_USERS, INITIAL_LOGIN_HISTORY, INITIAL_ORDERS, INITIAL_SALES } from '../data/scrapData';

export const STORAGE_KEYS = {
  SCRAP_LISTINGS: 'scrapex_listings_v2',
  CART: 'scrapex_cart_v2',
  ORDERS: 'scrapex_orders_v2',
  SALES: 'scrapex_sales_v2',
  USERS: 'scrapex_users_v2',
  LOGINS: 'scrapex_logins_v2',
  CURRENT_USER: 'scrapex_current_user_v2',
  ADMIN_LOGGED_IN: 'scrapex_admin_logged_in_v2',
};

export function getLocal<T>(key: string, fallback: T): T {
  try {
    const val = localStorage.getItem(key);
    if (!val) return fallback;
    return JSON.parse(val) as T;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage`, err);
    return fallback;
  }
}

export function setLocal<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage`, err);
  }
}

export function initializeDataIfEmpty() {
  if (!localStorage.getItem(STORAGE_KEYS.SCRAP_LISTINGS)) {
    setLocal(STORAGE_KEYS.SCRAP_LISTINGS, INITIAL_SCRAP_ITEMS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    setLocal(STORAGE_KEYS.USERS, INITIAL_REGISTERED_USERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.LOGINS)) {
    setLocal(STORAGE_KEYS.LOGINS, INITIAL_LOGIN_HISTORY);
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    setLocal(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  }
  if (!localStorage.getItem(STORAGE_KEYS.SALES)) {
    setLocal(STORAGE_KEYS.SALES, INITIAL_SALES);
  }
}

/**
 * Resizes and compresses uploaded images so localStorage is never exceeded
 */
export function compressImageFile(file: File, maxDimension = 800, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) return resolve('');
    if (!file.type || !file.type.startsWith('image/')) {
      reject(new Error('Selected file must be an image (PNG, JPG, WebP)'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(reader.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => reject(new Error('Failed to load image for compression'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Calculates Green Environmental Savings metrics based on scrap material and weight
 */
export function calculateGreenImpact(materialCategory: string, weightKg: number) {
  let co2Multiplier = 1.5; // kg of CO2 saved per kg of recycled scrap
  let waterMultiplier = 10; // Liters of water saved per kg
  let treeDivisor = 25; // kg to save roughly equivalent tree absorption

  switch (materialCategory.toLowerCase()) {
    case 'metal':
      // Copper, Aluminium, Brass recycling saves massive smelting energy (up to 95% energy save)
      co2Multiplier = 4.2;
      waterMultiplier = 25;
      treeDivisor = 15;
      break;
    case 'ferrous':
      // Steel & Iron saves ~1.8 kg CO2/kg
      co2Multiplier = 1.8;
      waterMultiplier = 12;
      treeDivisor = 30;
      break;
    case 'ewaste':
      // E-waste prevents hazardous heavy metals and saves precious metal mining
      co2Multiplier = 5.5;
      waterMultiplier = 40;
      treeDivisor = 10;
      break;
    case 'paper':
      // Paper saves actual trees directly
      co2Multiplier = 1.1;
      waterMultiplier = 28;
      treeDivisor = 8;
      break;
    case 'plastic':
      co2Multiplier = 2.1;
      waterMultiplier = 15;
      treeDivisor = 25;
      break;
    default:
      co2Multiplier = 2.0;
      waterMultiplier = 15;
      treeDivisor = 20;
  }

  const co2SavedKg = Math.round(weightKg * co2Multiplier);
  const treesEquivalent = Math.max(1, Math.round(weightKg / treeDivisor));
  const waterSavedLiters = Math.round(weightKg * waterMultiplier);

  return { co2SavedKg, treesEquivalent, waterSavedLiters };
}
