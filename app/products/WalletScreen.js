// app/products/WalletScreen.js   ← FINAL PRO VERSION

import React, { useState, useEffect, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native"; // ← YE ADD KARNA ZAROORI HAI

const AUTH_BASE_URL = "http://10.23.168.194:5001";   // ← TERA LAPTOP KA SAHI IP
export default function WalletScreen({ navigation }) {
  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Jab bhi screen pe aayega → balance refresh ho jayega (order karne ke baad bhi latest dikhega)
  useFocusEffect(
    useCallback(() => {
      loadWalletBalance();
    }, [])
  );

  // Pull to refresh bhi laga diya mast feel ke liye
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadWalletBalance().then(() => setRefreshing(false));
  }, []);

  const loadWalletBalance = async () => {
    try {
      const saved = await AsyncStorage.getItem("userData");
      if (saved) {
        const user = JSON.parse(saved);
        setBalance(user.wallet || 0);
      }
    } catch (err) {
      console.log("Error loading wallet from storage:", err);
    }
  };

  const addMoney = async () => {
    const amt = Number(amount.replace(/[^0-9.-]+/g, "")); // extra safety agar koi comma ya ₹ daal de
    if (!amt || amt < 1) {
      return Alert.alert("Arre bhai", "Thoda sa bhi daal do, ₹1 se kam nahi chalega!");
    }

    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Login chahiye", "Wallet mein paisa daalne ke liye login karo pehle!");
        return;
      }

      const res = await axios.post(
        `${AUTH_BASE_URL}/api/user/add-money`,
        { amount: amt },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 12000,
        }
      );

      if (res.data.success) {
        setBalance(res.data.wallet);
        setAmount("");

        // Local storage bhi update kar do taaki baaki screens mein bhi latest dikhe
        const saved = await AsyncStorage.getItem("userData");
        if (saved) {
          const user = JSON.parse(saved);
          user.wallet = res.data.wallet;
          await AsyncStorage.setItem("userData", JSON.stringify(user));
        }

        Alert.alert("Ho gaya bhai!", `₹${amt} wallet mein aa gaya!`, [
          { text: "Chalega", style: "default" },
        ]);
      }
    } catch (err) {
      console.log("Add money error:", err.response?.data || err.message);

      let msg = "Kuch toh gadbad hai bhai";
      if (err.message === "Network Error") {
        msg = "Server off hai ya IP galat hai. Laptop chal raha hai na?";
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      }

      Alert.alert("Nahi hua", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#ff6b6b"]} />
      }
    >
      <Text style={styles.title}>My Wallet</Text>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Available Balance</Text>
        <Text style={styles.balanceAmount}>₹{balance}</Text>
      </View>

      <Text style={styles.sectionTitle}>Add Money to Wallet</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter amount (e.g. 500)"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        placeholderTextColor="#999"
      />

      <TouchableOpacity
        style={[styles.addButton, loading && { opacity: 0.6 }]}
        onPress={addMoney}
        disabled={loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#fff" size="small" />
        ) : (
          <Text style={styles.addButtonText}>Add Money</Text>
        )}
      </TouchableOpacity>

      <Text style={styles.note}>
        Money added to wallet can be used for payments during checkout.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 30,
    color: "#222",
  },
  balanceCard: {
    backgroundColor: "#fff",
    padding: 35,
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  balanceLabel: {
    fontSize: 20,
    color: "#666",
  },
  balanceAmount: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#ff6b6b",
    marginTop: 15,
  },
  sectionTitle: {
    fontSize: 20,
    marginTop: 50,
    fontWeight: "600",
    color: "#333",
  },
  input: {
    borderWidth: 2,
    borderColor: "#ff6b6b",
    borderRadius: 14,
    padding: 18,
    marginTop: 15,
    backgroundColor: "#fff",
    fontSize: 20,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: "#ff6b6b",
    padding: 20,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 30,
    elevation: 8,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  note: {
    marginTop: 30,
    textAlign: "center",
    color: "#666",
    fontSize: 15,
    fontStyle: "italic",
    paddingHorizontal: 20,
  },
});