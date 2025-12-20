// app/products/wishlistScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { DeviceEventEmitter } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SERVER_URL = "http://10.23.168.194:5000";

const getImageUri = (image) => {
  if (!image) return "https://via.placeholder.com/80";
  let filename = Array.isArray(image) ? image[0] : image;
  if (filename.startsWith("http")) return filename;
  return `${SERVER_URL}/uploads/${filename}`;
};

export default function WishlistScreen() {
  const router = useRouter();
  const [wishlist, setWishlist] = useState([]);

  const loadWishlist = async () => {
    try {
      const raw = await AsyncStorage.getItem("wishlist");
      const items = raw ? JSON.parse(raw) : [];
      setWishlist(items);
    } catch (e) {
      console.log("Load wishlist error:", e);
    }
  };

  useEffect(() => {
    loadWishlist();
    const sub = DeviceEventEmitter.addListener("wishlistUpdated", loadWishlist);
    return () => sub.remove();
  }, []);

  const removeFromWishlist = async (id, scaleAnim) => {
    // Animation: Item chhota ho ke gayab
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(async () => {
      const updated = wishlist.filter((i) => i._id !== id);
      await AsyncStorage.setItem("wishlist", JSON.stringify(updated));
      DeviceEventEmitter.emit("wishlistUpdated");
      Alert.alert("❤️ Removed!", "Dil se nikaal diya bhai!", [{ text: "OK" }]);
    });
  };

  const renderItem = ({ item }) => {
    const scaleAnim = new Animated.Value(1);

    return (
      <Animated.View style={[styles.itemContainer, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push(`/products/productDetails?productId=${item._id}`)}
          style={styles.touchArea}
        >
          <Image source={{ uri: getImageUri(item.image) }} style={styles.img} resizeMode="cover" />

          <View style={styles.info}>
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{item.currentPrice}</Text>
              {item.discount > 0 && (
                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>{item.discount}% OFF</Text>
                </View>
              )}
            </View>
          </View>

          <TouchableOpacity
            onPress={() => removeFromWishlist(item._id, scaleAnim)}
            style={styles.removeBtn}
          >
            <Ionicons name="heart" size={28} color="#ff6b6b" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (wishlist.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Animated.View style={styles.heartPulse}>
          <Ionicons name="heart-outline" size={100} color="#ff6b6b" />
        </Animated.View>
        <Text style={styles.emptyTitle}>Wishlist Khali Hai</Text>
        <Text style={styles.emptySubtitle}>Jo dil ko bhaaye, yahan daal do</Text>
        <TouchableOpacity
          style={styles.shopBtn}
          onPress={() => router.replace("/drawer/homeScreen")}
        >
          <Text style={styles.shopBtnText}>Shopping Shuru Karo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={wishlist}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fffaf8" },
  list: { padding: 16, paddingTop: 20 },
  itemContainer: {
    marginBottom: 18,
    borderRadius: 22,
    backgroundColor: "#fff",
    elevation: 8,
    shadowColor: "#ff6b6b",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    overflow: "hidden",
  },
  touchArea: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
  },
  img: {
    width: 100,
    height: 100,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
  },
  info: { flex: 1, marginLeft: 16 },
  name: { fontSize: 17, fontWeight: "700", color: "#333" },
  priceRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  price: { fontSize: 20, fontWeight: "bold", color: "#ff3b30" },
  discountBadge: {
    backgroundColor: "#ff3b30",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginLeft: 12,
  },
  discountText: { color: "#fff", fontWeight: "bold", fontSize: 12 },
  removeBtn: {
    backgroundColor: "#ffebee",
    padding: 12,
    borderRadius: 30,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fffaf8",
    padding: 20,
  },
  heartPulse: {
    animation: "pulse 2s infinite",
  },
  emptyTitle: { fontSize: 26, fontWeight: "bold", color: "#ff3b30", marginTop: 20 },
  emptySubtitle: { fontSize: 16, color: "#ff6b6b", marginTop: 8 },
  shopBtn: {
    marginTop: 30,
    backgroundColor: "#ff3b30",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 30,
    elevation: 10,
  },
  shopBtnText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
});