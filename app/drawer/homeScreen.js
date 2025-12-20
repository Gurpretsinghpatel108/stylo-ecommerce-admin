// import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
// import { useFocusEffect } from '@react-navigation/native';
// import React, { useCallback, useState, useEffect, useRef } from "react";
// import { BackHandler, Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
// import Carousel from 'react-native-snap-carousel-v4';
// import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
// import MyStatusBar from '../../components/myStatusBar';
// import { useNavigation } from 'expo-router';

// const width = Dimensions.get('window').width;

// const itemWidth = Math.round(width * 0.76);

// const bannerSliderList = [
//     {
//         bannerImage: require('../../assets/images/home_slider/slider_1.jpg')
//     },
//     {
//         bannerImage: require('../../assets/images/home_slider/slider_2.jpg')
//     },
//     {
//         bannerImage: require('../../assets/images/home_slider/slider_3.jpg')
//     },
// ];

// const shoppingCategoriesList = [
//     {
//         id: '1',
//         categoryImage: require('../../assets/images/shopping_categories/men_category.jpg'),
//     },
//     {
//         id: '2',
//         categoryImage: require('../../assets/images/shopping_categories/women_category.jpg'),
//     },
//     {
//         id: '3',
//         categoryImage: require('../../assets/images/shopping_categories/beauty_category.jpg'),
//     },
//     {
//         id: '4',
//         categoryImage: require('../../assets/images/shopping_categories/kids_category.jpg'),
//     },
//     {
//         id: '5',
//         categoryImage: require('../../assets/images/shopping_categories/home_category.jpg'),
//     },
//     {
//         id: '6',
//         categoryImage: require('../../assets/images/shopping_categories/jewellery_category.jpg'),
//     },
// ];

// const safetyCheckListData = [
//     {
//         id: '1',
//         safetyImage: require('../../assets/images/safety_checklist/safety_1.jpg')
//     },
//     {
//         id: '2',
//         safetyImage: require('../../assets/images/safety_checklist/safety_2.jpg')
//     },
//     {
//         safetyImage: require('../../assets/images/safety_checklist/safety_3.jpg')
//     },
//     {
//         id: '3',
//         safetyImage: require('../../assets/images/safety_checklist/safety_4.jpg')
//     },
//     {
//         id: '4',
//         safetyImage: require('../../assets/images/safety_checklist/safety_5.jpg')
//     },
// ];

// const topCategoriesList = [
//     {
//         id: '1',
//         categoryImage: require('../../assets/images/top_category/top_category_1.jpg')
//     },
//     {
//         id: '2',
//         categoryImage: require('../../assets/images/top_category/top_category_2.jpg')
//     },
//     {
//         id: '3',
//         categoryImage: require('../../assets/images/top_category/top_category_3.jpg')
//     },
//     {
//         id: '4',
//         categoryImage: require('../../assets/images/top_category/top_category_4.jpg')
//     },
//     {
//         id: '5',
//         categoryImage: require('../../assets/images/top_category/top_category_5.jpg')
//     },
//     {
//         id: '6',
//         categoryImage: require('../../assets/images/top_category/top_category_6.jpg')
//     },
//     {
//         id: '7',
//         categoryImage: require('../../assets/images/top_category/top_category_7.jpg')
//     },
//     {
//         id: '8',
//         categoryImage: require('../../assets/images/top_category/top_category_8.jpg')
//     },
//     {
//         id: '9',
//         categoryImage: require('../../assets/images/top_category/top_category_9.jpg')
//     }
// ];

// const summerEditsList = [
//     {
//         id: '1',
//         summerEditImage: require('../../assets/images/summer_edit/summer_edit_1.jpg'),
//     },
//     {
//         id: '2',
//         summerEditImage: require('../../assets/images/summer_edit/summer_edit_2.jpg'),
//     },
//     {
//         id: '3',
//         summerEditImage: require('../../assets/images/summer_edit/summer_edit_3.jpg'),
//     },
//     {
//         id: '4',
//         summerEditImage: require('../../assets/images/summer_edit/summer_edit_4.jpg'),
//     },
// ];

