// app/products/ProfileScreen.js
import React, { useEffect, useState, useCallback } from "react";
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
import { PROFILE_API } from "../services/api";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null); // Guest User hata diya
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
      });

      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        await AsyncStorage.setItem("userData", JSON.stringify(res.data.user));
      }
    } catch (err) {
      // Agar API fail ho toh local se load karo
      const saved = await AsyncStorage.getItem("userData");
      if (saved) {
        setUser(JSON.parse(saved));
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
          router.replace("/drawer/homeScreen");
        },
      },
    ]);
  };

  // Loading screen
  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={{ marginTop: 15, color: "#ff6b6b", fontWeight: "bold" }}>
          Loading Profile...
        </Text>
      </View>
    );
  }

  // Agar user nahi mila (token expire ya kuch bhi)
  if (!user) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={80} color="#ff6b6b" />
        <Text style={styles.errorText}>Profile load nahi hua</Text>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => router.replace("/auth/LoginScreen")}
        >
          <Text style={styles.loginBtnText}>Login Again</Text>
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
            <Ionicons name="person" size={70} color="#ff6b6b" />
          </View>
          <Text style={styles.userName}>{user.name || "User"}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <Text style={styles.userPhone}>{user.phone || "-"}</Text>
          <Text style={styles.walletBalance}>
            {/* Wallet: ₹{user.wallet || 0} */}
          </Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuSection}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/products/EditProfileScreen")}
          >
            <Ionicons name="person-outline" size={24} color="#ff6b6b" />
            <Text style={styles.menuText}>Edit Profile</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          {/* MY WALLET - CLICKABLE + BALANCE */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/products/WalletScreen")}
          >
            <Ionicons name="wallet-outline" size={24} color="#ff6b6b" />
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={styles.menuText}>My Wallet</Text>
              <Text style={styles.walletText}>₹{user.wallet || 0} available</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/products/WalletHistoryScreen")}
          >
            <Ionicons name="time-outline" size={24} color="#ff6b6b" />
            <Text style={styles.menuText}>Wallet History</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>


          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => Alert.alert("Coming Soon", "Address feature jaldi!")}
          >
            <Ionicons name="location-outline" size={24} color="#ff6b6b" />
            <Text style={styles.menuText}>Manage Addresses</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/products/wishlistScreen")}
          >
            <Ionicons name="heart-outline" size={24} color="#ff6b6b" />
            <Text style={styles.menuText}>My Wishlist</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/products/OrderScreen")}
          >
            <Ionicons name="bag-outline" size={24} color="#ff6b6b" />
            <Text style={styles.menuText}>My Orders</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
           onPress={() => router.push("/products/ChatSupport")} 
          >
            <Ionicons name="location-outline" size={24} color="#ff6b6b" />
            <Text style={styles.menuText}>Gauri Support Center</Text>
            <Ionicons name="chevron-forward" size={24} color="#ccc" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={26} color="#e74c3c" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#fff",
    margin: 16,
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    elevation: 8,
  },
  avatarPlaceholder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#ffebee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: { fontSize: 26, fontWeight: "bold", color: "#222" },
  userEmail: { fontSize: 16, color: "#666", marginTop: 6 },
  userPhone: { fontSize: 17, color: "#ff6b6b", fontWeight: "600", marginTop: 6 },
  walletBalance: { fontSize: 20, color: "#ff6b6b", fontWeight: "bold", marginTop: 12 },
  menuSection: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 16,
    elevation: 5,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  walletText: {
    fontSize: 14,
    color: "#ff6b6b",
    fontWeight: "600",
    marginTop: 4,
  },
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 20,
    padding: 18,
    backgroundColor: "#ffebee",
    borderRadius: 16,
    elevation: 3,
  },
  logoutText: {
    marginLeft: 12,
    fontSize: 19,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: "center",
    color: "#ff6b6b",
  },
  loginBtn: {
    marginTop: 20,
    backgroundColor: "#ff6b6b",
    padding: 15,
    borderRadius: 12,
  },
  loginBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});