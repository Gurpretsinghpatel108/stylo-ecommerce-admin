// app/products/EditProfileScreen.js
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

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const saved = await AsyncStorage.getItem("userData");
    if (saved) {
      const user = JSON.parse(saved);
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!form.name.trim() || !form.email.trim()) {
      return Alert.alert("Error", "Name aur Email daal bhai!");
    }

    setUpdating(true);
    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.put(
        "http://10.23.168.194:5001/api/user/profile",   // SAHI ROUTE
        {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      await AsyncStorage.setItem("userData", JSON.stringify(res.data.user));
      Alert.alert("Success", "Profile update ho gaya bhai!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (err) {
      console.log("Update error:", err.response?.data);
      Alert.alert("Failed", "Kuch gadbad hai bhai");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
      <ActivityIndicator size="large" color="#ff6b6b" />
    </View>
  );

  return (
    <ScrollView style={{flex:1,backgroundColor:"#f8f8f8",padding:20}}>
      <Text style={{fontSize:28,fontWeight:"bold",textAlign:"center",marginVertical:30}}>
        Edit Profile
      </Text>

      <Text style={{fontSize:16,fontWeight:"600",marginTop:15}}>Name</Text>
      <TextInput style={styles.input} value={form.name} onChangeText={t=>setForm({...form,name:t})} />

      <Text style={{fontSize:16,fontWeight:"600",marginTop:15}}>Email</Text>
      <TextInput style={styles.input} value={form.email} onChangeText={t=>setForm({...form,email:t})} keyboardType="email-address" />

      <Text style={{fontSize:16,fontWeight:"600",marginTop:15}}>Phone</Text>
      <TextInput style={styles.input} value={form.phone} onChangeText={t=>setForm({...form,phone:t})} keyboardType="phone-pad" />

      <TouchableOpacity
        style={{backgroundColor:"#ff6b6b",marginTop:50,padding:18,borderRadius:12,alignItems:"center"}}
        onPress={handleUpdate}
        disabled={updating}
      >
        {updating ? <ActivityIndicator color="#fff"/> : <Text style={{color:"#fff",fontSize:18,fontWeight:"bold"}}>Save Changes</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1.5,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    backgroundColor: "#fff",
    fontSize: 16,
  },
});