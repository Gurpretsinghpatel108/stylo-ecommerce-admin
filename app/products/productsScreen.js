
// app/products/ProductsScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  DeviceEventEmitter,
  ScrollView,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import HeaderMain from "../../components/HeaderMain";
import { GET_ALL_PRODUCTS_API, getImageUrl } from "../services/api";
import axios from "axios";

const { width } = Dimensions.get("window");
const PRODUCT_CARD_SIZE = (width - 40) / 2;

export default function ProductsScreen() {
  const { categoryId, categoryName, subcategoryId, subcategoryName } = useLocalSearchParams();
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSub, setSelectedSub] = useState("All");
  const [favorites, setFavorites] = useState({});
  const [quantities, setQuantities] = useState({});
  const [uniqueSubcategories, setUniqueSubcategories] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartLoaded, setCartLoaded] = useState(false);
  const [cartBtnLoading, setCartBtnLoading] = useState(false);

  // Load Cart Count
  const loadCartCount = async () => {
    try {
      const raw = await AsyncStorage.getItem("cart");
      const data = raw ? JSON.parse(raw) : [];
      const total = data.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(total);

      const qtyMap = {};
      data.forEach((item) => { if (item._id) qtyMap[item._id] = item.quantity || 0; });
      setQuantities(qtyMap);
    } catch (e) { console.log("Error loading cart:", e); }
    finally { setCartLoaded(true); }
  };

  // Load Wishlist
  const loadWishlist = async () => {
    try {
      const raw = await AsyncStorage.getItem("wishlist");
      const wishlist = raw ? JSON.parse(raw) : [];
      const favMap = {};
      wishlist.forEach((item) => { if (item._id) favMap[item._id] = true; });
      setFavorites(favMap);
    } catch (err) { console.log("Error loading wishlist:", err); }
  };

  // Fetch Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(GET_ALL_PRODUCTS_API);
      let allProducts = res.data.data || [];

      // Filter by category/subcategory
      if (categoryId) allProducts = allProducts.filter((p) => String(p.categoryId?._id) === String(categoryId));
      if (subcategoryId) allProducts = allProducts.filter((p) => String(p.subcategoryId?._id) === String(subcategoryId));

      setProducts(allProducts);
      setFilteredProducts(allProducts);

      // Unique subcategories
      const subs = ["All"];
      allProducts.forEach(p => {
        if (p.subcategoryId && p.subcategoryId.name && !subs.includes(p.subcategoryId.name)) {
          subs.push(p.subcategoryId.name);
        }
      });
      setUniqueSubcategories(subs);

      // Set selected subcategory from URL
      if (subcategoryName && subs.includes(subcategoryName)) {
        setSelectedSub(subcategoryName);
        setFilteredProducts(allProducts.filter(p => p.subcategoryId?.name === subcategoryName));
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      Alert.alert("Error", "Products load nahi hue!");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchProducts();
    loadWishlist();
    loadCartCount();

    const cartSub = DeviceEventEmitter.addListener("cartUpdated", loadCartCount);
    const wishSub = DeviceEventEmitter.addListener("wishlistUpdated", loadWishlist);
    return () => { cartSub.remove(); wishSub.remove(); };
  }, [categoryId, subcategoryId]);

  const handleSubFilter = (filter) => {
    setSelectedSub(filter);
    if (filter === "All") setFilteredProducts(products);
    else setFilteredProducts(products.filter((p) => p.subcategoryId?.name === filter));
  };

  const toggleFavorite = async (product) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Login Required", "Wishlist ke liye login karo!", [
        { text: "Cancel" },
        { text: "Login", onPress: () => router.push("/auth/loginScreen") },
      ]);
      return;
    }

    try {
      const raw = await AsyncStorage.getItem("wishlist");
      let wishlist = raw ? JSON.parse(raw) : [];
      const isFav = favorites[product._id];
      if (isFav) wishlist = wishlist.filter((i) => i._id !== product._id);
      else wishlist.push(product);

      await AsyncStorage.setItem("wishlist", JSON.stringify(wishlist));
      setFavorites(prev => ({ ...prev, [product._id]: !isFav }));
      DeviceEventEmitter.emit("wishlistUpdated");
    } catch (err) { console.log(err); }
  };

  const updateCart = async (product, qty) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
      Alert.alert("Login Required", "Cart mein daalne ke liye login karo!", [
        { text: "Cancel" },
        { text: "Login", onPress: () => router.push("/auth/loginScreen") },
      ]);
      return;
    }

    try {
      const raw = await AsyncStorage.getItem("cart");
      let cart = raw ? JSON.parse(raw) : [];

      if (qty === 0) cart = cart.filter(i => i._id !== product._id);
      else {
        const index = cart.findIndex(i => i._id === product._id);
        if (index !== -1) cart[index].quantity = qty;
        else cart.push({ ...product, quantity: qty });
      }

      await AsyncStorage.setItem("cart", JSON.stringify(cart));
      DeviceEventEmitter.emit("cartUpdated");
      setQuantities(prev => ({ ...prev, [product._id]: qty }));
    } catch (e) { console.log(e); }
  };

  const increaseQty = (id) => {
    const current = quantities[id] || 0;
    const product = products.find(p => p._id === id);
    if (product) updateCart(product, current + 1);
  };

  const decreaseQty = (id) => {
    const current = quantities[id] || 0;
    if (current > 0) {
      const product = products.find(p => p._id === id);
      if (product) updateCart(product, current - 1);
    }
  };

  const handleGoToCart = () => {
    setCartBtnLoading(true);
    setTimeout(() => {
      setCartBtnLoading(false);
      router.push("/products/CartScreen");
    }, 600);
  };

  const renderProduct = (item, index) => {
    const qty = quantities[item._id] || 0;
    const isInCart = qty > 0;

    return (
      <TouchableOpacity
        key={item._id || index}
        onPress={() => router.push(`/products/productDetails?productId=${item._id}`)}
        activeOpacity={0.9}
      >
        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: getImageUrl(item.image) }}
              style={styles.image}
              resizeMode="cover"
            />
            <TouchableOpacity
              style={styles.heartContainer}
              onPress={(e) => { e.stopPropagation(); toggleFavorite(item); }}
            >
              <Ionicons
                name={favorites[item._id] ? "heart" : "heart-outline"}
                size={24}
                color={favorites[item._id] ? "#e74c3c" : "#fff"}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
            <Text style={styles.price}>₹{item.currentPrice}</Text>

            <View style={styles.priceRow}>
              <View style={styles.qtyControl}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => decreaseQty(item._id)}>
                  <Text style={{ fontSize: 18, color: qty === 0 ? "#ccc" : "#ff6b6b", fontWeight: "bold" }}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyText}>{qty}</Text>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => increaseQty(item._id)}>
                  <Text style={{ fontSize: 18, color: "#27ae60", fontWeight: "bold" }}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {isInCart ? (
              <TouchableOpacity style={[styles.addBtn, styles.goToCartBtn]} onPress={handleGoToCart}>
                {cartBtnLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.addBtnText}>Go to Cart</Text>}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.addBtn, styles.addToCartBtn]} onPress={() => increaseQty(item._id)}>
                <Text style={styles.addBtnText}>Add to Cart</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading || !cartLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={{ marginTop: 10, color: "#666" }}>Products load ho rahe hain...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <HeaderMain
        cartCount={cartCount}
        title={categoryName || subcategoryName || "Products"}
        onBack={() => router.back()}
        onCartPress={handleGoToCart}
      />

      {uniqueSubcategories.length > 1 && (
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
            {uniqueSubcategories.map((item) => (
              <TouchableOpacity
                key={item || Math.random()}
                onPress={() => handleSubFilter(item)}
                style={[styles.filterBtn, selectedSub === item && styles.activeBtn]}
              >
                <Text style={[styles.filterText, selectedSub === item && styles.activeText]}>{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.productGrid}>
          {filteredProducts.length === 0 ? (
            <Text style={{ textAlign: "center", marginTop: 50, fontSize: 16, color: "#999" }}>
              No products found in this category
            </Text>
          ) : (
            filteredProducts.map(renderProduct)
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  filterContainer: { paddingVertical: 12, backgroundColor: "#f9f9f9", borderBottomWidth: 1, borderColor: "#eee" },
  filterBtn: { paddingHorizontal: 20, paddingVertical: 10, marginHorizontal: 6, backgroundColor: "#eee", borderRadius: 30 },
  activeBtn: { backgroundColor: "#ff6b6b" },
  filterText: { fontWeight: "600", color: "#333" },
  activeText: { color: "#fff" },

  productGrid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", padding: 10 },
  card: { width: PRODUCT_CARD_SIZE, backgroundColor: "#fff", borderRadius: 16, marginBottom: 16, elevation: 6, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 8 },
  imageContainer: { position: "relative", height: PRODUCT_CARD_SIZE * 1.1 },
  image: { width: "100%", height: "100%", borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  heartContainer: { position: "absolute", top: 10, right: 10, backgroundColor: "rgba(0,0,0,0.4)", padding: 8, borderRadius: 30 },

  cardInfo: { padding: 12 },
  name: { fontSize: 14, fontWeight: "600", color: "#222", textAlign: "center", marginBottom: 6 },
  price: { fontSize: 18, fontWeight: "bold", color: "#ff6b6b", textAlign: "center", marginBottom: 10 },

  priceRow: { alignItems: "center", justifyContent: "center", marginVertical: 8 },
  qtyControl: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff0f0", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 30, borderWidth: 1, borderColor: "#ff6b6b30" },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, justifyContent: "center", alignItems: "center" },
  qtyText: { fontSize: 16, fontWeight: "bold", marginHorizontal: 16, minWidth: 24, textAlign: "center" },

  addBtn: { paddingVertical: 12, borderRadius: 30, alignItems: "center", marginTop: 10 },
  addToCartBtn: { backgroundColor: "#ff6b6b" },
  goToCartBtn: { backgroundColor: "#27ae60" },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 14 },

  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
});