// const exploreBrandsList = [
//     {
//         id: '1',
//         brandImage: require('../../assets/images/explore_brands/explore_brands_1.jpg')
//     },
//     {
//         id: '2',
//         brandImage: require('../../assets/images/explore_brands/explore_brands_2.jpg')
//     },
//     {
//         id: '3',
//         brandImage: require('../../assets/images/explore_brands/explore_brands_3.jpg')
//     },
//     {
//         id: '4',
//         brandImage: require('../../assets/images/explore_brands/explore_brands_4.jpg')
//     },
//     {
//         id: '5',
//         brandImage: require('../../assets/images/explore_brands/explore_brands_5.jpg')
//     },
//     {
//         id: '6',
//         brandImage: require('../../assets/images/explore_brands/explore_brands_6.jpg')
//     },
//     {
//         id: '7',
//         brandImage: require('../../assets/images/explore_brands/explore_brands_7.jpg')
//     },
//     {
//         id: '8',
//         brandImage: require('../../assets/images/explore_brands/explore_brands_8.jpg')
//     },
//     {
//         id: '9',
//         brandImage: require('../../assets/images/explore_brands/explore_brands_9.jpg')
//     },
// ];

// const kidsApparelsList = [
//     {
//         id: '1',
//         kidsApparelsImage: require('../../assets/images/kids_apparels/kids_apparels_1.jpg')
//     },
//     {
//         id: '2',
//         kidsApparelsImage: require('../../assets/images/kids_apparels/kids_apparels_2.jpg')
//     },
// ];

// const HomeScreen = () => {

//     const navigation = useNavigation();

//     const bannerRef = useRef();

//     useEffect(() => {
//         const unsubscribe = navigation.addListener('focus', () => {
//             bannerRef.current.startAutoplay();
//         });
//         return unsubscribe;
//     }, [navigation]);

//     useEffect(() => {
//         const unsubscribe = navigation.addListener('blur', () => {
//             bannerRef.current.stopAutoplay();
//         });
//         return unsubscribe;
//     }, [navigation]);

//     const backAction = () => {
//         backClickCount == 1 ? BackHandler.exitApp() : _spring();
//         return true;
//     };

//     useFocusEffect(
//         useCallback(() => {
//             const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
//             return () => {
//                 backHandler.remove();
//             };
//         }, [backAction])
//     );

//     function _spring() {
//         setBackClickCount(1);
//         setTimeout(() => {
//             setBackClickCount(0)
//         }, 1000)
//     }

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setLoopType(true)
//         }, 1000);
//         return () => {
//             clearTimeout(timer);
//         }
//     }, [])

//     const [backClickCount, setBackClickCount] = useState(0);
//     const [bannerSliderData, setBannerSliderData] = useState(bannerSliderList);
//     const [loopType, setLoopType] = useState(false);

//     return (
//         <View style={{ flex: 1, backgroundColor: Colors.backColor }}>
//             <MyStatusBar />
//             <View style={{ flex: 1 }}>
//                 {header()}
//                 <FlatList
//                     ListHeaderComponent={
//                         <>
//                             {shoppingCategories()}
//                             {bannerSlider()}
//                             {safetyCheckList()}
//                             {topCategories()}
//                             {summerEdit()}
//                             {exploreBrands()}
//                             {kidsApparels()}
//                         </>
//                     }
//                     contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 2.0, }}
//                     showsVerticalScrollIndicator={false}
//                 />
//             </View>
//             {
//                 backClickCount == 1
//                     ?
//                     <View style={styles.animatedView}>
//                         <Text style={{ ...Fonts.whiteColor14SemiBold }}>
//                             Press Back Once Again to Exit
//                         </Text>
//                     </View>
//                     :
//                     null
//             }
//         </View>
//     )

//     function kidsApparels() {

