
// // app/drawer/homeScreen.js

// import { useFocusEffect } from '@react-navigation/native';
// import React, { useCallback, useState, useRef } from "react";
// import {
//   BackHandler,
//   Dimensions,
//   FlatList,
//   Image,
//   StyleSheet,
//   Text,
//   TouchableOpacity,
//   View,
//   ActivityIndicator,
//   Animated,
//   RefreshControl,
//   Alert,
// } from "react-native";
// import Carousel from 'react-native-snap-carousel-v4';
// import axios from "axios";
// import { Fonts } from "../../constants/styles";
// import MyStatusBar from '../../components/myStatusBar';
// import { useRouter } from 'expo-router';
// import io from "socket.io-client";
// import HeaderMain from "../../components/HeaderMain";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// // EAS env se URL le rahe hain (eas.json / secrets se inject hoga)
// const BACKEND_URL = process.env.EXPO_PUBLIC_API_URL || 'https://ecommerce-backend-production-0cdd.up.railway.app';

// // SABSE ZAROORI IMPORT — category image ke liye
// import { GET_CATEGORIES_API, getImageUrl } from "../services/api";

// const { width } = Dimensions.get('window');
// const itemWidth = Math.round(width * 0.76);

// // SLIDER IMAGES (bundled assets)
// const bannerSliderList = [
//   { bannerImage: require('../../assets/images/home_slider/Slider_1.jpg') },
//   { bannerImage: require('../../assets/images/home_slider/Slider_2.jpg') },
//   { bannerImage: require('../../assets/images/home_slider/Slider_3.jpg') },
//   { bannerImage: require('../../assets/images/home_slider/Slider_4.jpg') },
//   { bannerImage: require('../../assets/images/home_slider/Slider_5.jpg') },
//   { bannerImage: require('../../assets/images/home_slider/Slider_6.jpg') },
// ];

// // TOP CATEGORIES (dummy – real se replace kar sakte ho)
// const topCategoriesList = [
//   { id: '1', categoryImage: require('../../assets/images/top_category/top_category1.jpg'), name: 'Stunning Necklace' },
//   { id: '2', categoryImage: require('../../assets/images/top_category/top_category2.jpg'), name: 'Necklaces' },
//   { id: '3', categoryImage: require('../../assets/images/top_category/top_category3.jpg'), name: 'Chic Earrings' },
//   { id: '4', categoryImage: require('../../assets/images/top_category/top_category4.jpg'), name: 'Trendy Bracelets' },
//   { id: '5', categoryImage: require('../../assets/images/top_category/top_category5.jpg'), name: 'Dazzle Anklets' },
//   { id: '6', categoryImage: require('../../assets/images/top_category/top_category6.jpg'), name: 'Royal Bangles' },
// ];

// const SafetyMarquee = () => {
//   const scrollX = useRef(new Animated.Value(0)).current;

//   React.useEffect(() => {
//     Animated.loop(
//       Animated.timing(scrollX, {
//         toValue: -1000,
//         duration: 20000,
//         useNativeDriver: true,
//       })
//     ).start();
//   }, []);

//   const data = ['Lifetime Exchange', '1 Year Warranty', '100% Certified', '15 Day Money Back'];

//   return (
//     <View style={{ height: 60, overflow: 'hidden', marginVertical: 10 }}>
//       <Animated.View style={{ flexDirection: 'row', transform: [{ translateX: scrollX }] }}>
//         {[...data, ...data].map((text, i) => (
//           <View key={i} style={{
//             backgroundColor: '#FFD700',
//             paddingHorizontal: 24,
//             paddingVertical: 14,
//             borderRadius: 12,
//             marginRight: 16,
//             justifyContent: 'center',
//           }}>
//             <Text style={{ ...Fonts.blackColor15Bold, textAlign: 'center' }}>{text}</Text>
//           </View>
//         ))}
//       </Animated.View>
//     </View>
//   );
// };

// const HomeScreen = () => {
//   const router = useRouter();
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [refreshing, setRefreshing] = useState(false);
//   const [error, setError] = useState(null);
//   const [cartCount, setCartCount] = useState(0);
//   const [backClickCount, setBackClickCount] = useState(0);

