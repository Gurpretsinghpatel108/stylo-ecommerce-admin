import React, { useRef, useState, useEffect } from "react";
import { View, FlatList, Modal, ImageBackground, Dimensions, Image, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import Carousel, { Pagination } from 'react-native-snap-carousel-v4';
import { LinearGradient } from 'expo-linear-gradient';
import AllProductsList from "../../components/products/products";
import { Snackbar } from 'react-native-paper';
import MyStatusBar from "../../components/myStatusBar";
import { useLocalSearchParams, useNavigation } from "expo-router";

const { width, height } = Dimensions.get('window');

const ProductDetailScreen = () => {

    const navigation = useNavigation();

    var { item } = useLocalSearchParams();
    item = JSON.parse(item);

    const itemRef = useRef();

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            itemRef.current.startAutoplay();
        });
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('blur', () => {
            itemRef.current.stopAutoplay();
        });
        return unsubscribe;
    }, [navigation]);

    let description = 'Slip into this trendy and attractive dress from Rudraaksha and look stylish effortlessly. Made to accentuate any body type, it will give you that extra oomph and make you stand out wherever you are. Keep the accessories minimal for that added elegant look, just your favorite heels and dangling earrings, and of course, don\'t forget your pretty smile!'

    const [productImages, setProductImages] = useState([
        {
            productImage: item.productImage,
        },
        {
            productImage: item.productImage,
        },
        {
            productImage: item.productImage,
        },
        {
            productImage: item.productImage,
        },
        {
            productImage: item.productImage,
        },
    ]);
    const [activeSlide, setActiveSlide] = useState(0);
    const [selectedProductSize, setSelectedProductSize] = useState(null);
    const [selectedProductColor, setSelectedProductColor] = useState(null);
    const [showProductDescriptionSheet, setShowProductDescriptionSheet] = useState(false);
    const [isInFavorite, setIsInFavorite] = useState(false);
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [bagItemCount, setBagItemCount] = useState(3);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.backColor }}>
            <MyStatusBar />
            <View style={{ flex: 1, }}>
                {header()}
                <FlatList
                    ListHeaderComponent={
                        <>
                            {productImagesSlider()}
                            {divider()}
                            {productNamePriceAndRatingInfo()}
                            {productSizeAndColorInfo()}
                            {productDetails()}
                            {productDescriptionInfo()}
                            {similarProductInfo()}
                        </>
                    }
                    showsVerticalScrollIndicator={false}
                />
            </View>
            {addToBagAndBuyNowButton()}
            {productDescrptionBottomSheet()}
            {snackBarInfo()}
        </View>
    )

    function snackBarInfo() {
        return (
            <Snackbar
                style={styles.snackBarStyle}
                elevation={0}
                visible={showSnackBar}
                onDismiss={() => setShowSnackBar(false)}
            >
                {
                    isInFavorite
                        ?
                        `Added to Wishlist`
                        :
                        `Remove from Wishlist`
                }
            </Snackbar>
        )
    }

    function addToBagAndBuyNowButton() {
        return (
            <View style={styles.addToBagAndByNowButtonWrapStyle}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setBagItemCount(bagItemCount + 1)}
                    style={{
                        backgroundColor: Colors.whiteColor,
                        ...styles.addToBagAndByNowButtonStyle,
                    }}
                >
                    <Text style={{ ...Fonts.blackColor15Bold }}>
                        ADD TO BAG
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.push('delivery/deliveryScreen')}
                    style={{
                        backgroundColor: Colors.primaryColor,
                        ...styles.addToBagAndByNowButtonStyle
                    }}
                >
                    <Text style={{ ...Fonts.whiteColor15Bold }}>
                        BUY NOW
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    function productDescrptionBottomSheet() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showProductDescriptionSheet}
                onRequestClose={() => { setShowProductDescriptionSheet(false) }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => { setShowProductDescriptionSheet(false) }}
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <View style={{ justifyContent: "flex-end", flex: 1 }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                            style={{ backgroundColor: Colors.whiteColor }}
                        >
                            <View style={styles.bottomSheetWrapStyle}>
                                <Text style={{ textAlign: 'center', ...Fonts.blackColor16Bold }}>
                                    Product Description
                                </Text>
                                <View style={styles.bottomSheetDividerStyle}
                                />
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <Text style={{
                                        lineHeight: 18.0,
                                        marginBottom: Sizes.fixPadding - 5.0,
                                        ...Fonts.blackColor12Medium
                                    }}>
                                        {description}
                                    </Text>
                                </ScrollView>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    function similarProductInfo() {

        const renderItem = ({ item }) => (
            <View
                style={{
                    borderColor: '#e0e0e0',
                    ...styles.productsWrapStyle,
                    marginRight: Sizes.fixPadding,
                }}
            >
                <Image
                    source={item.productImage}
                    style={{
                        height: 230.0,
                        width: 160,
                        marginBottom: Sizes.fixPadding - 5.0,
                    }}
                />
                <Text numberOfLines={1} style={{ ...Fonts.blackColor13SemiBold }}>
                    {item.productTitle}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ ...Fonts.blackColor15SemiBold }}>
                        {`$`}{item.price}
                    </Text>
                    <Text style={{
                        marginHorizontal: Sizes.fixPadding - 5.0,
                        textDecorationLine: 'line-through',
                        ...Fonts.lightGrayColor12Medium
                    }}>
                        {`$`}{item.oldPrice}
                    </Text>

                </View>
                <Text style={{ ...Fonts.greenColor12Medium }}>
                    {item.offer}
                </Text>
            </View>
        )

        return (
            <View style={{
                backgroundColor: Colors.whiteColor,
                padding: Sizes.fixPadding,
            }}>
                <Text style={{ marginBottom: Sizes.fixPadding, ...Fonts.blackColor17SemiBold }}>
                    SIMILAR PRODUCTS
                </Text>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={AllProductsList}
                    keyExtractor={(item) => `${item.uniqueId}`}
                    renderItem={renderItem}
                />
            </View>
        )
    }

    function productDescriptionInfo() {
        return (
            <View
                style={{
                    backgroundColor: Colors.whiteColor,
                    padding: Sizes.fixPadding,
                    marginVertical: Sizes.fixPadding - 5.0,
                }}
            >
                <Text style={{ ...Fonts.blackColor17SemiBold }}>
                    PRODUCT DESCRIPTION
                </Text>
                <Text
                    numberOfLines={5}
                    style={{
                        lineHeight: 18.0,
                        marginTop: Sizes.fixPadding,
                        ...Fonts.blackColor12Medium,
                    }}>
                    {description}
                </Text>
                <View
                    style={{
                        backgroundColor: '#ececec',
                        height: 1.0,
                        marginVertical: Sizes.fixPadding - 4.0,
                    }}
                />
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setShowProductDescriptionSheet(true)}
                >
                    <Text style={{
                        marginBottom: Sizes.fixPadding - 4.0,
                        textAlign: 'center', ...Fonts.primaryColor14SemiBold
                    }}>
                        View More
                    </Text>
                </TouchableOpacity>
                <View
                    style={{
                        backgroundColor: '#ececec',
                        height: 1.0,
                    }}
                />
            </View>
        )
    }

    function productDetails() {
        return (
            <View style={styles.productDetailWrapStyle}>
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor17SemiBold }}>
                    PRODUCT DETAILS
                </Text>
                {productDetailShort({
                    title: 'Color',
                    value: 'Yellow'
                })}
                {productDetailShort({
                    title: 'Length',
                    value: 'Knee Length'
                })}
                {productDetailShort({
                    title: 'Type',
                    value: 'Bandage'
                })}
                {productDetailShort({
                    title: 'Sleeve',
                    value: 'Cap Sleeve'
                })}
            </View>
        )
    }

    function productDetailShort({ title, value }) {
        return (
            <View style={{
                flexDirection: 'row',
                marginBottom: Sizes.fixPadding - 5.0,
                alignItems: 'center',
            }}>
                <Text style={{ flex: 1, ...Fonts.lightGrayColor15SemiBold }}>
                    {title}
                </Text>
                <Text
                    numberOfLines={1}
                    style={{ flex: 1, ...Fonts.blackColor15Medium }}
                >
                    {value}
                </Text>
            </View>
        )
    }

    function productSizeAndColorInfo() {
        return (
            <View style={{
                backgroundColor: Colors.whiteColor,
                marginVertical: Sizes.fixPadding - 5.0,
                padding: Sizes.fixPadding,
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.blackColor17SemiBold }}>
                        SIZE
                    </Text>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.push('sizeChart/sizeChartScreen')}
                        style={styles.sizeChartButtonStyle}
                    >
                        <Text style={{ ...Fonts.primaryColor13SemiBold }}>
                            SIZE CHART
                        </Text>
                    </TouchableOpacity>
                </View>
                <Text style={{ marginVertical: Sizes.fixPadding - 5.0, ...Fonts.blackColor11Medium }}>
                    Tip:For the best fit,buy one size larger than your usual size.
                </Text>
                <View style={styles.productSizesInfoWrapStyle}>
                    {productSize({ size: 'XS' })}
                    {productSize({ size: 'S' })}
                    {productSize({ size: 'M' })}
                    {productSize({ size: 'L' })}
                </View>
                <View style={{
                    backgroundColor: '#ececec',
                    height: 1.0,
                    marginVertical: Sizes.fixPadding,
                }} />
                <Text style={{ ...Fonts.blackColor17SemiBold }}>
                    COLOR
                </Text>
                <View style={{
                    flexDirection: 'row',
                    alignItems: "center",
                    justifyContent: 'space-evenly'
                }}>
                    {productColor({ color: Colors.blackColor })}
                    {productColor({ color: Colors.primaryColor })}
                    {productColor({ color: Colors.blueColor })}
                </View>
            </View>
        )
    }

    function productColor({ color }) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setSelectedProductColor(color)}
                style={{
                    ...styles.productColorWrapStyle,
                    backgroundColor: color,
                    borderColor: selectedProductColor == color ? Colors.primaryColor : 'transparent',
                }}>
                {
                    selectedProductColor == color
                        ?
                        <MaterialIcons
                            name="check"
                            color={Colors.whiteColor}
                            size={26}
                        />
                        :
                        null
                }
            </TouchableOpacity>
        )
    }

    function productSize({ size }) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setSelectedProductSize(size)}
                style={{
                    backgroundColor: selectedProductSize == size ? Colors.primaryColor : Colors.whiteColor,
                    borderColor: '#e0e0e0',
                    ...styles.sizesWrapStyle,
                }}>
                <Text style={
                    selectedProductSize == size
                        ?
                        { ...Fonts.whiteColor13Bold }
                        :
                        { ...Fonts.blackColor13Bold }
                }>
                    {size}
                </Text>
            </TouchableOpacity>
        )
    }

    function divider() {
        return (
            <View style={{ backgroundColor: Colors.whiteColor }}>
                <View style={{
                    backgroundColor: '#e0e0e0',
                    height: 1.0,
                    marginTop: Sizes.fixPadding,
                    marginBottom: Sizes.fixPadding + 3.0,
                }} />
            </View>
        )
    }

    function productNamePriceAndRatingInfo() {
        return (
            <View style={{
                backgroundColor: Colors.whiteColor,
                paddingHorizontal: Sizes.fixPadding,
            }}>
                <Text style={{ ...Fonts.blackColor17SemiBold }}>
                    {item.productTitle}
                </Text>
                <View style={styles.specialPriceTextWrapStyle}>
                    <Text style={{ ...Fonts.primaryColor11Medium }}>
                        Special Price
                    </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Text style={{ ...Fonts.blackColor17SemiBold }}>
                        {`$`}{item.price}
                    </Text>
                    <Text style={{ marginHorizontal: Sizes.fixPadding, textDecorationLine: "line-through", ...Fonts.lightGrayColor14Medium }}>
                        {`$`}{item.oldPrice}
                    </Text>
                    <Text style={{ ...Fonts.primaryColor14Medium }}>
                        ₹{item.offer}
                    </Text>
                </View>
                <View style={{ marginVertical: Sizes.fixPadding, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.ratingWrapStyle}>
                        <Text style={{ ...Fonts.whiteColor12Medium }}>
                            4.3
                        </Text>
                        <MaterialIcons
                            name="star"
                            color={Colors.whiteColor}
                            size={15}
                            style={{ marginLeft: Sizes.fixPadding - 5.0, }}
                        />
                    </View>
                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.lightGrayColor13Medium }}>
                        2814 ratings
                    </Text>
                </View>
            </View >
        )
    }

    function _renderItem({ item, index }) {
        return (
            <View style={{
                backgroundColor: Colors.whiteColor,
                width: width,
                height: 410.0,
            }}>
                <ImageBackground
                    source={item.productImage}
                    style={{
                        width: width - 100,
                        height: 410.0,
                        alignSelf: 'center'
                    }}
                    resizeMode="cover"
                >
                    <LinearGradient
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0, y: 1 }}
                        colors={[
                            'transparent',
                            'transparent',
                            'transparent',
                            'transparent',
                            'transparent',
                            'rgba(255,255,255,0.99)',
                        ]}
                        style={{
                            width: width - 100,
                            height: 410.0,
                            alignSelf: 'center'
                        }}
                    >
                    </LinearGradient>
                </ImageBackground>
            </View>
        )
    }

    function productImagesSlider() {
        return (
            <View>
                <Carousel
                    ref={itemRef}
                    data={productImages}
                    sliderWidth={width}
                    autoplayInterval={4000}
                    itemWidth={width}
                    renderItem={_renderItem}
                    onSnapToItem={(index) => setActiveSlide(index)}
                />
                {pagination()}
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        setIsInFavorite(!isInFavorite)
                        setShowSnackBar(true)
                        setTimeout(() => {
                            setShowSnackBar(false)
                        }, 3000)
                    }}
                    style={styles.favoriteIconWrapStyle}
                >
                    <MaterialIcons
                        name={isInFavorite ? "favorite" : "favorite-border"}
                        color={isInFavorite ? Colors.primaryColor : Colors.lightGrayColor}
                        size={30}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function pagination() {
        return (
            <Pagination
                dotsLength={productImages.length}
                activeDotIndex={activeSlide}
                containerStyle={styles.sliderPaginationWrapStyle}
                dotStyle={styles.sliderActiveDotStyle}
                inactiveDotStyle={styles.sliderInactiveDotStyle}
            />
        );
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <View style={styles.backArrowAndProductTitleWrapStyle}>
                    <MaterialIcons
                        name="arrow-back"
                        size={25}
                        color="black"
                        style={{ marginRight: Sizes.fixPadding + 5.0 }}
                        onPress={() => navigation.pop()}
                    />
                    <Text numberOfLines={1} style={{ flex: 1, ...Fonts.blackColor18Bold }}>
                        {item.productTitle}
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
                                {bagItemCount}
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
    backArrowAndProductTitleWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 2.0,
        marginRight: Sizes.fixPadding + 10.0,
    },
    sliderActiveDotStyle: {
        width: 11,
        height: 11,
        borderRadius: 5.5,
        backgroundColor: Colors.blueColor,
        marginHorizontal: Sizes.fixPadding - 18.0
    },
    sliderInactiveDotStyle: {
        width: 12,
        height: 12,
        borderRadius: 6.0,
        backgroundColor: Colors.grayColor
    },
    sliderPaginationWrapStyle: {
        position: 'absolute',
        bottom: -20.0,
        left: 0.0,
        right: 0.0,
    },
    sizesWrapStyle: {
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding,
        width: 50.0,
        height: 35.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ratingWrapStyle: {
        flexDirection: 'row',
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding - 1.0,
        paddingHorizontal: Sizes.fixPadding - 3.0,
        alignItems: 'center',
        elevation: 10.0,
    },
    specialPriceTextWrapStyle: {
        backgroundColor: '#EEEEEE',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: Sizes.fixPadding - 5.0,
        paddingVertical: Sizes.fixPadding - 8.0,
        borderRadius: Sizes.fixPadding - 5.0,
        marginVertical: Sizes.fixPadding - 3.0,
    },
    sizeChartButtonStyle: {
        borderColor: Colors.lightGrayColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 5.0,
    },
    productSizesInfoWrapStyle: {
        marginTop: Sizes.fixPadding - 5.0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly'
    },
    productColorWrapStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 50.0,
        height: 50.0,
        borderRadius: 25.0,
        borderWidth: 2.0,
    },
    productDetailWrapStyle: {
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: Sizes.fixPadding,
        paddingTop: Sizes.fixPadding,
        paddingBottom: Sizes.fixPadding - 5.0
    },
    productsWrapStyle: {
        alignItems: 'center',
        paddingBottom: Sizes.fixPadding * 3.0,
        paddingTop: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        borderWidth: 2.0,
        elevation: 1.0,
    },
    bottomSheetWrapStyle: {
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        maxHeight: height - 120
    },
    bottomSheetDividerStyle: {
        backgroundColor: '#e0e0e0',
        height: 1.0,
        marginVertical: Sizes.fixPadding,
    },
    addToBagAndByNowButtonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: Sizes.fixPadding + 5.0
    },
    addToBagAndByNowButtonWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopColor: '#ececec',
        borderTopWidth: 1.0,
    },
    favoriteIconWrapStyle: {
        position: 'absolute',
        right: 20.0,
        top: 20.0,
        width: 60.0,
        height: 60.0,
        backgroundColor: Colors.whiteColor,
        elevation: 4.0,
        borderRadius: 30.0,
        alignItems: 'center',
        justifyContent: 'center',
        ...CommonStyles.shadow
    },
    snackBarStyle: {
        position: 'absolute',
        bottom: 40.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333',
    }
})

export default ProductDetailScreen;