



// app/products/WalletScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { BASE_URL } from "../services/api"; // ✅ Yeh sab fix karega

export default function WalletScreen() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadWalletBalance = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/auth/loginScreen");
        return;
      }

      const res = await axios.get(`${BASE_URL}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      if (res.data.success && res.data.user) {
        const newBalance = res.data.user.wallet || 0;
        setBalance(newBalance);

        // Local storage update (baaki screens ke liye)
        const saved = await AsyncStorage.getItem("userData");
        if (saved) {
          const user = JSON.parse(saved);
          user.wallet = newBalance;
          await AsyncStorage.setItem("userData", JSON.stringify(user));
        }
      }
    } catch (err) {
      console.log("Wallet balance error:", err.response?.data || err.message);

      // Fallback local se
      const saved = await AsyncStorage.getItem("userData");
      if (saved) {
        const user = JSON.parse(saved);
        setBalance(user.wallet || 0);
      }

      if (err.response?.status === 401) {
        await AsyncStorage.multiRemove(["token", "userData"]);
        Alert.alert("Session Expired", "Please login again!");
        router.replace("/auth/loginScreen");
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadWalletBalance();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadWalletBalance().finally(() => setRefreshing(false));
  }, []);

  const addMoney = async () => {
    const amt = Number(amount.trim().replace(/[^0-9]/g, ""));
    if (isNaN(amt) || amt < 1) {
      return Alert.alert("Invalid Amount", "Please enter a valid amount (minimum ₹1)");
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Login Required", "Please login to add money");
        router.replace("/auth/loginScreen");
        return;
      }

      const res = await axios.post(
        `${BASE_URL}/api/user/add-money`,
        { amount: amt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 15000,
        }
      );

      if (res.data.success) {
        const newBalance = res.data.wallet || balance + amt;
        setBalance(newBalance);
        setAmount("");

        // Local userData update
        const saved = await AsyncStorage.getItem("userData");
        if (saved) {
          const user = JSON.parse(saved);
          user.wallet = newBalance;
          await AsyncStorage.setItem("userData", JSON.stringify(user));
        }

        Alert.alert(
          "Success!",
          `₹${amt} successfully added to your wallet!`,
          [{ text: "Awesome", style: "default" }]
        );
      } else {
        Alert.alert("Failed", res.data.message || "Could not add money");
      }
    } catch (err) {
      console.log("Add money error:", err.response?.data || err.message);

      let msg = "Something went wrong";
      if (err.message.includes("Network")) {
        msg = "Network issue - Check your internet or server";
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      }

      Alert.alert("Error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#ff6b6b"]}
          tintColor="#ff6b6b"
        />
      }
    >
      <View style={styles.header}>
        <Ionicons name="wallet-outline" size={50} color="#ff6b6b" />
        <Text style={styles.title}>My Wallet</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>₹{balance.toFixed(0)}</Text>
      </View>

      <View style={styles.addSection}>
        <Text style={styles.sectionTitle}>Add Money</Text>
        <Text style={styles.sectionSubtitle}>
          Enter amount to add to your wallet
        </Text>

        <TextInput
          style={styles.input}
          placeholder="₹ Enter amount"
          value={amount}
          onChangeText={(text) => setAmount(text.replace(/[^0-9]/g, ""))}
          keyboardType="numeric"
          placeholderTextColor="#aaa"
          maxLength={6}
        />

        <TouchableOpacity
          style={[styles.addButton, loading && styles.disabledButton]}
          onPress={addMoney}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.addButtonText}>Add Money</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>
          Added amount can be used for shopping, orders & more. 100% secure.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.historyButton}
        onPress={() => router.push("/products/WalletHistoryScreen")}
      >
        <Ionicons name="time-outline" size={22} color="#ff6b6b" />
        <Text style={styles.historyText}>View Transaction History</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  header: {
    alignItems: "center",
    marginVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#222",
    marginTop: 10,
  },
  balanceCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    marginBottom: 30,
  },
  balanceLabel: {
    fontSize: 18,
    color: "#666",
    marginBottom: 10,
  },
  balanceAmount: {
    fontSize: 60,
    fontWeight: "800",
    color: "#ff6b6b",
  },
  addSection: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#222",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#777",
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: "#ff6b6b",
    borderRadius: 16,
    padding: 18,
    fontSize: 22,
    textAlign: "center",
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: "#ff6b6b",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.7,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  note: {
    marginTop: 20,
    textAlign: "center",
    color: "#666",
    fontSize: 14,
    fontStyle: "italic",
  },
  historyButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff0f0",
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  historyText: {
    color: "#ff6b6b",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 12,
  },
});