//         const renderItem = ({ item }) => (
//             <TouchableOpacity
//                 activeOpacity={0.9}
//                 onPress={() => navigation.push('products/productsScreen')}
//                 style={{ marginRight: Sizes.fixPadding - 3.0, borderColor: '#e0e0e0', borderWidth: 2.0, }}
//             >
//                 <Image
//                     source={item.kidsApparelsImage}
//                     style={{ width: 230, height: 290, }}
//                     resizeMode="cover"
//                 />
//             </TouchableOpacity>
//         )
//         return (
//             <View>
//                 <Text style={styles.kidsApparelsTextStyle}>
//                     KIDS APPARELS
//                 </Text>
//                 <FlatList
//                     horizontal
//                     data={kidsApparelsList}
//                     keyExtractor={(item) => `${item.id}`}
//                     renderItem={renderItem}
//                     contentContainerStyle={{ paddingLeft: Sizes.fixPadding }}
//                     showsHorizontalScrollIndicator={false}
//                 />
//             </View>
//         )
//     }

//     function exploreBrands() {
//         const renderItem = ({ item }) => (
//             <TouchableOpacity
//                 activeOpacity={0.9}
//                 onPress={() => navigation.push('products/productsScreen')}
//             >
//                 <Image
//                     source={item.brandImage}
//                     style={{ ...styles.brandsImageStyle }}
//                     resizeMode="cover"
//                 />
//             </TouchableOpacity>
//         )
//         return (
//             <View>
//                 <Text style={styles.exploreBrandsTextStyle}>
//                     EXPLORE BRANDS
//                 </Text>
//                 <FlatList
//                     listKey={`brandList`}
//                     data={exploreBrandsList}
//                     keyExtractor={(item) => `${item.id}`}
//                     renderItem={renderItem}
//                     numColumns={3}
//                     scrollEnabled={false}
//                     contentContainerStyle={{ backgroundColor: 'red' }}
//                     columnWrapperStyle={{
//                         paddingHorizontal: Sizes.fixPadding - 5.0,
//                         flexDirection: 'row',
//                     }}
//                 />
//             </View>
//         )
//     }

//     function summerEdit() {

//         const renderItem = ({ item }) => (
//             <TouchableOpacity
//                 activeOpacity={0.9}
//                 onPress={() => navigation.push('products/productsScreen')}
//             >
//                 <Image
//                     source={item.summerEditImage}
//                     style={styles.summerEditImageStyle}
//                     resizeMode="cover"
//                 />
//             </TouchableOpacity>
//         )
//         return (
//             <View>
//                 <Text style={styles.summerEditTextStyle}>
//                     SUMMER EDIT
//                 </Text>
//                 <FlatList
//                     horizontal
//                     showsHorizontalScrollIndicator={false}
//                     data={summerEditsList}
//                     keyExtractor={(item) => `${item.id}`}
//                     renderItem={renderItem}
//                     contentContainerStyle={{ paddingLeft: Sizes.fixPadding }}
//                 />
//             </View>
//         )
//     }

//     function topCategories() {
//         const renderItem = ({ item }) => (
//             <TouchableOpacity
//                 activeOpacity={0.99}
//                 onPress={() => navigation.push('categoryDetail/categoryDetailScreen')}
//             >
//                 <Image
//                     source={item.categoryImage}
//                     style={styles.topCategoriesImageStyle}
//                     resizeMode="cover"
//                 />
//             </TouchableOpacity>
//         )
//         return (
//             <View style={{ flex: 1, }}>
//                 <Text style={styles.topCategoriesTextStyle}>
//                     TOP CATEGORIES
//                 </Text>
//                 <FlatList
//                     listKey={`categoryList`}
//                     data={topCategoriesList}
//                     keyExtractor={(item) => `${item.id}`}
//                     renderItem={renderItem}
//                     scrollEnabled={false}
//                     numColumns={3}
//                     columnWrapperStyle={{
//                         paddingHorizontal: Sizes.fixPadding - 5.0,
//                         flexDirection: 'row',
//                     }}
//                 />
//             </View>
//         )
//     }

//     function safetyCheckList() {

//         const renderItem = ({ item }) => (
//             <Image
//                 source={item.safetyImage}
//                 style={{
//                     width: width - 120,
//                     height: 80,
//                     marginRight: Sizes.fixPadding,
//                 }}
//                 resizeMode="stretch"
//             />
//         )
//         return (
//             <View>
//                 <FlatList
//                     horizontal
//                     data={safetyCheckListData}
//                     keyExtractor={(item) => `${item.id}`}
//                     renderItem={renderItem}
//                     contentContainerStyle={{
//                         paddingLeft: Sizes.fixPadding,
//                         paddingVertical: Sizes.fixPadding
//                     }}
//                     showsHorizontalScrollIndicator={false}
//                 />
//             </View>
//         )
//     }

