

// app/products/EditProfileScreen.js   ← FINAL PRODUCTION VERSION (DYNAMIC URL FROM API.JS)

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import axios from "axios";

import { BASE_URL } from "../services/api";  // ← Ye import kar liya (dynamic production URL)

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const saved = await AsyncStorage.getItem("userData");
      if (saved) {
        const user = JSON.parse(saved);
        setForm({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      }
    } catch (e) {
      console.log("Load profile error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      return Alert.alert("Error", "Name aur Email daal bhai!");
    }

    setUpdating(true);
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Login Required", "Profile update ke liye login karo pehle", [
          { text: "Cancel" },
          { text: "Login", onPress: () => router.push("/auth/loginScreen") },
        ]);
        return;
      }

      // PROFILE UPDATE ENDPOINT (dynamic BASE_URL se)
      const profileUrl = `${BASE_URL}/api/user/profile`;  // ← YE CHANGE KIA! Local IP hata diya

      const res = await axios.put(
        profileUrl,
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 15000,  // Optional: timeout add kiya
        }
      );

      if (res.data?.success) {
        // Update local user data
        const updatedUser = { ...JSON.parse(await AsyncStorage.getItem("userData")), ...res.data.user };
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));

        Alert.alert("Success", "Profile update ho gaya bhai!", [
          { text: "OK", onPress: () => router.back() },
        ]);
      } else {
        Alert.alert("Failed", res.data?.message || "Update nahi hua");
      }
    } catch (err) {
      console.log("Update error:", err.response?.data || err.message);
      Alert.alert(
        "Failed",
        err.response?.data?.message || "Network ya server issue hai bhai"
      );
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Edit Profile</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={form.name}
        onChangeText={(t) => setForm({ ...form, name: t })}
        placeholder="Your name"
      />

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={form.email}
        onChangeText={(t) => setForm({ ...form, email: t })}
        keyboardType="email-address"
        placeholder="Your email"
      />

      <Text style={styles.label}>Phone</Text>
      <TextInput
        style={styles.input}
        value={form.phone}
        onChangeText={(t) => setForm({ ...form, phone: t })}
        keyboardType="phone-pad"
        placeholder="Your phone number"
      />

      <TouchableOpacity
        style={[styles.saveBtn, updating && styles.disabledBtn]}
        onPress={handleUpdate}
        disabled={updating}
      >
        {updating ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveBtnText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  loaderContainer: {
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 30,
    color: "#222",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    color: "#333",
  },
  input: {
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#ff6b6b",
    marginTop: 50,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  disabledBtn: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});