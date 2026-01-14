
// app/products/productDetails.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
  Share,
  DeviceEventEmitter,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { BASE_URL, getImageUrl } from "../services/api";  // ✅ Yeh import sabse important

const { width, height } = Dimensions.get("window");

export default function ProductDetails() {
  const { productId } = useLocalSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [isInCart, setIsInCart] = useState(false);
  const [checkingCart, setCheckingCart] = useState(false);

  // 🔹 GET AUTH TOKEN
  const getAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      console.log("🔑 Token:", token ? "Found ✅" : "Not Found ❌");
      return token;
    } catch (err) {
      console.log("❌ Token error:", err);
      return null;
    }
  };

  // 🔹 CHECK IF PRODUCT IS IN CART
  const checkIfInCart = async () => {
    if (!product) return;
    
    setCheckingCart(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        setIsInCart(false);
        return;
      }

      const response = await axios.get(`${BASE_URL}/api/cart`, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success && response.data.cart) {
        const cart = response.data.cart.items || [];
        const exists = cart.some(item => {
          const itemProdId = item.productId?._id || item.productId;
          const itemSize = item.selectedSize || "";
          const currentSize = selectedSize || "";
          
          return String(itemProdId) === String(product._id) && 
                 String(itemSize) === String(currentSize);
        });
        
        setIsInCart(exists);
      } else {
        setIsInCart(false);
      }
    } catch (error) {
      console.log("❌ Cart check error:", error.response?.data || error.message);
      if (error.response?.status === 401) {
        await AsyncStorage.removeItem("token");
      }
      setIsInCart(false);
    } finally {
      setCheckingCart(false);
    }
  };

  // 🔹 FETCH PRODUCT
  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/products/${productId}`);
      
      if (!res.data?.data) {
        throw new Error("Product not found");
      }

      const productData = res.data.data;
      const originalPrice = productData.discount
        ? Math.round(productData.currentPrice / (1 - productData.discount / 100))
        : productData.currentPrice;

      setProduct({ ...productData, originalPrice });

      // Wishlist check (local)
      const wishlistRaw = await AsyncStorage.getItem("wishlist");
      const wishlist = wishlistRaw ? JSON.parse(wishlistRaw) : [];
      setIsWishlisted(wishlist.some(i => i._id === productData._id));

    } catch (err) {
      console.log("❌ Product fetch error:", err.message);
      Alert.alert("Error", "Product load nahi hua!");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) fetchProduct();
  }, [productId]);

  useEffect(() => {
    if (product) checkIfInCart();
  }, [product, selectedSize]);

  // 🔹 ADD TO CART
  const handleAddToCart = async () => {
    if (product?.sizes?.length > 0 && !selectedSize) {
      Alert.alert("Size Chuno!", "Pehle size select kar bhai!");
      return;
    }

    try {
      const token = await getAuthToken();
      if (!token) {
        Alert.alert(
          "Login Required",
          "Cart me add karne ke liye login karo!",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Login", onPress: () => router.push("/auth/loginScreen") }
          ]
        );
        return;
      }

      const payload = {
        productId: product._id,
        name: product.name,
        price: product.currentPrice,
        quantity: quantity,
        image: product.image,
        selectedSize: selectedSize || null
      };

      const response = await axios.post(
        `${BASE_URL}/api/cart/add`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        DeviceEventEmitter.emit("cartUpdated");
        setIsInCart(true);
        setQuantity(1);

        Alert.alert(
          "Added to Cart! 🛒",
          `${quantity} × ${product.name}${selectedSize ? ` (Size: ${selectedSize})` : ""}`,
          [
            { text: "CONTINUE SHOPPING", style: "cancel" },
            { text: "GO TO CART", onPress: () => router.push("/products/CartScreen") }
          ]
        );
      }
    } catch (err) {
      console.log("Add to cart error:", err.response?.data || err.message);
      if (err.response?.status === 401) {
        Alert.alert("Session Expired", "Please login again!", [
          { text: "OK", onPress: async () => {
            await AsyncStorage.removeItem("token");
            router.push("/auth/loginScreen");
          }}
        ]);
      } else {
        Alert.alert("Error", err.response?.data?.message || "Add nahi ho paya");
      }
    }
  };

  // 🔹 TOGGLE WISHLIST (local)
  const toggleWishlist = async () => {
    try {
      const raw = await AsyncStorage.getItem("wishlist");
      let list = raw ? JSON.parse(raw) : [];
      
      if (isWishlisted) {
        list = list.filter(i => i._id !== product._id);
      } else {
        list.push(product);
      }
      
      await AsyncStorage.setItem("wishlist", JSON.stringify(list));
      setIsWishlisted(!isWishlisted);
      DeviceEventEmitter.emit("wishlistUpdated");
    } catch (err) {
      console.log("Wishlist error:", err);
    }
  };

  // 🔹 SHARE
  const shareProduct = async () => {
    try {
      await Share.share({
        message: `Dekh bhai mast product: ${product.name} - ₹${product.currentPrice}`,
      });
    } catch (err) {
      console.log("Share error:", err);
    }
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#ff6b6b" />
        <Text style={{ marginTop: 15, color: "#ff6b6b" }}>Loading...</Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.loader}>
        <Text>Product nahi mila</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* PRODUCT IMAGE */}
        <View style={{ position: "relative" }}>
          <Image 
            source={{ uri: getImageUrl(product.image) }} 
            style={styles.heroImage} 
            resizeMode="cover" 
          />
          <LinearGradient 
            colors={["rgba(0,0,0,0.5)", "transparent"]} 
            style={{ position: "absolute", top: 0, left: 0, right: 0, height: height * 0.4 }} 
          />
          <View style={styles.headerOverlay}>
            <TouchableOpacity onPress={() => router.back()} style={styles.iconCircle}>
              <Ionicons name="arrow-back" size={26} color="#fff" />
            </TouchableOpacity>
            <View style={{ flexDirection: "row", gap: 12 }}>
              <TouchableOpacity onPress={shareProduct} style={styles.iconCircle}>
                <Ionicons name="share-social" size={24} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleWishlist} style={styles.iconCircle}>
                <FontAwesome 
                  name={isWishlisted ? "heart" : "heart-o"} 
                  size={24} 
                  color={isWishlisted ? "#ff6b6b" : "#fff"} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* PRODUCT INFO */}
        <View style={styles.infoCard}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.brand}>STYLO COLLECTION</Text>

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 12 }}>
            <Text style={styles.currentPrice}>₹{product.currentPrice}</Text>
            {product.discount > 0 && (
              <>
                <Text style={styles.originalPrice}>₹{product.originalPrice}</Text>
                <Text style={styles.discountTag}>{product.discount}% OFF</Text>
              </>
            )}
          </View>

          {/* SIZE */}
          {product.sizes?.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={styles.sectionTitle}>Select Size</Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 10 }}>
                {product.sizes.map(size => (
                  <TouchableOpacity
                    key={size}
                    style={[styles.sizeBox, selectedSize === size && styles.sizeSelected]}
                    onPress={() => setSelectedSize(size)}
                  >
                    <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextSelected]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* QUANTITY */}
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.qtyControl}>
              <TouchableOpacity onPress={() => setQuantity(q => q > 1 ? q - 1 : 1)}>
                <Ionicons name="remove" size={28} color={quantity === 1 ? "#ccc" : "#ff6b6b"} />
              </TouchableOpacity>
              <Text style={{ fontSize: 24, fontWeight: "bold", color: "#ff6b6b", marginHorizontal: 24 }}>
                {quantity}
              </Text>
              <TouchableOpacity onPress={() => setQuantity(q => q + 1)}>
                <Ionicons name="add" size={28} color="#ff6b6b" />
              </TouchableOpacity>
            </View>
          </View>

          {/* DESCRIPTION */}
          <View style={{ marginTop: 20 }}>
            <Text style={styles.sectionTitle}>Product Details</Text>
            <Text style={{ color: "#555", lineHeight: 24 }} numberOfLines={showFullDesc ? undefined : 4}>
              {product.description || "No description available"}
            </Text>
            <TouchableOpacity onPress={() => setShowFullDesc(!showFullDesc)}>
              <Text style={{ color: "#ff6b6b", fontWeight: "bold", marginTop: 8 }}>
                {showFullDesc ? "Show Less" : "Read More"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <LinearGradient colors={["#ff6b6b", "#ff8e8e"]} style={styles.bottomBar}>
        <View style={{ flexDirection: "row", flex: 1 }}>
          <TouchableOpacity
            style={[styles.bottomBtn, isInCart && { backgroundColor: "#27ae60" }]}
            onPress={() => isInCart ? router.push("/products/CartScreen") : handleAddToCart()}
            disabled={checkingCart}
          >
            {checkingCart ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.bottomBtnText}>
                {isInCart ? "GO TO CART" : "ADD TO BAG"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.bottomBtn, { backgroundColor: "#ff9f1c" }]}
            onPress={() => {
              if (product?.sizes?.length > 0 && !selectedSize) {
                Alert.alert("Select Size", "Pehle size chuno!");
                return;
              }

              router.push({
                pathname: "/products/CheckoutScreen",
                params: {
                  productId: String(product._id),
                  selectedSize: selectedSize ? String(selectedSize) : "N/A",
                  quantity: String(quantity)
                }
              });
            }}
          >
            <Text style={styles.bottomBtnText}>BUY NOW</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  heroImage: { width: "100%", height: height * 0.5 },
  headerOverlay: { 
    position: "absolute", 
    top: StatusBar.currentHeight + 10 || 40, 
    left: 16, 
    right: 16, 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center" 
  },
  iconCircle: { backgroundColor: "rgba(0,0,0,0.4)", padding: 12, borderRadius: 30 },
  infoCard: { 
    backgroundColor: "#fff", 
    marginTop: -50, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    padding: 20, 
    paddingBottom: 100, 
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: -5 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 10, 
    elevation: 15 
  },
  productName: { fontSize: 26, fontWeight: "800", color: "#222" },
  brand: { fontSize: 15, color: "#ff6b6b", fontWeight: "600", marginTop: 6 },
  currentPrice: { fontSize: 28, fontWeight: "bold", color: "#222" },
  originalPrice: { 
    fontSize: 18, 
    color: "#999", 
    textDecorationLine: "line-through", 
    marginHorizontal: 10 
  },
  discountTag: { 
    color: "#ff3b30", 
    fontWeight: "bold", 
    backgroundColor: "#ffebee", 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    borderRadius: 4 
  },
  sectionTitle: { fontSize: 17, fontWeight: "bold", color: "#222", marginBottom: 10 },
  sizeBox: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    backgroundColor: "#fff0f0", 
    justifyContent: "center", 
    alignItems: "center", 
    borderWidth: 2, 
    borderColor: "#ffc0c0" 
  },
  sizeSelected: { backgroundColor: "#ff6b6b", borderColor: "#ff3b30" },
  sizeText: { fontWeight: "bold", color: "#ff6b6b", fontSize: 16 },
  sizeTextSelected: { color: "#fff" },
  qtyControl: { 
    flexDirection: "row", 
    alignItems: "center", 
    backgroundColor: "#fff0f0", 
    padding: 12, 
    borderRadius: 30, 
    width: 160, 
    justifyContent: "space-between" 
  },
  bottomBar: { 
    position: "absolute", 
    bottom: 0, 
    left: 0, 
    right: 0, 
    padding: 12, 
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24, 
    elevation: 20 
  },
  bottomBtn: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    paddingVertical: 18, 
    marginHorizontal: 6, 
    borderRadius: 12, 
    backgroundColor: "rgba(255,255,255,0.2)" 
  },
  bottomBtnText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16, 
    letterSpacing: 0.5 
  },
  loader: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center", 
    backgroundColor: "#fff" 
  },
});