//     function bannerSlider() {

//         const renderItem = ({ item }) => (
//             <TouchableOpacity
//                 activeOpacity={0.9}
//                 onPress={() => navigation.push('products/productsScreen')}
//             >
//                 <Image
//                     source={item.bannerImage}
//                     style={{
//                         width: width - 100,
//                         height: 250,
//                     }}
//                     resizeMode="cover"
//                 />
//             </TouchableOpacity>
//         )

//         return (
//             <View style={{ backgroundColor: Colors.whiteColor }}>
//                 <Carousel
//                     ref={bannerRef}
//                     data={bannerSliderData}
//                     sliderWidth={width}
//                     itemWidth={itemWidth}
//                     renderItem={renderItem}
//                     inactiveSlideOpacity={1}
//                     showsHorizontalScrollIndicator={false}
//                     onSnapToItem={(index) => { }}
//                     loop={loopType}
//                 />
//             </View>
//         )
//     }

//     function shoppingCategories() {

//         const renderItem = ({ item }) => (
//             <TouchableOpacity
//                 activeOpacity={0.9}
//                 onPress={() => navigation.push('categoryDetail/categoryDetailScreen')}
//             >
//                 <Image
//                     source={item.categoryImage}
//                     style={{
//                         width: 85.0,
//                         height: 100.0,
//                         marginRight: Sizes.fixPadding - 5.0,
//                     }}
//                 />
//             </TouchableOpacity>
//         )
//         return (
//             <View>
//                 <FlatList
//                     horizontal
//                     data={shoppingCategoriesList}
//                     renderItem={renderItem}
//                     keyExtractor={(item) => `${item.id}`}
//                     contentContainerStyle={{
//                         paddingVertical: Sizes.fixPadding,
//                         paddingLeft: Sizes.fixPadding - 5.0,
//                     }}
//                     showsHorizontalScrollIndicator={false}
//                 />
//             </View>
//         )
//     }

//     function header() {
//         return (
//             <View style={styles.headerWrapStyle}>
//                 <View style={{
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                     flex: 1.5,
//                 }}>
//                     <MaterialIcons
//                         name="menu"
//                         size={25}
//                         color="black"
//                         style={{ marginRight: Sizes.fixPadding * 2.0 }}
//                         onPress={() => navigation.openDrawer()}
//                     />
//                     <Image
//                         source={require('../../assets/images/logo/stylo_transparent.png')}
//                         style={{ width: 30.0, height: 30.0, }}
//                         resizeMode="cover"
//                     />
//                 </View>

//                 <View style={styles.headerIconsWrapStyle}>
//                     <MaterialIcons
//                         name="search"
//                         color={Colors.blackColor}
//                         size={25}
//                         onPress={() => navigation.push('search/searchScreen')}
//                     />
//                     <View>
//                         <MaterialIcons
//                             name="notifications-none"
//                             color={Colors.blackColor}
//                             size={25}
//                             onPress={() => navigation.push('notifications/notificationsScreen')}
//                         />
//                         <View style={styles.notificationsFavoritsAndShoppingsCountStyle}>
//                             <Text style={{ ...Fonts.whiteColor12Medium }}>
//                                 2
//                             </Text>
//                         </View>
//                     </View>
//                     <TouchableOpacity
//                         activeOpacity={0.9}
//                         onPress={() => navigation.push('wishlist/wishlistScreen')}
//                     >
//                         <MaterialIcons
//                             name="favorite-border"
//                             color={Colors.blackColor}
//                             size={25}
//                         />
//                         <View style={styles.notificationsFavoritsAndShoppingsCountStyle}>
//                             <Text style={{ ...Fonts.whiteColor12Medium }}>
//                                 2
//                             </Text>
//                         </View>
//                     </TouchableOpacity>
//                     <TouchableOpacity
//                         activeOpacity={0.9}
//                         onPress={() => navigation.push('bag/bagScreen')}
//                     >
//                         <FontAwesome5
//                             name="shopping-bag"
//                             size={24}
//                             color={Colors.blackColor}
//                         />
//                         <View style={styles.notificationsFavoritsAndShoppingsCountStyle}>
//                             <Text style={{ ...Fonts.whiteColor12Medium }}>
//                                 3
//                             </Text>
//                         </View>
//                     </TouchableOpacity>
//                 </View>
//             </View>
//         )
//     }
// }

