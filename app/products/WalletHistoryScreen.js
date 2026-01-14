

// app/products/WalletHistoryScreen.js
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { BASE_URL } from "../services/api"; // ✅ Yeh import sab fix karega

export default function WalletHistoryScreen() {
  const router = useRouter();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        router.replace("/auth/loginScreen");
        return;
      }

      const res = await axios.get(`${BASE_URL}/api/user/wallet-history`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 10000,
      });

      if (res.data.success) {
        setTransactions(res.data.transactions || []);
      } else {
        console.log("API response not success:", res.data);
      }
    } catch (err) {
      console.log("Wallet history error:", err.response?.data || err.message);

      if (err.response?.status === 401) {
        await AsyncStorage.multiRemove(["token", "userData"]);
        Alert.alert("Session Expired", "Please login again!");
        router.replace("/auth/loginScreen");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  const renderItem = ({ item }) => {
    const isCredit = item.type === "credit" || item.type === "add" || item.amount > 0;
    
    return (
      <View style={styles.item}>
        <Ionicons
          name={isCredit ? "add-circle" : "remove-circle"}
          size={40}
          color={isCredit ? "#4caf50" : "#f44336"}
        />
        <View style={styles.details}>
          <Text style={[styles.amount, { color: isCredit ? "#4caf50" : "#f44336" }]}>
            {isCredit ? "+ " : "- "}₹{Math.abs(item.amount).toFixed(0)}
          </Text>
          <Text style={styles.desc}>
            {item.description || "Wallet transaction"}
          </Text>
          <Text style={styles.date}>
            {new Date(item.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <Text style={styles.balance}>Bal: ₹{item.balanceAfter?.toFixed(0) || "—"}</Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={styles.loadingText}>Loading Wallet History...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet History</Text>

      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="wallet-outline" size={80} color="#ddd" />
          <Text style={styles.emptyText}>No transactions yet!</Text>
          <Text style={styles.emptySubText}>
            Jab bhi wallet mein kuch add ya deduct hoga, yahan dikhega
          </Text>
        </View>
      ) : (
        <FlatList
          data={transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))} // Latest first
          renderItem={renderItem}
          keyExtractor={(item) => item._id?.toString() || Math.random().toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#ff6b6b"]}
              tintColor="#ff6b6b"
            />
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    textAlign: "center",
    marginVertical: 20,
    color: "#222",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: "#ff6b6b",
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#666",
    marginTop: 20,
  },
  emptySubText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    marginTop: 10,
  },
  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 18,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    alignItems: "center",
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  amount: {
    fontSize: 22,
    fontWeight: "bold",
  },
  desc: {
    fontSize: 15,
    color: "#555",
    marginTop: 4,
  },
  date: {
    fontSize: 13,
    color: "#999",
    marginTop: 4,
  },
  balance: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ff6b6b",
    backgroundColor: "#fff0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
});