//   // Socket setup – production ke liye fully optimized
//   const socket = useRef(io(BACKEND_URL, {
//     transports: ["websocket"],
//     secure: true,                        // Railway HTTPS ke liye
//     reconnection: true,
//     reconnectionAttempts: 10,
//     reconnectionDelay: 1000,
//     reconnectionDelayMax: 5000,
//     timeout: 20000,
//     autoConnect: true,
//   })).current;

//   const loadCartCount = async () => {
//     try {
//       const raw = await AsyncStorage.getItem("cart");
//       if (raw) {
//         const items = JSON.parse(raw);
//         const total = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
//         setCartCount(total);
//       }
//     } catch (e) {
//       console.log("Cart load error:", e);
//     }
//   };

//   const fetchCategories = async () => {
//     if (!GET_CATEGORIES_API) {
//       Alert.alert("Error", "API URL not defined!");
//       setCategories([]);
//       setLoading(false);
//       setRefreshing(false);
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setRefreshing(true);

//     try {
//       const res = await axios.get(GET_CATEGORIES_API);
//       const dataArray = res.data.data || res.data || [];
//       const active = dataArray.filter(c => c?.status?.toLowerCase() === "active");
//       setCategories(active);
//     } catch (err) {
//       console.error("Fetch error:", err.message);
//       setError(err.message);
//       setCategories([]);
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   // Screen focus pe sab kuch fresh load + socket events
//   useFocusEffect(
//     useCallback(() => {
//       loadCartCount();
//       fetchCategories();

//       // Socket events
//       socket.on("connect", () => console.log("🔌 Socket connected! ID:", socket.id));
//       socket.on("connect_error", (err) => console.log("❌ Socket connect error:", err.message || err));
//       socket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));
//       socket.on("categoryUpdated", () => {
//         console.log("📢 Live: categoryUpdated received!");
//         fetchCategories();
//       });
//       socket.on("categoryDeleted", () => {
//         console.log("📢 Live: categoryDeleted received!");
//         fetchCategories();
//       });

//       const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
//         if (backClickCount === 1) {
//           BackHandler.exitApp();
//         } else {
//           setBackClickCount(1);
//           setTimeout(() => setBackClickCount(0), 2000);
//         }
//         return true;
//       });

//       return () => {
//         backHandler.remove();
//         socket.off("connect");
//         socket.off("connect_error");
//         socket.off("disconnect");
//         socket.off("categoryUpdated");
//         socket.off("categoryDeleted");
//       };
//     }, [backClickCount, socket])
//   );

//   const onRefresh = useCallback(() => {
//     fetchCategories();
//   }, []);

//   const shoppingCategories = () => {
//     if (loading && !refreshing) return <ActivityIndicator size="large" color="#ff6b6b" style={{ margin: 40 }} />;
//     if (error) return <Text style={{ textAlign: 'center', padding: 30, color: 'red', ...Fonts.blackColor16SemiBold }}>Error: {error}</Text>;
//     if (categories.length === 0) return <Text style={{ textAlign: 'center', padding: 30, ...Fonts.blackColor16SemiBold }}>No categories available (Pull to refresh)</Text>;

//     return (
//       <View style={{ paddingVertical: 15 }}>
//         <Text style={{ ...Fonts.blackColor20Bold, textAlign: 'center', marginBottom: 16, color: '#111' }}>
//           Shop Our Best Category
//         </Text>

