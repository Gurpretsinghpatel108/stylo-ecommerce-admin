// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
// import axios from "axios";
// import io from "socket.io-client";

// const SERVER_URL = "http://192.168.29.72:5000";
// const { width } = Dimensions.get("window");

// export default function ProductListScreen() {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get(`${SERVER_URL}/api/products`);
//       setProducts(res.data.data || []);
//     } catch (err) {
//       console.error("Error fetching products:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchProducts();

//     // 👇 Socket connection for real-time updates
//     const socket = io(SERVER_URL);

//     socket.on("connect", () => {
//       console.log("Socket connected:", socket.id);
//     });

//     // 🔄 When a product is added or updated
//     socket.on("productUpdated", (updatedProduct) => {
//       setProducts((prev) => {
//         const index = prev.findIndex((p) => p._id === updatedProduct._id);
//         if (index >= 0) {
//           const newArr = [...prev];
//           newArr[index] = updatedProduct;
//           return newArr;
//         } else {
//           return [updatedProduct, ...prev]; // new product add hua
//         }
//       });
//     });

//     // ❌ When a product is deleted
//     socket.on("productDeleted", (deletedProduct) => {
//       setProducts((prev) => prev.filter((p) => p._id !== deletedProduct._id));
//     });

//     // cleanup on unmount
//     return () => {
//       socket.disconnect();
//     };
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.loaderContainer}>
//         <ActivityIndicator size="large" color="#3498db" />
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <Text style={styles.heading}>🛍️ All Products</Text>
//       {products.length === 0 ? (
//         <Text style={styles.noData}>No products found</Text>
//       ) : (
//         <FlatList
//           data={products}
//           numColumns={2}
//           keyExtractor={(item) => item._id}
//           renderItem={({ item }) => (
//             <View style={styles.productCard}>
//               <Image
//                 source={{ uri: `${SERVER_URL}/uploads/${item.image}` }}
//                 style={styles.productImage}
//               />
//               <View style={styles.productInfo}>
//                 <Text numberOfLines={1} style={styles.productName}>
//                   {item.name}
//                 </Text>
//                 <Text style={styles.productPrice}>₹{item.currentPrice}</Text>
//               </View>
//             </View>
//           )}
//           columnWrapperStyle={{ justifyContent: "space-between" }}
//           contentContainerStyle={{ paddingBottom: 20 }}
//         />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
//   container: { flex: 1, paddingHorizontal: 12, backgroundColor: "#fff" },
//   heading: {
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginVertical: 10,
//     color: "#2c3e50",
//   },
//   noData: { textAlign: "center", marginTop: 20, fontSize: 16, color: "#999" },
//   productCard: {
//     backgroundColor: "#fefefe",
//     borderRadius: 12,
//     marginBottom: 12,
//     width: (width - 45) / 2,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//     overflow: "hidden",
//   },
//   productImage: {
//     width: "100%",
//     height: 120,
//     resizeMode: "cover",
//   },
//   productInfo: {
//     padding: 8,
//     backgroundColor: "#fff",
//   },
//   productName: {
//     fontSize: 14,
//     fontWeight: "600",
//     color: "#2c3e50",
//   },
//   productPrice: {
//     fontSize: 13,
//     color: "#27ae60",
//     marginTop: 3,
//     fontWeight: "bold",
//   },
// });
