


// app/products/ProfileScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import { PROFILE_API } from "../services/api"; // ✅ BASE_URL yahan se aayega

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get(PROFILE_API, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      if (res.data.success && res.data.user) {
        const userData = res.data.user;
        setUser(userData);
        await AsyncStorage.setItem("userData", JSON.stringify(userData));
      }
    } catch (err) {
      console.log("Profile fetch error:", err.response?.data || err.message);

      // Fallback to local storage
      const saved = await AsyncStorage.getItem("userData");
      if (saved) {
        setUser(JSON.parse(saved));
      }

      if (err.response?.status === 401) {
        Alert.alert("Session Expired", "Please login again!", [
          {
            text: "OK",
            onPress: async () => {
              await AsyncStorage.multiRemove(["token", "userData"]);
              router.replace("/auth/loginScreen");
            },
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserProfile();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert("Logout", "Bhai sach mein logout karna hai?", [
      { text: "Nahi bhai", style: "cancel" },
      {
        text: "Haan kar de",
        onPress: async () => {
          await AsyncStorage.multiRemove(["token", "userData", "cart", "wishlist"]);
          router.replace("/(drawer)/homeScreen");
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={styles.loadingText}>Loading Profile...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={90} color="#ff6b6b" />
        <Text style={styles.errorText}>Profile load nahi hua bhai</Text>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => router.replace("/auth/loginScreen")}
        >
          <Text style={styles.loginBtnText}>Login Karo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <LinearGradient colors={["#ff6b6b", "#ff8e8e"]} style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="person" size={80} color="#ff6b6b" />
          </View>
          <Text style={styles.userName}>{user.name || "User"}</Text>
          <Text style={styles.userEmail}>{user.email || "No email"}</Text>
          {user.phone && (
            <Text style={styles.userPhone}>+91 {user.phone}</Text>
          )}
          <View style={styles.walletContainer}>
            <Ionicons name="wallet-outline" size={24} color="#ff6b6b" />
            <Text style={styles.walletBalance}>
              Wallet: ₹{user.wallet || 0}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/products/EditProfileScreen")}
          >
            <Ionicons name="person-outline" size={26} color="#ff6b6b" />
            <Text style={styles.menuText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/products/WalletScreen")}
          >
            <Ionicons name="wallet-outline" size={26} color="#ff6b6b" />
            <View style={styles.menuItemTextContainer}>
              <Text style={styles.menuText}>My Wallet</Text>
              <Text style={styles.walletSubText}>₹{user.wallet || 0} available</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/products/WalletHistoryScreen")}
          >
            <Ionicons name="time-outline" size={26} color="#ff6b6b" />
            <Text style={styles.menuText}>Wallet History</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/products/MembershipCardsScreen")}
          >
            <Ionicons name="card-outline" size={26} color="#ff6b6b" />
            <Text style={styles.menuText}>Membership Cards</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert("Coming Soon", "Address management jaldi aa raha hai!")}
          >
            <Ionicons name="location-outline" size={26} color="#ff6b6b" />
            <Text style={styles.menuText}>Manage Addresses</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/products/wishlistScreen")}
          >
            <Ionicons name="heart-outline" size={26} color="#ff6b6b" />
            <Text style={styles.menuText}>My Wishlist</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/products/OrderScreen")}
          >
            <Ionicons name="bag-outline" size={26} color="#ff6b6b" />
            <Text style={styles.menuText}>My Orders</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/products/ChatSupport")}
          >
            <Ionicons name="chatbubble-outline" size={26} color="#ff6b6b" />
            <Text style={styles.menuText}>Gauri Support Center</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={28} color="#e74c3c" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingBottom: 35,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#fff",
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#fff",
    margin: 20,
    marginTop: -50,
    borderRadius: 24,
    padding: 30,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  avatarPlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#ffebee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 4,
    borderColor: "#ff6b6b30",
  },
  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
  },
  userEmail: {
    fontSize: 16,
    color: "#666",
    marginTop: 6,
  },
  userPhone: {
    fontSize: 17,
    color: "#ff6b6b",
    fontWeight: "600",
    marginTop: 6,
  },
  walletContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#fff0f0",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 30,
  },
  walletBalance: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff6b6b",
    marginLeft: 10,
  },
  menuSection: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 10,
    borderRadius: 20,
    elevation: 6,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItemTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  menuText: {
    fontSize: 17,
    color: "#333",
    fontWeight: "600",
  },
  walletSubText: {
    fontSize: 14,
    color: "#ff6b6b",
    marginTop: 4,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 20,
    marginVertical: 30,
    padding: 18,
    backgroundColor: "#ffebee",
    borderRadius: 16,
    elevation: 4,
  },
  logoutText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#e74c3c",
    marginLeft: 12,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 15,
    color: "#ff6b6b",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 20,
    marginTop: 20,
    textAlign: "center",
    color: "#ff6b6b",
    fontWeight: "600",
  },
  loginBtn: {
    marginTop: 30,
    backgroundColor: "#ff6b6b",
    paddingVertical: 16,
    paddingHorizontal: 40,
    borderRadius: 12,
  },
  loginBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
});