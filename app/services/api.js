// app/services/api.js
// YE SABSE PERFECT VERSION HAI — SAB KUCH ALAG-ALAG PORT PE BILKUL SAHI CHAL RAHA HAI

// ========================= BASE URLS =========================
export const AUTH_BASE_URL  = "http://10.23.168.194:5001";  
// ← Sirf LOGIN aur REGISTER, profile, orders

export const MAIN_BASE_URL  = "http://10.23.168.194:5000";   
// ← Categories, products, uploads

export const ORDER_BASE_URL = "http://10.23.168.194:5001";   
// ← Cart aur Orders ka kaam

// ========================= AUTH APIS =========================
export const REGISTER_API = `${AUTH_BASE_URL}/auth/register`;
// → Naya account banane ke liye

export const LOGIN_API = `${AUTH_BASE_URL}/auth/login`;
// → Login karne ke liye

export const PROFILE_API = `${AUTH_BASE_URL}/api/user/profile`;
export const UPDATE_PROFILE_API = `${AUTH_BASE_URL}/api/user/update`;    // PUT/PATCH
// → User profile fetch karne ke liye

// ========================= CATEGORIES & PRODUCTS =========================
export const GET_CATEGORIES_API = `${MAIN_BASE_URL}/api/categories`;
// → Home screen pe categories dikhane ke liye

export const GET_ALL_PRODUCTS_API = `${MAIN_BASE_URL}/api/products`;
// → Sare products fetch karne ke liye (ProductsScreen)

export const GET_PRODUCT_API = (id) => `${MAIN_BASE_URL}/api/products/${id}`;
// → Single product detail screen ke liye

// ========================= ORDERS =========================
export const PLACE_ORDER_API = `${ORDER_BASE_URL}/api/orders/create`;
// → Cart se order place karne ke liye
// → Buy Now se order place karne ke liye

export const GET_ORDERS_API = `${ORDER_BASE_URL}/api/orders/my-orders`;
// → My Orders screen mein saare orders dikhane ke liye

// ========================= IMAGE HELPER =========================
export const getImageUrl = (image) => {
  if (!image) return "https://via.placeholder.com/150";
  const filename = Array.isArray(image) ? image[0] : image;
  if (filename.startsWith("http")) return filename;
  return `${MAIN_BASE_URL}/uploads/${filename}`;
};
// → Category image
// → Product image
// → Cart mein image
// → My Orders mein image
// → Profile photo

// ========================= DEFAULT EXPORT =========================
// Expo Router ke liye, warna error deta hai
export default {};
