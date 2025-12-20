

// app/auth/_authHelper.js
import AsyncStorage from "@react-native-async-storage/async-storage";

// Ye tera original function — bilkul perfect hai
export const requireAuth = async (action, router, redirectPath = null) => {
  const token = await AsyncStorage.getItem("token");

  if (!token) {
    // Guest hai → Login pe bhej do
    if (redirectPath) {
      await AsyncStorage.setItem("redirectAfterLogin", redirectPath);
    }
    router.push("/auth/LoginScreen");
    return; // Action nahi chalega
  }

  // Token hai → Action chala do
  await action();
};

// YE LINE ADD KAR DI — EXPO ROUTER KHUSH HO JAYEGA, WARNING 100% GAYAB!!!
export default function AuthHelper() {
  return null;
}