





// app/products/MembershipCardsScreen.js   ← FINAL PRODUCTION VERSION (CLEAN & OPTIMIZED)

import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function MembershipCardsScreen() {
  const router = useRouter();

  // Constants (easy to change later)
  const SUPPORT_PHONE = "8839536965";
  const SUPPORT_EMAIL = "shreegaurijewellers88@gmail.com";

  const handleBuyNow = () => {
    router.push("/products/MembershipBuyScreen");
  };

  const handleCall = () => {
    Linking.openURL(`tel:${SUPPORT_PHONE}`).catch(() => {
      Alert.alert("Unable to Call", `Please dial manually: ${SUPPORT_PHONE}`);
    });
  };

  const handleMail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}?subject=Membership Card Query`).catch(() => {
      Alert.alert("Email Not Found", `Please email us at ${SUPPORT_EMAIL}`);
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <LinearGradient
        colors={["#ff6b6b", "#ff8e8e"]}
        style={styles.header}
      >
        <Text style={styles.heading}>
          SHREE GAURI JEWELLERS{"\n"}MEMBERSHIP CARD
        </Text>
      </LinearGradient>

      {/* Card */}
      <View style={styles.card}>
        <Image
          source={require("../../assets/images/membershipcard.png")}
          style={styles.cardImage}
          resizeMode="contain"
          accessible={true}
          accessibilityLabel="Membership Card Preview"
        />

        {/* Badge */}
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Refundable + EMI</Text>
        </View>

        <Text style={styles.price}>₹2599</Text>

        {/* Buy Now Button */}
        <LinearGradient
          colors={["#ff6b6b", "#ff8e8e"]}
          style={styles.buyBtn}
        >
          <TouchableOpacity
            onPress={handleBuyNow}
            style={styles.btnTouchable}
            activeOpacity={0.85}
            accessibilityLabel="Buy Membership Card Now"
          >
            <Text style={styles.btnText}>Buy Now</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>

      {/* Description */}
      <View style={styles.description}>
        <Text style={styles.descText}>
          If you buy our membership card the ₹2599 amount will be refunded on
          your first purchase and if you visit our shop, you will get the
          benefit of EMI facility. Buying jewellery will become easier.
        </Text>

        <TouchableOpacity
          onPress={handleCall}
          style={styles.contactRow}
          activeOpacity={0.7}
        >
          <Ionicons name="call-outline" size={18} color="#ff4d6d" />
          <Text style={styles.contact}> {SUPPORT_PHONE}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleMail}
          style={styles.contactRow}
          activeOpacity={0.7}
        >
          <Ionicons name="mail-outline" size={18} color="#ff4d6d" />
          <Text style={styles.contact}> {SUPPORT_EMAIL}</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          Whenever you visit the shop, bring your card with you.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f8f8" },
  header: {
    paddingVertical: 35,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    lineHeight: 28,
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 16,
    alignItems: "center",
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  cardImage: {
    width: "100%",
    height: 220,
    borderRadius: 20,
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#ff6b6b",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ff4d6d",
    marginVertical: 16,
  },
  buyBtn: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  btnTouchable: {
    flex: 1,
    alignItems: "center",
  },
  btnText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 18 
  },
  description: {
    marginHorizontal: 16,
    marginTop: 25,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  descText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
    marginBottom: 16,
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  contact: {
    fontSize: 15,
    color: "#ff4d6d",
    textDecorationLine: "underline",
    marginLeft: 8,
  },
  note: {
    fontSize: 14,
    color: "#555",
    fontStyle: "italic",
    marginTop: 12,
  },
});