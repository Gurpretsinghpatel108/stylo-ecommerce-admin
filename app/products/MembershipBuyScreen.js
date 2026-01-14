




// app/products/MembershipBuyScreen.js   ← FINAL PRODUCTION VERSION (REAL API CALL + VALIDATION)

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { BASE_URL } from "../services/api";  // ← Dynamic production URL (api.js se)

export default function MembershipBuyScreen() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const MEMBERSHIP_API = `${BASE_URL}/api/membership/request`;  // ← Backend route (agar nahi hai to bana le)

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      return Alert.alert("Error", "Full Name daal bhai 😅");
    }
    if (!phone.trim() || phone.length !== 10 || !/^\d{10}$/.test(phone)) {
      return Alert.alert("Error", "Valid 10-digit Mobile Number daal do");
    }
    if (email.trim() && !/\S+@\S+\.\S+/.test(email)) {
      return Alert.alert("Error", "Email galat lag rha hai");
    }

    setLoading(true);

    try {
      const token = await AsyncStorage.getItem("token");
      const userData = await AsyncStorage.getItem("userData");
      const user = userData ? JSON.parse(userData) : null;

      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || null,
        userId: user?._id || null,  // Agar logged in hai to link kar denge
        membershipFee: 2599,
      };

      const res = await axios.post(MEMBERSHIP_API, payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        timeout: 15000,
      });

      if (res.data.success) {
        Alert.alert(
          "Success 🎉",
          "Membership request submit ho gaya!\nTeam jaldi contact karegi bhai.",
          [{ text: "OK", onPress: () => {
            setName("");
            setPhone("");
            setEmail("");
          }}]
        );
      } else {
        Alert.alert("Failed", res.data.message || "Kuch gadbad hai");
      }
    } catch (err) {
      console.log("Membership error:", err.response?.data || err.message);
      Alert.alert(
        "Error",
        err.response?.data?.message || "Network ya server issue hai bhai"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      {/* Header */}
      <LinearGradient colors={["#ff6b6b", "#ff8e8e"]} style={styles.header}>
        <Text style={styles.headerText}>Membership Details</Text>
      </LinearGradient>

      {/* Membership Info */}
      <View style={styles.card}>
        <Text style={styles.title}>Shree Gauri Jewellers Membership Card</Text>
        <Text style={styles.price}>₹2599</Text>

        <Text style={styles.benefit}>✔ ₹2599 adjusted on first purchase</Text>
        <Text style={styles.benefit}>✔ EMI Facility available</Text>
        <Text style={styles.benefit}>✔ Easier jewellery buying</Text>
        <Text style={styles.benefit}>✔ Priority support & offers</Text>
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.formTitle}>Enter Your Details</Text>

        <TextInput
          placeholder="Full Name *"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <TextInput
          placeholder="Mobile Number *"
          keyboardType="phone-pad"
          maxLength={10}
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
        />

        <TextInput
          placeholder="Email (optional)"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.disabledBtn]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit Membership Request</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.footerNote}>
        Note: Team will contact you within 24 hours. Thank you for choosing Gauri Jewellers! ❤️
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 40,
    alignItems: "center",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerText: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
  },
  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ff4d6d",
    marginVertical: 8,
  },
  benefit: {
    fontSize: 15,
    color: "#555",
    marginTop: 6,
  },
  form: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    padding: 20,
    borderRadius: 16,
    elevation: 5,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  submitBtn: {
    backgroundColor: "#ff6b6b",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  disabledBtn: {
    opacity: 0.6,
  },
  submitText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  footerNote: {
    textAlign: "center",
    margin: 30,
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
});