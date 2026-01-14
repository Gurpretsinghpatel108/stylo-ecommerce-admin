






import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { BASE_URL, getImageUrl } from "../services/api"; // ✅ PRODUCTION URL

export default function OrderScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await axios.get(`${BASE_URL}/api/orders/myorders`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 15000,
      });

      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.log("Orders error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={{ marginTop: 15, color: "#ff6b6b" }}>
          Loading Orders...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Text style={styles.title}>My Orders ({orders.length})</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item._id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#ff6b6b"]}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="bag-outline" size={80} color="#ddd" />
            <Text style={styles.emptyText}>No orders yet!</Text>
            <Text style={{ color: "#999" }}>
              Jaldi se kuch khareedo bhai 😅
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isWallet =
            item.paymentMethod === "WALLET" ||
            item.paymentMethod?.toLowerCase().includes("wallet");

          return (
            <View style={styles.orderCard}>
              <View style={styles.header}>
                <Text style={styles.orderId}>
                  Order #{item._id.slice(-8).toUpperCase()}
                </Text>

                {/* WALLET = PAID | COD = CONFIRMED */}
                <View
                  style={[
                    styles.statusBadge,
                    isWallet
                      ? styles.paidBadge
                      : item.status === "Confirmed"
                      ? styles.confirmed
                      : styles.pendingBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      isWallet && styles.paidText,
                    ]}
                  >
                    {isWallet ? "PAID" : item.status || "PENDING"}
                  </Text>
                </View>
              </View>

              <Text style={styles.date}>
                {new Date(item.createdAt).toLocaleDateString("en-IN")} •{" "}
                <Text
                  style={{
                    fontWeight: "bold",
                    color: isWallet ? "#2e7d32" : "#666",
                  }}
                >
                  {isWallet ? "Paid via Wallet" : item.paymentMethod || "COD"}
                </Text>
              </Text>

              <Text style={styles.amount}>
                Total: ₹{item.totalAmount}
              </Text>

              {item.items.map((prod, i) => (
                <View key={i} style={styles.itemRow}>
                  <Image
                    source={{ uri: getImageUrl(prod.image) }} // ✅ FIXED
                    style={styles.itemImg}
                    resizeMode="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{prod.name}</Text>
                    <Text style={styles.itemDetails}>
                      Qty: {prod.quantity}
                      {prod.selectedSize && ` • Size: ${prod.selectedSize}`}
                    </Text>
                    <Text style={styles.price}>₹{prod.price}</Text>
                  </View>
                </View>
              ))}

              <TouchableOpacity style={styles.trackBtn}>
                <Text style={styles.trackText}>Track Order</Text>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="#ff6b6b"
                />
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    paddingTop: 10,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 15,
    color: "#222",
  },
  orderCard: {
    backgroundColor: "#fff",
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    fontSize: 13,
    color: "#666",
    fontWeight: "600",
  },

  /* BADGES */
  paidBadge: {
    backgroundColor: "#e8f5e8",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  paidText: {
    color: "#2e7d32",
    fontWeight: "bold",
  },
  confirmed: {
    backgroundColor: "#e8f5e8",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pendingBadge: {
    backgroundColor: "#ffebee",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#ff3b30",
  },

  date: {
    marginTop: 5,
    color: "#888",
    fontSize: 13,
  },
  amount: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  itemRow: {
    flexDirection: "row",
    marginTop: 15,
    alignItems: "center",
  },
  itemImg: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 15,
  },
  itemName: {
    fontWeight: "bold",
    fontSize: 16,
  },
  itemDetails: {
    color: "#666",
    marginTop: 4,
  },
  price: {
    color: "#ff6b6b",
    fontWeight: "bold",
    marginTop: 4,
  },
  trackBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    padding: 12,
    backgroundColor: "#fff0f0",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ffcccc",
  },
  trackText: {
    color: "#ff6b6b",
    fontWeight: "bold",
    marginRight: 5,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  emptyText: {
    fontSize: 20,
    marginTop: 20,
    color: "#999",
  },
});
