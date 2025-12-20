import React, { useState, useEffect, useRef } from "react";
import { Dimensions, View, TouchableOpacity, FlatList, Image, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel-v4';
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get('window');

const itemWidth = Math.round(width * 0.76);

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

const categoryBannerSliderList = [
    {
        bannerImage: require('../../assets/images/category_page_slider/category_page_slider_1.jpg')
    },
    {
        bannerImage: require('../../assets/images/category_page_slider/category_page_slider_2.jpg')
    },
];

const exploreCategoriesList = [
    {
        id: '1',
        categoryImage: require('../../assets/images/category_explore_category/category_explore_category_1.jpg')
    },
    {
        id: '2',
        categoryImage: require('../../assets/images/category_explore_category/category_explore_category_2.jpg')
    },
    {
        id: '3',
        categoryImage: require('../../assets/images/category_explore_category/category_explore_category_3.jpg')
    },
    {
        id: '4',
        categoryImage: require('../../assets/images/category_explore_category/category_explore_category_4.jpg')
    },
    {
        id: '5',
        categoryImage: require('../../assets/images/category_explore_category/category_explore_category_5.jpg')
    },
    {
        id: '6',
        categoryImage: require('../../assets/images/category_explore_category/category_explore_category_6.jpg')
    },
];

const spotlightProductsList = [
    {
        id: '1',
        spotlightProductImage: require('../../assets/images/in_the_spotlight/in_the_spotlight_1.jpg')
    },
    {
        id: '2',
        spotlightProductImage: require('../../assets/images/in_the_spotlight/in_the_spotlight_2.jpg')
    },
];

const exploreBrandsList = [
    {
        id: '1',
        brandImage: require('../../assets/images/explore_brands/explore_brands_1.jpg')
    },
    {
        id: '2',
        brandImage: require('../../assets/images/explore_brands/explore_brands_2.jpg')
    },
    {
        id: '3',
        brandImage: require('../../assets/images/explore_brands/explore_brands_3.jpg')
    },
    {
        id: '4',
        brandImage: require('../../assets/images/explore_brands/explore_brands_4.jpg')
    },
    {
        id: '5',
        brandImage: require('../../assets/images/explore_brands/explore_brands_5.jpg')
    },
    {
        id: '6',
        brandImage: require('../../assets/images/explore_brands/explore_brands_6.jpg')
    },
    {
        id: '7',
        brandImage: require('../../assets/images/explore_brands/explore_brands_7.jpg')
    },
    {
        id: '8',
        brandImage: require('../../assets/images/explore_brands/explore_brands_8.jpg')
    },
    {
        id: '9',
        brandImage: require('../../assets/images/explore_brands/explore_brands_9.jpg')
    },
];

const kidsApparelsList = [
    {
        id: '1',
        kidsApparelsImage: require('../../assets/images/kids_apparels/kids_apparels_1.jpg')
    },
    {
        id: '2',
        kidsApparelsImage: require('../../assets/images/kids_apparels/kids_apparels_2.jpg')
    },
];

const CategoryDetailScreen = () => {

    const navigation = useNavigation();

    const categoryBannerRef = useRef();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            categoryBannerRef.current.startAutoplay();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            categoryBannerRef.current.stopAutoplay();
        });
        return unsubscribe;
    }, [navigation]);

    const [categoryBannerSliderData, setCategoryBannerSliderData] = useState(categoryBannerSliderList);
    const [activeSlide, setActiveSlide] = useState(0);
    const [loopType, setLoopType] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoopType(true);
        }, 1000);
        return () => {
            clearTimeout(timer);
        }
    }, [])

    return (
        <View style={{ flex: 1, backgroundColor: Colors.backColor }}>
            <MyStatusBar />
            <View style={{ flex: 1, }}>
                {header()}
                <FlatList
                    ListHeaderComponent={
                        <>
                            {safetyCheckList()}
                            {bannerSlider()}
                            {exploreCategories()}
                            {spotlightProducts()}
                            {exploreBrands()}
                            {kidsApparels()}
                        </>
                    }
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding + 5.0, }}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    )

    function kidsApparels() {

        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('products/productsScreen')}
            >
                <Image
                    source={item.kidsApparelsImage}
                    style={styles.kidsApparelsImageStyle}
                    resizeMode="cover"
                />
            </TouchableOpacity>
        )
        return (
            <View>
                <Text style={styles.kidsApparelsTextStyle}>
                    KIDS APPARELS
                </Text>
                <FlatList
                    horizontal
                    data={kidsApparelsList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingLeft: Sizes.fixPadding }}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    function exploreBrands() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('products/productsScreen')}
            >
                <Image
                    source={item.brandImage}
                    style={{
                        height: 150.0,
                        width: width / 3.35,
                        marginHorizontal: Sizes.fixPadding - 5.0,
                        marginBottom: Sizes.fixPadding,
                    }}
                    resizeMode="stretch"
                />
            </TouchableOpacity>
        )
        return (
            <View>
                <Text style={styles.exploreBrandsTextStyle}>
                    EXPLORE BRANDS
                </Text>
                <FlatList
                    listKey={`brandList`}
                    data={exploreBrandsList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    numColumns={3}
                    scrollEnabled={false}
                    contentContainerStyle={{ backgroundColor: 'red' }}
                    columnWrapperStyle={{
                        paddingHorizontal: Sizes.fixPadding - 5.0,
                        flexDirection: 'row',
                    }}
                />
            </View>
        )
    }

    function spotlightProducts() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('products/productsScreen')}
            >
                <Image
                    source={item.spotlightProductImage}
                    style={styles.spotlightProductImageStyle}
                    resizeMode="stretch"
                />
            </TouchableOpacity>
        )
        return (
            <View>
                <Text style={styles.inTheSpotlightTextStyle}>
                    IN THE SPOTLIGHT
                </Text>
                <FlatList
                    horizontal
                    data={spotlightProductsList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingLeft: Sizes.fixPadding }}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    function exploreCategories() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('products/productsScreen')}
            >
                <Image
                    source={item.categoryImage}
                    style={styles.exploreCategoriesImageStyle}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        )
        return (
            <View>
                <Text style={styles.exploreCategoriesTextStyle}>
                    EXPLORE CATEGORY
                </Text>
                <FlatList
                    listKey={`categoryList`}
                    data={exploreCategoriesList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    scrollEnabled={false}
                    numColumns={3}
                    columnWrapperStyle={{
                        paddingHorizontal: Sizes.fixPadding - 5.0,
                        flexDirection: 'row',
                    }}
                />
            </View>
        )
    }

    function bannerSlider() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('products/productsScreen')}
            >
                <Image
                    source={item.bannerImage}
                    style={{
                        width: width - 100,
                        height: 250,
                    }}
                    resizeMode="contain"
                />
            </TouchableOpacity>
        )

        return (
            <View style={{ backgroundColor: Colors.whiteColor, paddingTop: Sizes.fixPadding - 7.0 }}>
                <Carousel
                    ref={categoryBannerRef}
                    data={categoryBannerSliderData}
                    sliderWidth={width}
                    itemWidth={itemWidth}
                    loop={loopType}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    onSnapToItem={(index) => setActiveSlide(index)}
                    inactiveSlideOpacity={1}
                />
            </View>
        )
    }

    function safetyCheckList() {

        const renderItem = ({ item }) => (
            <Image
                source={item.safetyImage}
                style={{
                    width: width - 120,
                    height: 80,
                    marginRight: Sizes.fixPadding,
                }}
                resizeMode="contain"
            />
        )
        return (
            <View>
                <FlatList
                    horizontal
                    data={safetyCheckListData}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{
                        paddingLeft: Sizes.fixPadding,
                        paddingVertical: Sizes.fixPadding
                    }}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 2.0,
                }}>
                    <MaterialIcons
                        name="arrow-back"
                        size={25}
                        color="black"
                        style={{ marginRight: Sizes.fixPadding + 5.0 }}
                        onPress={() => navigation.pop()}
                    />
                    <Text style={{ ...Fonts.alatsiBlack18Regular }}>
                        STYLO
                    </Text>
                </View>

                <View style={styles.headerIconsWrapStyle}>
                    <MaterialIcons
                        name="search"
                        color={Colors.blackColor}
                        size={25}
                        onPress={() => navigation.push('search/searchScreen')}
                    />
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.push('wishlist/wishlistScreen')}
                    >
                        <MaterialIcons
                            name="favorite-border"
                            color={Colors.blackColor}
                            size={25}
                        />
                        <View style={styles.favoritsAndShoppingsCountStyle}>
                            <Text style={{ ...Fonts.whiteColor12Medium }}>
                                2
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.push('bag/bagScreen')}
                    >
                        <FontAwesome5
                            name="shopping-bag"
                            size={24}
                            color={Colors.blackColor}
                        />
                        <View style={styles.favoritsAndShoppingsCountStyle}>
                            <Text style={{ ...Fonts.whiteColor12Medium }}>
                                3
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: Sizes.fixPadding * 2.0,
        paddingRight: Sizes.fixPadding + 1.0,
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding + 5.0,
        elevation: 2.0,
        ...CommonStyles.shadow
    },
    favoritsAndShoppingsCountStyle: {
        position: 'absolute',
        right: -10.0,
        top: -5.0,
        width: 18.0, height: 18.0,
        borderRadius: 9.0,
        backgroundColor: Colors.redColor,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIconsWrapStyle: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    exploreCategoriesImageStyle: {
        height: 160.0,
        marginHorizontal: Sizes.fixPadding - 5.0,
        width: width / 3.34,
        marginBottom: Sizes.fixPadding - 5.0,
        alignSelf: 'center',
    },
    exploreCategoriesTextStyle: {
        marginTop: Sizes.fixPadding - 5.0,
        marginBottom: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding,
        ...Fonts.blackColor15SemiBold
    },
    spotlightProductImageStyle: {
        width: 230,
        height: 290,
        borderColor: '#e0e0e0',
        borderWidth: 2.0,
        marginRight: Sizes.fixPadding - 3.0,
    },
    inTheSpotlightTextStyle: {
        marginTop: Sizes.fixPadding + 5.0,
        marginBottom: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding,
        ...Fonts.blackColor15SemiBold
    },
    exploreBrandsTextStyle: {
        marginTop: Sizes.fixPadding + 5.0,
        marginBottom: Sizes.fixPadding + 2.0,
        marginHorizontal: Sizes.fixPadding,
        ...Fonts.blackColor15SemiBold
    },
    kidsApparelsTextStyle: {
        marginTop: Sizes.fixPadding + 5.0,
        marginBottom: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding,
        ...Fonts.blackColor15SemiBold
    },
    kidsApparelsImageStyle: {
        width: 230,
        height: 290,
        borderColor: '#e0e0e0',
        borderWidth: 2.0,
        marginRight: Sizes.fixPadding - 3.0,
    },
})

export default CategoryDetailScreen;