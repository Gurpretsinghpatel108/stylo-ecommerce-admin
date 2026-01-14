// // app/services/api.js
// // PRODUCTION-READY VERSION – Single BASE_URL from app.json extra.apiUrl
// // Local dev fallback bhi rakha hai

// import Constants from 'expo-constants';

// // ========================= SINGLE BASE URL =========================
// export const BASE_URL = Constants.expoConfig?.extra?.apiUrl 
//   || 'http://192.168.29.72:5000';  // Local fallback – production mein nahi chalega

// // ========================= AUTH APIS (same backend pe sab) =========================
// export const REGISTER_API = `${BASE_URL}/auth/register`;
// export const LOGIN_API = `${BASE_URL}/auth/login`;
// export const PROFILE_API = `${BASE_URL}/api/user/profile`;
// export const UPDATE_PROFILE_API = `${BASE_URL}/api/user/update`;  // PUT/PATCH

// // ========================= CATEGORIES & PRODUCTS =========================
// export const GET_CATEGORIES_API = `${BASE_URL}/api/categories`;
// export const GET_ALL_PRODUCTS_API = `${BASE_URL}/api/products`;
// export const GET_PRODUCT_API = (id) => `${BASE_URL}/api/products/${id}`;

// // ========================= ORDERS & CART =========================
// export const PLACE_ORDER_API = `${BASE_URL}/api/orders/create`;
// export const GET_ORDERS_API = `${BASE_URL}/api/orders/my-orders`;

// // ========================= IMAGE HELPER (Production mein live URL) =========================
// export const getImageUrl = (image) => {
//   if (!image) return "https://via.placeholder.com/150"; // Fallback placeholder

//   const filename = Array.isArray(image) ? image[0] : image;

//   // Agar admin ne full URL daala ho (jaise Cloudinary future mein)
//   if (filename.startsWith("http")) return filename;

//   // Backend uploads route se load karo
//   return `${BASE_URL}/uploads/${filename}`;
// };

// // ========================= DEFAULT EXPORT (Expo Router ke liye zaroori) =========================
// export default {};









// app/services/api.js
// FINAL PRODUCTION-READY VERSION – No local fallback in production

import Constants from 'expo-constants';

// ========================= SINGLE BASE URL =========================
// Production build mein yeh app.json/extra.apiUrl se aayega (Railway URL)
// Development mein agar extra.apiUrl nahi mila to local fallback
export const BASE_URL = Constants.expoConfig?.extra?.apiUrl 
  || (process.env.NODE_ENV === 'development' ? 'http://192.168.29.72:5000' : null);

// Agar production build mein BASE_URL null aa raha hai to error throw kar denge (debug ke liye)
if (!BASE_URL && process.env.NODE_ENV !== 'development') {
  console.error('CRITICAL: BASE_URL is undefined in production build! Check app.json extra.apiUrl');
}

// ========================= AUTH APIS =========================
export const REGISTER_API = `${BASE_URL}/auth/register`;
export const LOGIN_API = `${BASE_URL}/auth/login`;
export const PROFILE_API = `${BASE_URL}/api/user/profile`;
export const UPDATE_PROFILE_API = `${BASE_URL}/api/user/update`;

// ========================= CATEGORIES & PRODUCTS =========================
export const GET_CATEGORIES_API = `${BASE_URL}/api/categories`;
export const GET_ALL_PRODUCTS_API = `${BASE_URL}/api/products`;
export const GET_PRODUCT_API = (id) => `${BASE_URL}/api/products/${id}`;

// ========================= ORDERS & CART =========================
export const PLACE_ORDER_API = `${BASE_URL}/api/orders/create`;
export const GET_ORDERS_API = `${BASE_URL}/api/orders/my-orders`;

// ========================= IMAGE HELPER (Production-safe) =========================
export const getImageUrl = (image) => {
  if (!image) return "https://via.placeholder.com/150";

  const filename = Array.isArray(image) ? image[0] : image;

  // Agar admin ne full URL daala (Cloudinary, AWS etc.)
  if (filename.startsWith("http")) return filename;

  // Normal case: backend uploads folder se
  return `${BASE_URL}/uploads/${filename}`;
};

// ========================= DEBUG LOG (sirf development mein dikhega) =========================
if (process.env.NODE_ENV === 'development') {
  console.log('🔥 API BASE_URL:', BASE_URL);
  console.log('🔥 GET_CATEGORIES_API:', GET_CATEGORIES_API);
}

// Default export (Expo Router ke liye zaroori)
export default {};