// const styles = StyleSheet.create({
//     headerWrapStyle: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         paddingLeft: Sizes.fixPadding * 2.0,
//         paddingRight: Sizes.fixPadding + 1.0,
//         backgroundColor: Colors.whiteColor,
//         paddingVertical: Sizes.fixPadding + 5.0,
//         elevation: 2.0,
//         ...CommonStyles.shadow
//     },
//     notificationsFavoritsAndShoppingsCountStyle: {
//         position: 'absolute',
//         right: -10.0,
//         top: -5.0,
//         width: 18.0, height: 18.0,
//         borderRadius: 9.0,
//         backgroundColor: Colors.redColor,
//         alignItems: 'center',
//         justifyContent: 'center',
//     },
//     headerIconsWrapStyle: {
//         flex: 1,
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center'
//     },
//     kidsApparelsTextStyle: {
//         marginTop: Sizes.fixPadding + 5.0,
//         marginBottom: Sizes.fixPadding,
//         marginHorizontal: Sizes.fixPadding,
//         ...Fonts.blackColor15SemiBold
//     },
//     summerEditImageStyle: {
//         width: 230,
//         height: 290,
//         borderColor: '#e0e0e0',
//         borderWidth: 2.0,
//         marginRight: Sizes.fixPadding - 3.0,
//     },
//     summerEditTextStyle: {
//         marginTop: Sizes.fixPadding + 5.0,
//         marginBottom: Sizes.fixPadding,
//         marginHorizontal: Sizes.fixPadding,
//         ...Fonts.blackColor15SemiBold
//     },
//     topCategoriesImageStyle: {
//         height: 160.0,
//         marginHorizontal: Sizes.fixPadding - 5.0,
//         width: width / 3.34,
//         marginBottom: Sizes.fixPadding - 5.0,
//         alignSelf: 'center',
//     },
//     exploreBrandsTextStyle: {
//         marginTop: Sizes.fixPadding + 5.0,
//         marginBottom: Sizes.fixPadding + 2.0,
//         marginHorizontal: Sizes.fixPadding,
//         ...Fonts.blackColor15SemiBold
//     },
//     topCategoriesTextStyle: {
//         marginTop: Sizes.fixPadding - 5.0,
//         marginBottom: Sizes.fixPadding,
//         marginHorizontal: Sizes.fixPadding,
//         ...Fonts.blackColor15SemiBold
//     },
//     animatedView: {
//         backgroundColor: "#333333",
//         position: "absolute",
//         bottom: 40,
//         alignSelf: 'center',
//         borderRadius: Sizes.fixPadding - 5.0,
//         paddingHorizontal: Sizes.fixPadding + 5.0,
//         paddingVertical: Sizes.fixPadding,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     brandsImageStyle: {
//         height: 150.0,
//         width: width / 3.35,
//         marginHorizontal: Sizes.fixPadding - 5.0,
//         marginBottom: Sizes.fixPadding,
//     }
// })

// export default HomeScreen;


















// app/drawer/homeScreen.js   (ya jahan bhi tera home screen hai)

import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState, useEffect, useRef } from "react";
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
  DeviceEventEmitter,
  Animated,
} from "react-native";
import Carousel from 'react-native-snap-carousel-v4';
import axios from "axios";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import MyStatusBar from '../../components/myStatusBar';
import { useRouter } from 'expo-router';
import io from "socket.io-client";
import HeaderMain from "../../components/HeaderMain";
import AsyncStorage from "@react-native-async-storage/async-storage";

// SABSE ZAROORI IMPORT — YE CATEGORY IMAGE LAEGA
import { GET_CATEGORIES_API, getImageUrl } from "../services/api";

