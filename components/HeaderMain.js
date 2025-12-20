// components/Header989/HeaderMain.js
// FINAL FIXED VERSION

import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  DeviceEventEmitter,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HeaderMain() {
  const router = useRouter();
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [token, setToken] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const loadToken = useCallback(async () => {
    const t = await AsyncStorage.getItem("token");
    setToken(t || null);
  }, []);

  const loadCart = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem("cart");
      const cart = raw ? JSON.parse(raw) : [];
      setCartCount(Array.isArray(cart) ? cart.length : 0);
    } catch (e) {
      setCartCount(0);
    }
  }, []);

  const loadWishlist = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem("wishlist");
      const data = raw ? JSON.parse(raw) : [];
      setWishlistCount(Array.isArray(data) ? data.length : 0);
    } catch (e) {
      setWishlistCount(0);
    }
  }, []);

  useEffect(() => {
    loadToken();
    loadCart();
    loadWishlist();

    const listeners = [
      DeviceEventEmitter.addListener("cartUpdated", loadCart),
      DeviceEventEmitter.addListener("wishlistUpdated", loadWishlist),
      DeviceEventEmitter.addListener("authChanged", () => {
        loadToken();
        loadCart();
        loadWishlist();
      }),
    ];

    return () => listeners.forEach(l => l.remove());
  }, [loadToken, loadCart, loadWishlist]);

  const goToCart = async () => {
    if (!token) {
      await AsyncStorage.setItem("redirectAfterLogin", "/products/CartScreen");
      Alert.alert("Login Required", "Please login to view your cart", [
        { text: "Cancel", style: "cancel" },
        { text: "Login", onPress: () => router.push("/auth/loginScreen") },
      ]);
      return;
    }
    router.push("/products/CartScreen");
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "cart", "wishlist"]);
      setToken(null);
      setCartCount(0);
      setWishlistCount(0);
      setShowProfileMenu(false);

      DeviceEventEmitter.emit("authChanged");
      DeviceEventEmitter.emit("cartUpdated");
      DeviceEventEmitter.emit("wishlistUpdated");

      Alert.alert("Success", "Logged out successfully!");
      router.replace("/drawer/homeScreen");
    } catch (error) {
      Alert.alert("Error", "Logout failed!");
    }
  };

  const menuItems = token
    ? [
      {
        label: "My Profile",
        icon: "person-outline",
        onPress: () => {
          setShowProfileMenu(false);
          router.push("/products/ProfileScreen");
        },
      },
      {
        label: "My Orders",
        icon: "bag-outline",
        onPress: () => {
          setShowProfileMenu(false);
          router.push("/products/OrderScreen");   // SAHI ROUTE!!!
        },
      },
      {
        label: "Logout",
        icon: "log-out-outline",
        onPress: handleLogout,
        danger: true,
      },
    ]
    : [
      {
        label: "Login",
        icon: "log-in-outline",
        onPress: () => {
          setShowProfileMenu(false);
          router.push("/auth/loginScreen");
        },
      },
      {
        label: "Sign Up",
        icon: "person-add-outline",
        onPress: () => {
          setShowProfileMenu(false);
          router.push("/auth/createAccountScreen");
        },
      },
    ];

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.push("/drawer/homeScreen")}>
        <Image source={require("../assets/images/newLogo.jpg")} style={styles.logo} />
      </TouchableOpacity>

      <View style={styles.rightIcons}>
        <TouchableOpacity onPress={() => router.push("/search/searchScreen")} style={styles.iconBtn}>
          <Ionicons name="search-outline" size={25} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/products/wishlistScreen")} style={styles.iconBtn}>
          <Ionicons name="heart-outline" size={25} color="#000" />
          {wishlistCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{wishlistCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={goToCart} style={styles.iconBtn}>
          <Ionicons name="cart-outline" size={25} color="#000" />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowProfileMenu(true)} style={styles.iconBtn}>
          <Ionicons name="person-circle-outline" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      <Modal transparent visible={showProfileMenu} animationType="fade" onRequestClose={() => setShowProfileMenu(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowProfileMenu(false)}>
          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
                <Ionicons name={item.icon} size={20} color={item.danger ? "#e74c3c" : "#000"} />
                <Text style={[styles.menuText, item.danger && { color: "#e74c3c" }]}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: "#fff",
    elevation: 6,
  },
  rightIcons: { flexDirection: "row", alignItems: "center" },
  iconBtn: { marginLeft: 20, position: "relative" },
  logo: { width: 60, height: 60, borderRadius: 30, resizeMode: "cover" },
  badge: {
    position: "absolute",
    top: -8,
    right: -10,
    backgroundColor: "#e74c3c",
    borderRadius: 12,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#fff", fontSize: 11, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 70,
    paddingRight: 16,
  },
  menuContainer: { backgroundColor: "#fff", borderRadius: 12, padding: 8, elevation: 10, minWidth: 180 },
  menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 10 },
  menuText: { marginLeft: 12, fontSize: 15, fontWeight: "500" },
});