//         <FlatList
//           data={categories}
//           horizontal
//           showsHorizontalScrollIndicator={false}
//           keyExtractor={item => item._id}
//           contentContainerStyle={{ paddingHorizontal: 20 }}
//           ItemSeparatorComponent={() => <View style={{ width: 24 }} />}
//           refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#ff6b6b"]} />}
//           renderItem={({ item }) => (
//             <TouchableOpacity
//               activeOpacity={0.92}
//               onPress={() => router.push({ pathname: "/products/productsScreen", params: { categoryId: item._id, categoryName: item.name } })}
//               style={{ alignItems: 'center', width: (width / 3.4) - 10 }}
//             >
//               <View style={{
//                 width: (width / 3.4) - 20,
//                 height: (width / 3.4) - 20,
//                 borderRadius: 999,
//                 borderWidth: 4,
//                 borderColor: '#D4AF37',
//                 overflow: 'hidden',
//                 backgroundColor: '#fff',
//                 elevation: 12,
//                 shadowColor: '#D4AF37',
//                 shadowOffset: { width: 0, height: 6 },
//                 shadowOpacity: 0.35,
//                 shadowRadius: 12,
//               }}>
//                 <Image
//                   source={{ uri: getImageUrl(item.image) }}
//                   style={{ width: '100%', height: '100%', borderRadius: 999 }}
//                   resizeMode="cover"
//                 />
//                 <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(212, 175, 55, 0.15)', borderRadius: 999 }} />
//               </View>
//               <Text style={{ marginTop: 10, ...Fonts.blackColor14SemiBold, textAlign: 'center', color: '#111' }} numberOfLines={2}>
//                 {item.name}
//               </Text>
//             </TouchableOpacity>
//           )}
//         />
//       </View>
//     );
//   };

//   const bannerSlider = () => (
//     <Carousel
//       data={bannerSliderList}
//       sliderWidth={width}
//       itemWidth={itemWidth}
//       autoplay
//       loop
//       autoplayInterval={4000}
//       renderItem={({ item }) => (
//         <View style={{ borderRadius: 16, overflow: 'hidden', elevation: 5 }}>
//           <Image source={item.bannerImage} style={{ width: itemWidth, height: 240 }} resizeMode="cover" />
//         </View>
//       )}
//     />
//   );

//   return (
//     <View style={{ flex: 1, backgroundColor: '#fff' }}>
//       <MyStatusBar />
//       <HeaderMain cartCount={cartCount} />

//       <FlatList
//         showsVerticalScrollIndicator={false}
//         refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
//         ListHeaderComponent={
//           <>
//             {shoppingCategories()}
//             <View style={{ paddingHorizontal: 15 }}>{bannerSlider()}</View>
//             <SafetyMarquee />

//             <Text style={styles.sectionTitle}>TOP CATEGORIES</Text>
//             <FlatList
//               data={topCategoriesList}
//               numColumns={3}
//               scrollEnabled={false}
//               keyExtractor={item => item.id}
//               contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
//               columnWrapperStyle={{ justifyContent: 'space-between' }}
//               renderItem={({ item }) => (
//                 <TouchableOpacity activeOpacity={0.9} style={{ alignItems: 'center', marginVertical: 12, width: width / 3.3 }}>
//                   <Image source={item.categoryImage} style={styles.topCategoriesImage} resizeMode="cover" />
//                   <Text style={{ marginTop: 8, ...Fonts.blackColor14Medium, textAlign: 'center' }} numberOfLines={2}>
//                     {item.name}
//                   </Text>
//                 </TouchableOpacity>
//               )}
//             />
//             <View style={{ height: 100 }} />
//           </>
//         }
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   sectionTitle: {
//     marginTop: 25,
//     marginHorizontal: 18,
//     fontSize: 19,
//     fontWeight: '700',
//     color: '#333',
//   },
//   topCategoriesImage: {
//     height: 150,
//     width: width / 3.4,
//     borderRadius: 14,
//   },
// });

// export default HomeScreen;








// app/drawer/homeScreen.js

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState, useRef } from "react";
import {
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Animated,
  RefreshControl,
  Alert,
} from "react-native";
import Carousel from 'react-native-snap-carousel-v4';
import axios from "axios";
import { Fonts } from "../../constants/styles";
import MyStatusBar from '../../components/myStatusBar';
import { useRouter } from 'expo-router';
import io from "socket.io-client";
import HeaderMain from "../../components/HeaderMain";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ✅ UPDATED: api.js se sab kuch import karo
import { 
  ADMIN_BASE_URL,        // ← Railway URL (socket ke liye)
  GET_CATEGORIES_API,    // ← Categories API
  getImageUrl            // ← Image helper
} from "../services/api";

const { width } = Dimensions.get('window');
const itemWidth = Math.round(width * 0.76);

