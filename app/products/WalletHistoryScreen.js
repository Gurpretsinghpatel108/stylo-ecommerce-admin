// WalletHistoryScreen.js – ERROR-FREE VERSION

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";

const AUTH_BASE_URL = "http://10.23.168.194:5001";

export default function WalletHistoryScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(`${AUTH_BASE_URL}/api/user/wallet-history`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        setTransactions(res.data.transactions || []);
      }
    } catch (err) {
      console.log("Error:", err.message);
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

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <Ionicons
        name={item.type === "credit" ? "add-circle" : "remove-circle"}
        size={36}
        color={item.type === "credit" ? "#4caf50" : "#f44336"}
      />
      <View style={styles.details}>
        <Text style={styles.amount}>
          {item.type === "credit" ? "+ " : "- "}₹{item.amount}
        </Text>
        <Text style={styles.desc}>
          {item.description || "Wallet transaction"}
        </Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      <Text style={styles.balance}>Bal: ₹{item.balanceAfter}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={styles.loadingText}>Loading History...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet History</Text>

      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>No transactions yet!</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#ff6b6b"]}
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginVertical: 20, color: "#222" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { fontSize: 18, color: "#666" },
  item: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    elevation: 3,
    alignItems: "center",
  },
  details: { flex: 1, marginLeft: 16 },
  amount: { fontSize: 20, fontWeight: "bold", color: "#333" },
  desc: { fontSize: 14, color: "#666", marginTop: 4 },
  date: { fontSize: 12, color: "#999", marginTop: 4 },
  balance: { fontSize: 16, fontWeight: "bold", color: "#ff6b6b" },
});