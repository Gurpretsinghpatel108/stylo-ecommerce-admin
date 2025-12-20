import React, { useState, useRef } from "react";
import { Animated, Image, TouchableOpacity, Dimensions, View, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Snackbar } from 'react-native-paper';
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get('window');

const bagsData = [
    {
        key: '1',
        productImage: require('../../assets/images/products/product_20.jpg'),
        productTitle: 'Solid Round Neck T-shirt',
        productPrice: 59,
        productSize: 'L',
    },
    {
        key: '2',
        productImage: require('../../assets/images/products/product_2.jpg'),
        productTitle: 'Men Slim Fit Casual Shirt',
        productPrice: 25,
        productSize: 'M',
    },
    {
        key: '3',
        productImage: require('../../assets/images/products/product_17.jpg'),
        productTitle: 'Solid Shirt Style Top',
        productPrice: 30,
        productSize: 'L',
    },
];

const rowTranslateAnimatedValues = {};

const BagScreen = () => {

    const navigation = useNavigation();

    const [showSnackBar, setShowSnackBar] = useState(false);

    const [listData, setListData] = useState(bagsData);

    Array(listData.length + 1)
        .fill('')
        .forEach((_, i) => {
            rowTranslateAnimatedValues[`${i}`] = new Animated.Value(1);
        });

    const animationIsRunning = useRef(false);

    const onSwipeValueChange = swipeData => {

        const { key, value } = swipeData;

        if ((value < -width || value > width) && !animationIsRunning.current) {
            animationIsRunning.current = true;
            Animated.timing(rowTranslateAnimatedValues[key], {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }).start(() => {

                const newData = [...listData];
                const prevIndex = listData.findIndex(item => item.key === key);
                newData.splice(prevIndex, 1);

                setListData(newData);

                setShowSnackBar(true);

                animationIsRunning.current = false;
            });
        }
    };

    function updateBags({ key }) {
        const newList = listData.filter((product) => product.key != key)
        setListData(newList);
        setShowSnackBar(true);
    }

    const renderItem = data => (
        <Animated.View
            style={[
                {
                    height: rowTranslateAnimatedValues[
                        data.item.key
                    ].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 170],
                    }),
                },
            ]}
        >
            <View style={{ flex: 1, backgroundColor: Colors.backColor }}>
                <View style={styles.productWrapStyle}>
                    <Image
                        source={data.item.productImage}
                        style={styles.productImageStyle}
                    />
                    <View style={{ marginVertical: Sizes.fixPadding, marginLeft: Sizes.fixPadding, }}>
                        <Text style={{
                            maxWidth: width - 150,
                            ...Fonts.blackColor15SemiBold
                        }}>
                            {data.item.productTitle}
                        </Text>
                        <View style={{ marginVertical: Sizes.fixPadding - 2.0, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ marginRight: Sizes.fixPadding, ...Fonts.lightGrayColor13Medium }}>
                                Price:
                            </Text>
                            <Text style={{ ...Fonts.blueColor13SemiBold }}>
                                {`$`}{data.item.productPrice}
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ ...Fonts.lightGrayColor13Medium }}>
                                Size:
                            </Text>
                            <Text style={{ marginHorizontal: Sizes.fixPadding, ...Fonts.blueColor13SemiBold }}>
                                {data.item.productSize}
                            </Text>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => updateBags({ key: data.item.key })}
                                style={styles.removeButtonStyle}
                            >
                                <Text style={{ ...Fonts.whiteColor12SemiBold }}>
                                    Remove
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Animated.View>
    );

    const renderHiddenItem = () => (
        <View style={styles.rowBack}>
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: Colors.backColor }}>
            <MyStatusBar />
            <View style={{ flex: 1, }}>
                {header()}
                <View style={{ flex: 1, backgroundColor: Colors.backColor }}>
                    {listData.length == 0 ?
                        <>
                            {bagEmptyInfo()}
                        </>
                        :
                        <SwipeListView
                            data={listData}
                            renderItem={renderItem}
                            renderHiddenItem={renderHiddenItem}
                            rightOpenValue={-width}
                            leftOpenValue={width}
                            onSwipeValueChange={onSwipeValueChange}
                            useNativeDriver={false}
                        />
                    }
                    {totalPriceAndPayButton()}
                    <Snackbar
                        style={styles.snackBarStyle}
                        visible={showSnackBar}
                        onDismiss={() => setShowSnackBar(false)}
                        elevation={0}
                    >
                        <Text style={{ ...Fonts.whiteColor12Medium }}>
                            Item Removed
                        </Text>
                    </Snackbar>
                </View>
            </View>
        </View>
    );

    function bagEmptyInfo() {
        return (
            <View style={styles.noBagsItemsWrapStyle}>
                <Image
                    source={(require('../../assets/images/empty_bag.png'))}
                    style={{ width: 150.0, height: 150.0, }}
                    resizeMode="contain"
                />
                <Text style={{ ...Fonts.blackColor18Bold }}>
                    Hey, it feels so light!
                </Text>
                <Text style={styles.nothingInBagTextStyle}>
                    {`There is nothing in your bag.Let's add some items.`}
                </Text>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.push('drawer')}
                    style={styles.addItemsToBagButtonStyle}
                >
                    <Text style={{ ...Fonts.primaryColor16Bold }}>
                        ADD ITEMS TO BAG
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    function totalPriceAndPayButton() {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
            }}>
                <View style={styles.totalPriceButtonStyle}>
                    <Text style={{ marginRight: Sizes.fixPadding, ...Fonts.blackColor13Bold }}>
                        TOTAL:
                    </Text>
                    <Text style={{ ...Fonts.primaryColor14Bold }}>
                        {`$`}{listData.reduce((s, { productPrice }) => s + productPrice, 0)}
                    </Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => listData.length != 0 ? navigation.push('delivery/deliveryScreen') : null}
                    style={{
                        ...styles.payNowButtonStyle,
                        backgroundColor: listData.length == 0 ? Colors.lightGrayColor : Colors.primaryColor,
                    }}
                >
                    <Text style={{ ...Fonts.whiteColor14Bold }}>
                        PAY NOW
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons
                    name="arrow-back"
                    color={Colors.blackColor}
                    size={25}
                    onPress={() => navigation.pop()}
                />
                <Text style={{ marginLeft: Sizes.fixPadding + 5.0, ...Fonts.blackColor18Bold }}>
                    MY BAG
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        elevation: 2.0,
        ...CommonStyles.shadow
    },
    productWrapStyle: {
        backgroundColor: Colors.whiteColor,
        flexDirection: 'row',
        marginHorizontal: Sizes.fixPadding - 5.0,
        elevation: 2.0,
        borderRadius: Sizes.fixPadding - 5.0,
        marginVertical: Sizes.fixPadding - 5.0,
        ...CommonStyles.shadow
    },
    productImageStyle: {
        height: 160.0,
        width: 120.0,
        borderTopLeftRadius: Sizes.fixPadding - 5.0,
        borderBottomLeftRadius: Sizes.fixPadding - 5.0
    },
    removeButtonStyle: {
        backgroundColor: '#9E9E9E',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: Sizes.fixPadding - 6.0,
        paddingVertical: Sizes.fixPadding - 7.0,
    },
    addItemsToBagButtonStyle: {
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center', justifyContent: 'center',
        paddingVertical: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding * 2.0,
    },
    snackBarStyle: {
        position: 'absolute',
        bottom: 40.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333',
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: Colors.primaryColor,
        flex: 1,
        marginVertical: Sizes.fixPadding - 5.0
    },
    noBagsItemsWrapStyle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.backColor
    },
    totalPriceButtonStyle: {
        flex: 1,
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding + 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    payNowButtonStyle: {
        flex: 1,
        paddingVertical: Sizes.fixPadding + 5.0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nothingInBagTextStyle: {
        marginTop: Sizes.fixPadding - 5.0,
        marginBottom: Sizes.fixPadding + 3.0,
        textAlign: 'center',
        ...Fonts.lightGrayColor13Medium
    }
})

export default BagScreen;