// SLIDER IMAGES (bundled assets)
const bannerSliderList = [
  { bannerImage: require('../../assets/images/home_slider/Slider_1.jpg') },
  { bannerImage: require('../../assets/images/home_slider/Slider_2.jpg') },
  { bannerImage: require('../../assets/images/home_slider/Slider_3.jpg') },
  { bannerImage: require('../../assets/images/home_slider/Slider_4.jpg') },
  { bannerImage: require('../../assets/images/home_slider/Slider_5.jpg') },
  { bannerImage: require('../../assets/images/home_slider/Slider_6.jpg') },
];

// TOP CATEGORIES (dummy – real se replace kar sakte ho)
const topCategoriesList = [
  { id: '1', categoryImage: require('../../assets/images/top_category/top_category1.jpg'), name: 'Stunning Necklace' },
  { id: '2', categoryImage: require('../../assets/images/top_category/top_category2.jpg'), name: 'Necklaces' },
  { id: '3', categoryImage: require('../../assets/images/top_category/top_category3.jpg'), name: 'Chic Earrings' },
  { id: '4', categoryImage: require('../../assets/images/top_category/top_category4.jpg'), name: 'Trendy Bracelets' },
  { id: '5', categoryImage: require('../../assets/images/top_category/top_category5.jpg'), name: 'Dazzle Anklets' },
  { id: '6', categoryImage: require('../../assets/images/top_category/top_category6.jpg'), name: 'Royal Bangles' },
];

