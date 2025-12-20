// app/products/CartScreen.js   ← FINAL ULTIMATE VERSION (WALLET + COD FULLY WORKING, ORDER ID LINKED)

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { DeviceEventEmitter } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

import { PLACE_ORDER_API, getImageUrl } from "../services/api";

const AUTH_BASE_URL = "http://10.23.168.194:5001"; // TERA LAPTOP IP

export default function CartScreen() {
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("COD");

  // Load cart + user wallet
  const loadData = async () => {
    try {
      const rawCart = await AsyncStorage.getItem("cart");
      const items = rawCart ? JSON.parse(rawCart) : [];
      setCart(items);

      const savedUser = await AsyncStorage.getItem("userData");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.log("Load error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const sub = DeviceEventEmitter.addListener("cartUpdated", loadData);
    return () => sub.remove();
  }, []);

  // Quantity update
  const updateQuantity = async (id, change) => {
    const updated = cart.map((item) => {
      if (item._id === id) {
        const newQty = (item.quantity || 1) + change;
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    });
    await AsyncStorage.setItem("cart", JSON.stringify(updated));
    DeviceEventEmitter.emit("cartUpdated");
  };

  // Remove item
  const removeFromCart = async (id) => {
    const updated = cart.filter((i) => i._id !== id);
    await AsyncStorage.setItem("cart", JSON.stringify(updated));
    DeviceEventEmitter.emit("cartUpdated");
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + item.currentPrice * (item.quantity || 1), 0);
  };

  const totalAmount = getTotalPrice() + 50;

  // PLACE ORDER WITH WALLET OR COD - FIXED FLOW
  const placeOrder = async () => {
    if (placingOrder) return;
    setPlacingOrder(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Login Karo Bhai!", "Order ke liye login zaroori hai", [
          { text: "Cancel" },
          { text: "Login", onPress: () => router.push("/auth/loginScreen") },
        ]);
        setPlacingOrder(false);
        return;
      }

      // WALLET PAYMENT - FIXED: PEHLE ORDER, PHIR DEDUCT
      if (selectedPayment === "WALLET") {
        if (!user || user.wallet < totalAmount) {
          Alert.alert("Arre bhai", "Wallet mein paisa kam hai!");
          setPlacingOrder(false);
          return;
        }

        try {
          // STEP 1: PEHLE ORDER PLACE KAR
          const orderData = {
            items: cart.map((item) => ({
              productId: item._id,
              name: item.name,
              price: item.currentPrice,
              quantity: item.quantity || 1,
              image: Array.isArray(item.image) ? item.image[0] : item.image || "",
              selectedSize: item.selectedSize || null,
            })),
            totalAmount,
            paymentMethod: "WALLET",
            shippingAddress: "Home Delivery",
          };

          const orderRes = await axios.post(PLACE_ORDER_API, orderData, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!orderRes.data.success) {
            Alert.alert("Order Failed", orderRes.data.message || "Order place nahi hua");
            setPlacingOrder(false);
            return;
          }

          const orderId = orderRes.data.order._id;

          // STEP 2: AB WALLET SE DEDUCT KAR + ORDER ID BHEJ
          const deductRes = await axios.post(
            `${AUTH_BASE_URL}/api/user/use-wallet`,
            {
              amountToDeduct: totalAmount,
              orderId: orderId, // ← YE BHEJ DIYA
              description: `Payment for Order #${orderId.slice(-6).toUpperCase()}`,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (deductRes.data.success) {
            // Update local wallet
            const updatedUser = { ...user, wallet: deductRes.data.newBalance };
            setUser(updatedUser);
            await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));

            // Cart clear kar aur success
            await AsyncStorage.removeItem("cart");
            DeviceEventEmitter.emit("cartUpdated");
            setOrderSuccess(true);
          } else {
            Alert.alert("Payment Failed", "Order bana lekin wallet se paisa nahi cut hua");
          }
        } catch (err) {
          console.log("Wallet cart order error:", err.response?.data || err);
          Alert.alert("Error", err.response?.data?.message || "Wallet payment failed");
        }

        setPlacingOrder(false);
        return;
      }

      // COD ORDER (NO CHANGE)
      const orderData = {
        items: cart.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.currentPrice,
          quantity: item.quantity || 1,
          image: Array.isArray(item.image) ? item.image[0] : item.image || "",
          selectedSize: item.selectedSize || null,
        })),
        totalAmount,
        paymentMethod: "COD",
        shippingAddress: "Home Delivery",
      };

      const res = await axios.post(PLACE_ORDER_API, orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.success) {
        await AsyncStorage.removeItem("cart");
        DeviceEventEmitter.emit("cartUpdated");
        setOrderSuccess(true);
      } else {
        Alert.alert("Order Failed", res.data.message || "Order nahi hua");
      }
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Network ya server issue hai");
    } finally {
      setPlacingOrder(false);
    }
  };

  // SUCCESS SCREEN (NO CHANGE)
  if (orderSuccess) {
    return (
      <View style={styles.successContainer}>
        <StatusBar backgroundColor="#fff" barStyle="dark-content" />
        <View style={styles.successContent}>
          <Ionicons name="checkmark-circle" size={140} color="#4CAF50" />
          <Text style={styles.successTitle}>Order Placed Successfully!</Text>
          <Text style={styles.successMsg}>
            {selectedPayment === "WALLET"
              ? `Paid with Wallet • ₹${totalAmount} deducted`
              : "Cash on Delivery order confirmed!"}
          </Text>
          <TouchableOpacity style={styles.successBtn} onPress={() => router.push("/products/OrderScreen")}>
            <Text style={styles.successBtnText}>View Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.successBtn2} onPress={() => router.replace("/drawer/homeScreen")}>
            <Text style={styles.successBtn2Text}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  if (cart.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={100} color="#ddd" />
        <Text style={styles.emptyText}>Cart empty hai bhai!</Text>
        <TouchableOpacity style={styles.shopBtn} onPress={() => router.replace("/(tabs)/home")}>
          <Text style={styles.shopBtnText}>Shopping Karo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        {cart.map((item) => (
          <View key={item._id} style={styles.cartItem}>
            <Image source={{ uri: getImageUrl(item.image) }} style={styles.cartImg} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.currentPrice}</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity onPress={() => updateQuantity(item._id, -1)} style={styles.qtyBtn}>
                  <Ionicons name="remove" size={20} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity || 1}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item._id, 1)} style={styles.qtyBtn}>
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item._id)}>
                <Ionicons name="trash-outline" size={26} color="#ff3b30" />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Price Summary */}
        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>Order Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal ({cart.length} items)</Text>
            <Text style={styles.value}>₹{getTotalPrice()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Delivery</Text>
            <Text style={styles.value}>₹50</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>₹{totalAmount}</Text>
          </View>

          {user?.wallet > 0 && (
            <View style={styles.walletInfo}>
              <Ionicons name="wallet" size={20} color="#ff6b6b" />
              <Text style={styles.walletText}>Wallet: ₹{user.wallet} available</Text>
            </View>
          )}
        </View>

        {/* PAYMENT METHODS */}
        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Select Payment Method</Text>

          {/* PAY WITH WALLET */}
          {user?.wallet >= totalAmount && (
            <TouchableOpacity
              style={[styles.paymentOption, selectedPayment === "WALLET" && styles.selectedPayment]}
              onPress={() => setSelectedPayment("WALLET")}
            >
              <Ionicons name="wallet" size={28} color="#ff6b6b" />
              <Text style={styles.paymentName}>Pay with Wallet (₹{user.wallet})</Text>
              {selectedPayment === "WALLET" && <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />}
            </TouchableOpacity>
          )}

          {/* CARD - COMING SOON */}
          <TouchableOpacity style={styles.paymentOption} activeOpacity={0.8} disabled>
            <Ionicons name="card-outline" size={28} color="#999" />
            <View style={styles.paymentText}>
              <Text style={styles.paymentName}>Credit/Debit Card</Text>
              <Text style={styles.comingSoon}>Coming Soon</Text>
            </View>
          </TouchableOpacity>

          {/* UPI - COMING SOON */}
          <TouchableOpacity style={styles.paymentOption} activeOpacity={0.8} disabled>
            <Ionicons name="qr-code-outline" size={28} color="#999" />
            <View style={styles.paymentText}>
              <Text style={styles.paymentName}>UPI Payment</Text>
              <Text style={styles.comingSoon}>Coming Soon</Text>
            </View>
          </TouchableOpacity>

          {/* CASH ON DELIVERY */}
          <TouchableOpacity
            style={[styles.paymentOption, selectedPayment === "COD" && styles.selectedPayment]}
            onPress={() => setSelectedPayment("COD")}
          >
            <Ionicons name="cash-outline" size={28} color="#4CAF50" />
            <Text style={styles.paymentName}>Cash on Delivery</Text>
            {selectedPayment === "COD" && <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />}
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <Text style={styles.finalTotal}>Total: ₹{totalAmount}</Text>
        <TouchableOpacity
          style={[styles.placeOrderBtn, placingOrder && { opacity: 0.7 }]}
          onPress={placeOrder}
          disabled={placingOrder}
        >
          <Text style={styles.placeOrderText}>
            {placingOrder
              ? "Processing..."
              : selectedPayment === "WALLET"
              ? "Pay with Wallet"
              : "Place Order (COD)"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 15, fontSize: 16, color: "#ff6b6b", fontWeight: "600" },
  cartItem: { flexDirection: "row", backgroundColor: "#fff", marginHorizontal: 16, marginVertical: 6, borderRadius: 16, padding: 16, elevation: 5 },
  cartImg: { width: 90, height: 90, borderRadius: 12 },
  itemInfo: { flex: 1, marginLeft: 16 },
  itemName: { fontSize: 16, fontWeight: "600", color: "#222" },
  itemPrice: { fontSize: 18, fontWeight: "bold", color: "#ff6b6b", marginTop: 4 },
  qtyRow: { flexDirection: "row", alignItems: "center", marginTop: 10 },
  qtyBtn: { backgroundColor: "#ff6b6b", width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  qtyText: { marginHorizontal: 16, fontSize: 16, fontWeight: "bold", width: 30, textAlign: "center" },
  priceCard: { backgroundColor: "#fff", margin: 16, borderRadius: 16, padding: 20, elevation: 6 },
  priceTitle: { fontSize: 19, fontWeight: "bold", marginBottom: 12, color: "#333" },
  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
  label: { fontSize: 16, color: "#555" },
  value: { fontSize: 16, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 12 },
  totalLabel: { fontSize: 20, fontWeight: "bold" },
  totalValue: { fontSize: 22, fontWeight: "bold", color: "#ff6b6b" },
  walletInfo: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  walletText: { marginLeft: 8, fontSize: 16, color: "#ff6b6b", fontWeight: "600" },
  paymentSection: { marginHorizontal: 16, marginTop: 10 },
  sectionTitle: { fontSize: 19, fontWeight: "bold", marginBottom: 16, color: "#222" },
  paymentOption: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 18, borderRadius: 16, marginBottom: 12, elevation: 4 },
  paymentName: { fontSize: 17, fontWeight: "600", color: "#333", marginLeft: 16, flex: 1 },
  paymentText: { flex: 1, marginLeft: 16 },
  comingSoon: { fontSize: 13, color: "#999", marginTop: 4 },
  selectedPayment: { borderColor: "#4CAF50", borderWidth: 2 },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", padding: 20, borderTopWidth: 1, borderTopColor: "#eee", elevation: 20 },
  finalTotal: { fontSize: 22, fontWeight: "bold", textAlign: "center", color: "#ff6b6b", marginBottom: 10 },
  placeOrderBtn: { backgroundColor: "#ff6b6b", padding: 18, borderRadius: 16, alignItems: "center" },
  placeOrderText: { color: "#fff", fontSize: 19, fontWeight: "bold" },
  successContainer: { flex: 1, backgroundColor: "#fff" },
  successContent: { flex: 1, justifyContent: "center", alignItems: "center", padding: 30 },
  successTitle: { fontSize: 30, fontWeight: "bold", marginTop: 20, color: "#222" },
  successMsg: { fontSize: 18, color: "#666", textAlign: "center", marginTop: 16, lineHeight: 28 },
  successBtn: { backgroundColor: "#ff6b6b", padding: 18, borderRadius: 16, width: "100%", alignItems: "center", marginTop: 40 },
  successBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  successBtn2: { backgroundColor: "#f0f0f0", padding: 16, borderRadius: 16, width: "100%", alignItems: "center", marginTop: 12 },
  successBtn2Text: { color: "#333", fontSize: 17, fontWeight: "600" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  emptyText: { fontSize: 20, color: "#999", marginTop: 20, fontWeight: "600" },
  shopBtn: { marginTop: 20, backgroundColor: "#ff6b6b", paddingHorizontal: 40, paddingVertical: 16, borderRadius: 30 },
  shopBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});