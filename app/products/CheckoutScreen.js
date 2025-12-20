// app/products/CheckoutScreen.js   ← SABSE FINAL, UPDATED & PERFECT VERSION (ORDER ID LINKED)

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
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

import { GET_PRODUCT_API, PLACE_ORDER_API, getImageUrl } from "../services/api";

const AUTH_BASE_URL = "http://10.23.168.194:5001"; // TERA LAPTOP KA IP

export default function CheckoutScreen() {
  const { productId, selectedSize, quantity: qtyParam } = useLocalSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("COD");

  const quantity = parseInt(qtyParam) || 1;

  useEffect(() => {
    fetchProductAndUser();
  }, []);

  const fetchProductAndUser = async () => {
    try {
      setLoading(true);

      const prodRes = await axios.get(GET_PRODUCT_API(productId));
      if (prodRes.data?.data) setProduct(prodRes.data.data);

      const saved = await AsyncStorage.getItem("userData");
      if (saved) {
        const userData = JSON.parse(saved);
        setUser(userData);
      }
    } catch (err) {
      Alert.alert("Error", "Kuch gadbad hai bhai");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = product ? product.currentPrice * quantity + 50 : 0;

  const placeOrderNow = async () => {
    if (placingOrder) return;
    setPlacingOrder(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Login karo pehle!", "Order karne ke liye login zaroori hai", [
          { text: "Cancel" },
          { text: "Login", onPress: () => router.push("/auth/loginScreen") },
        ]);
        setPlacingOrder(false);
        return;
      }

      // WALLET PAYMENT - FIXED FLOW: PEHLE ORDER, PHIR DEDUCT
      if (selectedPayment === "WALLET") {
        if (!user || user.wallet < totalAmount) {
          Alert.alert("Arre bhai", "Wallet mein paisa kam hai!");
          setPlacingOrder(false);
          return;
        }

        try {
          // STEP 1: PEHLE ORDER PLACE KAR
          const orderRes = await axios.post(
            PLACE_ORDER_API,
            {
              items: [
                {
                  productId: product._id,
                  name: product.name,
                  price: product.currentPrice,
                  quantity,
                  image: Array.isArray(product.image) ? product.image[0] : product.image,
                  selectedSize: selectedSize === "N/A" ? null : selectedSize,
                },
              ],
              totalAmount,
              paymentMethod: "WALLET",
              shippingAddress: "Home Delivery",
            },
            { headers: { Authorization: `Bearer ${token}` }, timeout: 20000 }
          );

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
              orderId: orderId, // ← YE BHEJ DIYA, AB HISTORY MEIN LINK HOGA
              description: `Payment for Order #${orderId.slice(-6).toUpperCase()}`,
            },
            { headers: { Authorization: `Bearer ${token}` }, timeout: 20000 }
          );

          if (deductRes.data.success) {
            // Update local wallet balance
            const updatedUser = { ...user, wallet: deductRes.data.newBalance };
            setUser(updatedUser);
            await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));

            setOrderSuccess(true);
          } else {
            Alert.alert("Payment Failed", "Order bana lekin wallet se payment nahi hua");
          }
        } catch (err) {
          console.log("Wallet order error:", err.response?.data || err);
          Alert.alert("Error", err.response?.data?.message || "Wallet payment failed");
        }

        setPlacingOrder(false);
        return;
      }

      // COD ORDER (NO CHANGE)
      const codRes = await axios.post(
        PLACE_ORDER_API,
        {
          items: [
            {
              productId: product._id,
              name: product.name,
              price: product.currentPrice,
              quantity,
              image: Array.isArray(product.image) ? product.image[0] : product.image,
              selectedSize: selectedSize === "N/A" ? null : selectedSize,
            },
          ],
          totalAmount,
          paymentMethod: "COD",
          shippingAddress: "Home Delivery",
        },
        { headers: { Authorization: `Bearer ${token}` }, timeout: 20000 }
      );

      if (codRes.data.success) {
        setOrderSuccess(true);
      }
    } catch (err) {
      console.log("Error:", err.response?.data || err.message);
      Alert.alert("Failed", err.response?.data?.message || "Network/server issue hai bhai");
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
          <TouchableOpacity
            style={styles.successBtn}
            onPress={() => router.push("/products/OrderScreen")}
          >
            <Text style={styles.successBtnText}>View Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.successBtn2}
            onPress={() => router.replace("/drawer/homeScreen")}
          >
            <Text style={styles.successBtn2Text}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (loading || !product) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // UI REMAINS SAME (NO CHANGE NEEDED)
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.productCard}>
          <Image source={{ uri: getImageUrl(product.image) }} style={styles.productImg} />
          <Text style={styles.productName}>{product.name}</Text>
          {selectedSize && selectedSize !== "N/A" && (
            <Text style={styles.size}>Size: {selectedSize}</Text>
          )}
          <Text style={styles.price}>₹{product.currentPrice} × {quantity}</Text>
        </View>

        <View style={styles.priceCard}>
          <Text style={styles.priceTitle}>Order Summary</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>₹{product.currentPrice * quantity}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Delivery</Text>
            <Text style={styles.value}>₹50</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{totalAmount}</Text>
          </View>

          {user?.wallet > 0 && (
            <View style={styles.walletInfo}>
              <Ionicons name="wallet" size={22} color="#ff6b6b" />
              <Text style={styles.walletText}>Wallet Balance: ₹{user.wallet}</Text>
            </View>
          )}
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.sectionTitle}>Payment Method</Text>

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

      <View style={styles.bottomBar}>
        <Text style={styles.finalTotalText}>Total: ₹{totalAmount}</Text>
        <TouchableOpacity
          style={[styles.placeOrderBtn, placingOrder && { opacity: 0.7 }]}
          onPress={placeOrderNow}
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

