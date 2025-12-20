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
import { useFocusEffect } from "expo-router"; // ya @react-navigation/native jo bhi use kar raha

const AUTH_BASE_URL = "http://10.23.168.194:5001"; // tera IP

export default function WalletHistoryScreen() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchHistory = async (newPage = 1) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await axios.get(
        `${AUTH_BASE_URL}/api/user/wallet-history?page=${newPage}&limit=20`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.success) {
        const newTransactions = res.data.transactions;
        if (newPage === 1) {
          setTransactions(newTransactions);
        } else {
          setTransactions((prev) => [...prev, ...newTransactions]);
        }
        setHasMore(res.data.pagination.hasMore || false);
      }
    } catch (err) {
      console.log("History error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchHistory(1);
      setPage(1);
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory(1);
    setPage(1);
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchHistory(nextPage);
    }
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
          {item.type === "credit" ? "+" : "-"} ₹{item.amount}
        </Text>
        <Text style={styles.desc}>{item.description || "Wallet transaction"}</Text>
        <Text style={styles.date}>
          {new Date(item.createdAt).toLocaleString()}
        </Text>
      </View>
      <Text style={styles.balance}>Bal: ₹{item.balanceAfter}</Text>
    </View>
  );

  if (loading && transactions.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text>Loading History...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet History</Text>
      {transactions.length === 0 ? (
        <Text style={styles.empty}>No transactions yet!</Text>
      ) : (
        <FlatList
          data={transactions}
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#ff6b6b"]} />
          }
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading && page > 1 ? <ActivityIndicator /> : null}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center", marginVertical: 20, color: "#222" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  empty: { textAlign: "center", marginTop: 50, fontSize: 18, color: "#666" },
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