const SafetyMarquee = () => {
  const scrollX = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.timing(scrollX, {
        toValue: -1000,
        duration: 20000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const data = ['Lifetime Exchange', '1 Year Warranty', '100% Certified', '15 Day Money Back'];

  return (
    <View style={{ height: 60, overflow: 'hidden', marginVertical: 10 }}>
      <Animated.View style={{ flexDirection: 'row', transform: [{ translateX: scrollX }] }}>
        {[...data, ...data].map((text, i) => (
          <View key={i} style={{
            backgroundColor: '#FFD700',
            paddingHorizontal: 24,
            paddingVertical: 14,
            borderRadius: 12,
            marginRight: 16,
            justifyContent: 'center',
          }}>
            <Text style={{ ...Fonts.blackColor15Bold, textAlign: 'center' }}>{text}</Text>
          </View>
        ))}
      </Animated.View>
    </View>
  );
};

const HomeScreen = () => {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [backClickCount, setBackClickCount] = useState(0);

  // ✅ Socket setup – Railway URL use kar rahe hain
  const socket = useRef(io(ADMIN_BASE_URL, {
    transports: ["websocket"],
    secure: true,
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    timeout: 20000,
    autoConnect: true,
  })).current;

  const loadCartCount = async () => {
    try {
      const raw = await AsyncStorage.getItem("cart");
      if (raw) {
        const items = JSON.parse(raw);
        const total = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(total);
      }
    } catch (e) {
      console.log("Cart load error:", e);
    }
  };

  const fetchCategories = async () => {
    if (!GET_CATEGORIES_API) {
      Alert.alert("Error", "API URL not defined!");
      setCategories([]);
      setLoading(false);
      setRefreshing(false);
      return;
    }

    setLoading(true);
    setError(null);
    setRefreshing(true);

    try {
      console.log('📡 Fetching categories from:', GET_CATEGORIES_API); // ← Debug log
      const res = await axios.get(GET_CATEGORIES_API);
      const dataArray = res.data.data || res.data || [];
      const active = dataArray.filter(c => c?.status?.toLowerCase() === "active");
      setCategories(active);
      console.log('✅ Categories loaded:', active.length); // ← Success log
    } catch (err) {
      console.error("❌ Fetch error:", err.message);
      setError(err.message);
      setCategories([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Screen focus pe sab kuch fresh load + socket events
  useFocusEffect(
    useCallback(() => {
      loadCartCount();
      fetchCategories();

      // Socket events
      socket.on("connect", () => console.log("🔌 Socket connected! ID:", socket.id));
      socket.on("connect_error", (err) => console.log("❌ Socket connect error:", err.message || err));
      socket.on("disconnect", (reason) => console.log("Socket disconnected:", reason));
      socket.on("categoryUpdated", () => {
        console.log("📢 Live: categoryUpdated received!");
        fetchCategories();
      });
      socket.on("categoryDeleted", () => {
        console.log("📢 Live: categoryDeleted received!");
        fetchCategories();
      });

      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        if (backClickCount === 1) {
          BackHandler.exitApp();
        } else {
          setBackClickCount(1);
          setTimeout(() => setBackClickCount(0), 2000);
        }
        return true;
      });

      return () => {
        backHandler.remove();
        socket.off("connect");
        socket.off("connect_error");
        socket.off("disconnect");
        socket.off("categoryUpdated");
        socket.off("categoryDeleted");
      };
    }, [backClickCount, socket])
  );

  const onRefresh = useCallback(() => {
    fetchCategories();
  }, []);

  const shoppingCategories = () => {
    if (loading && !refreshing) return <ActivityIndicator size="large" color="#ff6b6b" style={{ margin: 40 }} />;
    if (error) return <Text style={{ textAlign: 'center', padding: 30, color: 'red', ...Fonts.blackColor16SemiBold }}>Error: {error}</Text>;
    if (categories.length === 0) return <Text style={{ textAlign: 'center', padding: 30, ...Fonts.blackColor16SemiBold }}>No categories available (Pull to refresh)</Text>;

    return (
      <View style={{ paddingVertical: 15 }}>
        <Text style={{ ...Fonts.blackColor20Bold, textAlign: 'center', marginBottom: 16, color: '#111' }}>
          Shop Our Best Category
        </Text>

        <FlatList
          data={categories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item._id}
          contentContainerStyle={{ paddingHorizontal: 20 }}
          ItemSeparatorComponent={() => <View style={{ width: 24 }} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#ff6b6b"]} />}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.92}
              onPress={() => router.push({ pathname: "/products/productsScreen", params: { categoryId: item._id, categoryName: item.name } })}
              style={{ alignItems: 'center', width: (width / 3.4) - 10 }}
            >
              <View style={{
                width: (width / 3.4) - 20,
                height: (width / 3.4) - 20,
                borderRadius: 999,
                borderWidth: 4,
                borderColor: '#D4AF37',
                overflow: 'hidden',
                backgroundColor: '#fff',
                elevation: 12,
                shadowColor: '#D4AF37',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.35,
                shadowRadius: 12,
              }}>
                <Image
                  source={{ uri: getImageUrl(item.image) }}
                  style={{ width: '100%', height: '100%', borderRadius: 999 }}
                  resizeMode="cover"
                />
                <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(212, 175, 55, 0.15)', borderRadius: 999 }} />
              </View>
              <Text style={{ marginTop: 10, ...Fonts.blackColor14SemiBold, textAlign: 'center', color: '#111' }} numberOfLines={2}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    );
  };

  const bannerSlider = () => (
    <Carousel
      data={bannerSliderList}
      sliderWidth={width}
      itemWidth={itemWidth}
      autoplay
      loop
      autoplayInterval={4000}
      renderItem={({ item }) => (
        <View style={{ borderRadius: 16, overflow: 'hidden', elevation: 5 }}>
          <Image source={item.bannerImage} style={{ width: itemWidth, height: 240 }} resizeMode="cover" />
        </View>
      )}
    />
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <MyStatusBar />
      <HeaderMain cartCount={cartCount} />

      <FlatList
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListHeaderComponent={
          <>
            {shoppingCategories()}
            <View style={{ paddingHorizontal: 15 }}>{bannerSlider()}</View>
            <SafetyMarquee />

            <Text style={styles.sectionTitle}>TOP CATEGORIES</Text>
            <FlatList
              data={topCategoriesList}
              numColumns={3}
              scrollEnabled={false}
              keyExtractor={item => item.id}
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              renderItem={({ item }) => (
                <TouchableOpacity activeOpacity={0.9} style={{ alignItems: 'center', marginVertical: 12, width: width / 3.3 }}>
                  <Image source={item.categoryImage} style={styles.topCategoriesImage} resizeMode="cover" />
                  <Text style={{ marginTop: 8, ...Fonts.blackColor14Medium, textAlign: 'center' }} numberOfLines={2}>
                    {item.name}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <View style={{ height: 100 }} />
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    marginTop: 25,
    marginHorizontal: 18,
    fontSize: 19,
    fontWeight: '700',
    color: '#333',
  },
  topCategoriesImage: {
    height: 150,
    width: width / 3.4,
    borderRadius: 14,
  },
});

export default HomeScreen;