// // app/services/api.js
// // FINAL – Production Railway URL priority, no local IP issues

// import Constants from 'expo-constants';

// // Priority: EAS env (production) > fallback to your working Railway URL
// export const BASE_URL = process.env.EXPO_PUBLIC_API_URL 
//   || 'https://ecommerce-backend-production-0cdd.up.railway.app';  // ← Yeh tere working URL hai

// // Debug log (dev mode mein dikhega)
// if (__DEV__) {
//   console.log('🔥 [API] BASE_URL:', BASE_URL);
//   console.log('🔥 [API] GET_CATEGORIES_API:', `${BASE_URL}/api/categories`);
// }

// // All APIs (same as before)
// export const REGISTER_API = `${BASE_URL}/auth/register`;
// export const LOGIN_API = `${BASE_URL}/auth/login`;
// export const PROFILE_API = `${BASE_URL}/api/user/profile`;
// export const UPDATE_PROFILE_API = `${BASE_URL}/api/user/update`;

// export const GET_CATEGORIES_API = `${BASE_URL}/api/categories`;
// export const GET_ALL_PRODUCTS_API = `${BASE_URL}/api/products`;
// export const GET_PRODUCT_API = (id) => `${BASE_URL}/api/products/${id}`;

// export const PLACE_ORDER_API = `${BASE_URL}/api/orders/create`;
// export const GET_ORDERS_API = `${BASE_URL}/api/orders/my-orders`;

// // Image helper – Cloudinary direct secure_url handle karega
// export const getImageUrl = (image) => {
//   if (!image) return "https://via.placeholder.com/150?text=No+Image";

//   const filename = Array.isArray(image) ? image[0] : image;

//   if (filename && typeof filename === 'string' && filename.startsWith('http')) {
//     return filename;  // Cloudinary secure_url
//   }

//   // Fallback (agar kabhi chahiye)
//   return `${BASE_URL}/uploads/${filename}`;
// };

// export default {};





// // app/services/api.js
// // FINAL – Production Render URL

// import Constants from 'expo-constants';

// // Priority: EAS env (production) > fallback to Render URL
// export const BASE_URL = process.env.EXPO_PUBLIC_API_URL 
//   || 'https://user-stylo-backend.onrender.com';  // ← Updated Render URL

// // Debug log (dev mode mein dikhega)
// if (__DEV__) {
//   console.log('🔥 [API] BASE_URL:', BASE_URL);
//   console.log('🔥 [API] GET_CATEGORIES_API:', `${BASE_URL}/api/categories`);
// }

// // All APIs (same as before)
// export const REGISTER_API = `${BASE_URL}/auth/register`;
// export const LOGIN_API = `${BASE_URL}/auth/login`;
// export const PROFILE_API = `${BASE_URL}/api/user/profile`;
// export const UPDATE_PROFILE_API = `${BASE_URL}/api/user/update`;

// export const GET_CATEGORIES_API = `${BASE_URL}/api/categories`;
// export const GET_ALL_PRODUCTS_API = `${BASE_URL}/api/products`;
// export const GET_PRODUCT_API = (id) => `${BASE_URL}/api/products/${id}`;

// export const PLACE_ORDER_API = `${BASE_URL}/api/orders/create`;
// export const GET_ORDERS_API = `${BASE_URL}/api/orders/my-orders`;

// // Image helper – Cloudinary direct secure_url handle karega
// export const getImageUrl = (image) => {
//   if (!image) return "https://via.placeholder.com/150?text=No+Image";

//   const filename = Array.isArray(image) ? image[0] : image;

//   if (filename && typeof filename === 'string' && filename.startsWith('http')) {
//     return filename;  // Cloudinary secure_url
//   }

//   // Fallback (agar kabhi chahiye)
//   return `${BASE_URL}/uploads/${filename}`;
// };

// export default {};







// app/services/api.js
// DUAL BACKEND SETUP – User App (Render) + Admin (Railway)

import Constants from 'expo-constants';

// 🔵 USER APP BACKEND (Render – for auth, orders, etc.)
export const USER_BASE_URL = process.env.EXPO_PUBLIC_USER_API_URL 
  || 'https://user-stylo-backend.onrender.com';

// 🟢 ADMIN BACKEND (Railway – for categories, products, etc.)
export const ADMIN_BASE_URL = process.env.EXPO_PUBLIC_ADMIN_API_URL 
  || 'https://ecommerce-backend-production-0cdd.up.railway.app';

// Debug logs
if (__DEV__) {
  console.log('🔥 [API] USER_BASE_URL:', USER_BASE_URL);
  console.log('🔥 [API] ADMIN_BASE_URL:', ADMIN_BASE_URL);
  console.log('🔥 [API] GET_CATEGORIES_API:', `${ADMIN_BASE_URL}/api/categories`);
}

// ===== USER APIs (Render) =====
export const REGISTER_API = `${USER_BASE_URL}/auth/register`;
export const LOGIN_API = `${USER_BASE_URL}/auth/login`;
export const PROFILE_API = `${USER_BASE_URL}/api/user/profile`;
export const UPDATE_PROFILE_API = `${USER_BASE_URL}/api/user/update`;
export const PLACE_ORDER_API = `${USER_BASE_URL}/api/orders/create`;
export const GET_ORDERS_API = `${USER_BASE_URL}/api/orders/my-orders`;

// ===== ADMIN/PRODUCT APIs (Railway) =====
export const GET_CATEGORIES_API = `${ADMIN_BASE_URL}/api/categories`;
export const GET_ALL_PRODUCTS_API = `${ADMIN_BASE_URL}/api/products`;
export const GET_PRODUCT_API = (id) => `${ADMIN_BASE_URL}/api/products/${id}`;

// Image helper (Railway backend se images aayengi)
export const getImageUrl = (image) => {
  if (!image) return "https://via.placeholder.com/150?text=No+Image";

  const filename = Array.isArray(image) ? image[0] : image;

  if (filename && typeof filename === 'string' && filename.startsWith('http')) {
    return filename;  // Cloudinary/direct URL
  }

  // Railway backend se serve hongi images
  return `${ADMIN_BASE_URL}/uploads/${filename}`;
};

export default {};