// STYLES SAME RAHEGA (NO CHANGE)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  loadingText: { marginTop: 15, fontSize: 16, color: "#ff6b6b", fontWeight: "600" },
  productCard: { backgroundColor: "#fff", margin: 16, borderRadius: 20, padding: 20, alignItems: "center", elevation: 10 },
  productImg: { width: 260, height: 260, borderRadius: 20, marginBottom: 16 },
  productName: { fontSize: 23, fontWeight: "bold", textAlign: "center", color: "#222" },
  size: { fontSize: 17, color: "#555", marginVertical: 6 },
  price: { fontSize: 28, fontWeight: "bold", color: "#ff6b6b", marginVertical: 8 },
  priceCard: { backgroundColor: "#fff", marginHorizontal: 16, marginTop: 10, borderRadius: 16, padding: 18, elevation: 6 },
  priceTitle: { fontSize: 19, fontWeight: "bold", marginBottom: 12, color: "#333" },
  row: { flexDirection: "row", justifyContent: "space-between", marginVertical: 6 },
  label: { fontSize: 16, color: "#555" },
  value: { fontSize: 16, fontWeight: "600", color: "#222" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  totalLabel: { fontSize: 20, fontWeight: "bold", color: "#222" },
  totalValue: { fontSize: 22, fontWeight: "bold", color: "#ff6b6b" },
  walletInfo: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  walletText: { marginLeft: 8, fontSize: 16, color: "#ff6b6b", fontWeight: "600" },
  paymentSection: { marginHorizontal: 16, marginTop: 20 },
  sectionTitle: { fontSize: 19, fontWeight: "bold", marginBottom: 16, color: "#222" },
  paymentOption: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", padding: 18, borderRadius: 16, marginBottom: 12, elevation: 4 },
  paymentName: { fontSize: 17, fontWeight: "600", color: "#333", marginLeft: 16, flex: 1 },
  selectedPayment: { borderColor: "#4CAF50", borderWidth: 2 },
  bottomBar: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#fff", padding: 20, borderTopWidth: 1, borderTopColor: "#eee", elevation: 20 },
  finalTotalText: { fontSize: 22, fontWeight: "bold", color: "#ff6b6b", textAlign: "center", marginBottom: 10 },
  placeOrderBtn: { backgroundColor: "#ff6b6b", padding: 18, borderRadius: 16, alignItems: "center" },
  placeOrderText: { color: "#fff", fontSize: 19, fontWeight: "bold" },
  successContainer: { flex: 1, backgroundColor: "#fff" },
  successContent: { flex: 1, justifyContent: "center", alignItems: "center", padding: 30 },
  successTitle: { fontSize: 30, fontWeight: "bold", marginTop: 20, color: "#222" },
  successMsg: { fontSize: 18, color: "#666", textAlign: "center", marginTop: 16, lineHeight: 28 },
  successBtn: { backgroundColor: "#ff6b6b", padding: 18, borderRadius: 16, width: "100%", alignItems: "center", marginTop: 40 },
  successBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  successBtn2: { backgroundColor: "#f0f0f0f0", padding: 16, borderRadius: 16, width: "100%", alignItems: "center", marginTop: 12 },
  successBtn2Text: { color: "#333", fontSize: 17, fontWeight: "600" },
});