const { width } = Dimensions.get('window');
const itemWidth = Math.round(width * 0.76);

// SLIDER IMAGES — SAB SAHI HAIN AB
const bannerSliderList = [
  { bannerImage: require('../../assets/images/home_slider/Slider_1.jpg') },
  { bannerImage: require('../../assets/images/home_slider/Slider_2.jpg') },
  { bannerImage: require('../../assets/images/home_slider/Slider_3.jpg') },
  { bannerImage: require('../../assets/images/home_slider/Slider_4.jpg') },
  { bannerImage: require('../../assets/images/home_slider/Slider_5.jpg') },
  { bannerImage: require('../../assets/images/home_slider/Slider_6.jpg') },
];

// TOP CATEGORIES (DUMMY)
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

  useEffect(() => {
    Animated.loop(
      Animated.timing(scrollX, {
        toValue: -1000,
        duration: 20000,
        useNativeDriver: true,
        easing: (t) => t,
      })
    ).start();
  }, []);

  const data = [
    'Lifetime Exchange',
    '1 Year Warranty',
    '100% Certified',
    '15 Day Money Back',
  ];

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
  const [cartCount, setCartCount] = useState(0);
  const [backClickCount, setBackClickCount] = useState(0);

  // Socket for real-time category update (5000 port)
  const socket = useRef(io("http://10.23.168.194:5000", { transports: ["websocket"] })).current;

  const loadCartCount = async () => {
    try {
      const raw = await AsyncStorage.getItem("cart");
      if (raw) {
        const items = JSON.parse(raw);
        const total = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
        setCartCount(total);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const fetchCategories = async () => {
    if (!GET_CATEGORIES_API) {
      setCategories([]);
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(GET_CATEGORIES_API);
      const active = res.data.data.filter(c => c.status === "Active");
      setCategories(active);
    } catch (err) {
      console.log("Category fetch error:", err.message);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartCount();
    fetchCategories();

    socket.on("categoryUpdated", fetchCategories);
    socket.on("categoryDeleted", fetchCategories);

    const sub = DeviceEventEmitter.addListener("cartUpdated", loadCartCount);
    return () => {
      sub.remove();
      socket.off();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
        if (backClickCount === 1) {
          BackHandler.exitApp();
        } else {
          setBackClickCount(1);
          setTimeout(() => setBackClickCount(0), 2000);
        }
        return true;
      });
      return () => backHandler.remove();
    }, [backClickCount])
  );

  const shoppingCategories = () => {
    if (loading) return <ActivityIndicator size="large" color="#ff6b6b" style={{ margin: 30 }} />;
    if (categories.length === 0) return <Text style={{ textAlign: 'center', padding: 20 }}>No categories</Text>;

    return (
      <FlatList
        data={categories}
        numColumns={4}
        scrollEnabled={false}
        keyExtractor={(item) => item._id}
        columnWrapperStyle={{ justifyContent: 'space-between', paddingHorizontal: 12 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => router.push({
              pathname: "/products/productsScreen",
              params: { categoryId: item._id, categoryName: item.name }
            })}
            style={{ alignItems: 'center', marginVertical: 10, width: width / 4 - 20 }}
          >
            <Image
              source={{ uri: getImageUrl(item.image) }}
              style={{ width: 76, height: 76, borderRadius: 38 }}
              resizeMode="cover"
            />
            <Text style={{ ...Fonts.blackColor13Medium, marginTop: 8, textAlign: 'center' }} numberOfLines={2}>
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />
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
              contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }} // ← Spacing badhaya
              columnWrapperStyle={{ justifyContent: 'space-between' }} // ← Equal spacing
              renderItem={({ item }) => (
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={{
                    alignItems: 'center',
                    marginVertical: 12,
                    width: width / 3.3, // ← Width thoda adjust kiya taaki overlap na ho
                  }}
                >
                  <Image
                    source={item.categoryImage}
                    style={styles.topCategoriesImage}
                    resizeMode="cover"
                  />
                  <Text
                    style={{
                      marginTop: 8,
                      ...Fonts.blackColor14Medium,
                      textAlign: 'center'
                    }}
                    numberOfLines={2}
                  >
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