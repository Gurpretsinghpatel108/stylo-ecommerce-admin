import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const pricesList = [
    {
        id: '1',
        isSelected: false,
        discount: '$49 and below',
    },
    {
        id: '2',
        isSelected: false,
        discount: '$50 to Rs.$99',
    },
    {
        id: '3',
        isSelected: false,
        discount: '$100 and above',
    }
];

const brandsList = [
    {
        id: '1',
        isSelected: false,
        brand: 'Calvin Klein'
    },
    {
        id: '2',
        isSelected: false,
        brand: 'Nike'
    },
    {
        id: '3',
        isSelected: false,
        brand: 'Puma'
    },
];

const occasionList = [
    {
        id: '1',
        occasion: 'Casual',
        isSelected: false,
    },
    {
        id: '2',
        occasion: 'Party & Festive',
        isSelected: false,
    },
    {
        id: '3',
        occasion: 'Wedding',
        isSelected: false,
    }
];

const FilterScreen = () => {

    const navigation = useNavigation();

    const [prices, setPrices] = useState(pricesList);
    const [brands, setBrands] = useState(brandsList);
    const [occasions, setOccasions] = useState(occasionList);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.backColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {priceInfo()}
                    {brandInfo()}
                    {occasionInfo()}
                </ScrollView>
                {cancelAndApplyButton()}
            </View>
        </View>
    )

    function cancelAndApplyButton() {
        return (
            <View style={styles.cancelAndApplyButtonWrapStyle}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.pop()}
                    style={{
                        backgroundColor: Colors.whiteColor,
                        ...styles.cancelAndApplyButtonStyle,
                    }}
                >
                    <Text style={{ ...Fonts.blackColor15Bold }}>
                        CANCEL
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.pop()}
                    style={{
                        backgroundColor: Colors.primaryColor,
                        ...styles.cancelAndApplyButtonStyle
                    }}
                >
                    <Text style={{ ...Fonts.whiteColor15Bold }}>
                        APPLY
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    function occasionInfo() {
        return (
            <View>
                {divider()}
                <Text style={{
                    paddingVertical: Sizes.fixPadding,
                    ...Fonts.blackColor15SemiBold,
                    textAlign: 'center'
                }}>
                    OCCASION
                </Text>
                {divider()}
                {occasions.map((item, index) => (
                    <View key={`${item.id}`}>
                        <View style={{
                            marginTop: index == 0 ? Sizes.fixPadding + 5.0 : 0.0,
                            ...styles.chackBoxWithTextWrapStyle,
                        }}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => { toggleOccasionCheck({ id: item.id }) }}
                                style={{
                                    ...styles.checkBoxStyle,
                                    backgroundColor: item.isSelected ? Colors.primaryColor : Colors.whiteColor,
                                    borderColor: item.isSelected ? Colors.primaryColor : Colors.lightGrayColor,
                                }}>
                                {
                                    item.isSelected ?
                                        <MaterialIcons name="check" size={15} color={Colors.whiteColor} />
                                        :
                                        null
                                }
                            </TouchableOpacity>
                            <Text style={{
                                marginLeft: Sizes.fixPadding + 5.0,
                                ...Fonts.blackColor13Medium
                            }}>
                                {item.occasion}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        )
    }

    function brandInfo() {
        return (
            <View>
                {divider()}
                <Text style={{
                    marginVertical: Sizes.fixPadding,
                    ...Fonts.blackColor15SemiBold,
                    textAlign: 'center'
                }}>
                    BRAND
                </Text>
                {divider()}
                {brands.map((item, index) => (
                    <View key={`${item.id}`}>
                        <View style={{
                            marginTop: index == 0 ? Sizes.fixPadding + 5.0 : 0.0,
                            ...styles.chackBoxWithTextWrapStyle,
                        }}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => { toggleBrandCheck({ id: item.id }) }}
                                style={{
                                    ...styles.checkBoxStyle,
                                    backgroundColor: item.isSelected ? Colors.primaryColor : Colors.whiteColor,
                                    borderColor: item.isSelected ? Colors.primaryColor : Colors.lightGrayColor,
                                }}>
                                {
                                    item.isSelected ?
                                        <MaterialIcons name="check" size={15} color={Colors.whiteColor} />
                                        :
                                        null
                                }
                            </TouchableOpacity>
                            <Text style={{
                                marginLeft: Sizes.fixPadding + 5.0,
                                ...Fonts.blackColor13Medium
                            }}>
                                {item.brand}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        )
    }

    function priceInfo() {
        return (
            <View>
                <Text style={{
                    marginVertical: Sizes.fixPadding,
                    ...Fonts.blackColor15SemiBold,
                    textAlign: 'center',
                }}>
                    PRICE
                </Text>
                {divider()}
                {prices.map((item, index) => (
                    <View key={`${item.id}`}>
                        <View style={{
                            marginTop: index == 0 ? Sizes.fixPadding + 5.0 : 0.0,
                            ...styles.chackBoxWithTextWrapStyle,
                        }}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => { togglePricesCheck({ id: item.id }) }}
                                style={{
                                    ...styles.checkBoxStyle,
                                    backgroundColor: item.isSelected ? Colors.primaryColor : Colors.whiteColor,
                                    borderColor: item.isSelected ? Colors.primaryColor : Colors.lightGrayColor,
                                }}
                            >
                                {
                                    item.isSelected ?
                                        <MaterialIcons name="check" size={15} color={Colors.whiteColor} />
                                        :
                                        null
                                }
                            </TouchableOpacity>
                            <Text style={{
                                marginLeft: Sizes.fixPadding + 5.0,
                                ...Fonts.blackColor13Medium
                            }}>
                                {item.discount}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        )
    }

    function toggleOccasionCheck({ id }) {
        const newList = occasions.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, isSelected: !item.isSelected, };
                return updatedItem;
            }
            return item;
        });
        setOccasions(newList);
    }

    function toggleBrandCheck({ id }) {
        const newList = brands.map((brand) => {
            if (brand.id === id) {
                const updatedItem = { ...brand, isSelected: !brand.isSelected, };
                return updatedItem;
            }
            return brand;
        });
        setBrands(newList);
    }

    function togglePricesCheck({ id }) {
        const newList = prices.map((discount) => {
            if (discount.id === id) {
                const updatedItem = { ...discount, isSelected: !discount.isSelected, };
                return updatedItem;
            }
            return discount;
        });
        setPrices(newList);
    }

    function divider() {
        return (
            <View
                style={{
                    backgroundColor: '#e0e0e0',
                    height: 1.0,
                    marginHorizontal: Sizes.fixPadding - 5.0,
                }}
            />
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons
                    name="arrow-back"
                    size={24}
                    color={Colors.blackColor}
                    onPress={() => navigation.pop()}
                />
                <Text style={{ marginLeft: Sizes.fixPadding + 5.0, ...Fonts.blackColor18Bold }}>
                    FILTER
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
    checkBoxStyle: {
        height: 19.0,
        width: 19.0,
        borderWidth: 2.0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chackBoxWithTextWrapStyle: {
        flexDirection: 'row',
        marginBottom: Sizes.fixPadding + 15.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        alignItems: 'center'
    },
    cancelAndApplyButtonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        paddingVertical: Sizes.fixPadding + 5.0
    },
    cancelAndApplyButtonWrapStyle: {
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1.0,
    }
});

export default FilterScreen;