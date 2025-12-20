import React, { createRef, useState, } from "react";
import { View, Image, ScrollView, TextInput, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const popularOnAppList = [
    {
        id: '1',
        productImage: require('../../assets/images/search/search_2.jpg'),
        productBrand: 'ROADSTER',
        productType: 'Tshirts',
    },
    {
        id: '2',
        productImage: require('../../assets/images/search/search_3.jpg'),
        productBrand: 'WROGN',
        productType: 'Tshirts',
    },
    {
        id: '3',
        productImage: require('../../assets/images/search/search_4.jpg'),
        productBrand: 'ANOUK',
        productType: 'Kurtas',
    },
];

const SearchScreen = () => {

    const navigation = useNavigation();

    const textInputRef = createRef();
    const [textFieldFocus, setTextFieldFocus] = useState(null);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.backColor }}>
            <MyStatusBar />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView
                    automaticallyAdjustKeyboardInsets={true}
                    showsVerticalScrollIndicator={false}
                >
                    {moreSearchableProduct()}
                    {popularOnApp()}
                </ScrollView>
            </View>
        </View>
    )

    function popularOnApp() {
        return (
            <View style={{
                backgroundColor: Colors.whiteColor,
                paddingTop: Sizes.fixPadding,
                paddingBottom: Sizes.fixPadding + 5.0,
            }}>
                <Text style={{
                    paddingHorizontal: Sizes.fixPadding + 5.0,
                    ...Fonts.blackColor17SemiBold
                }}>
                    POPULAR ON STYLO
                </Text>
                <View
                    style={{
                        backgroundColor: '#E5E5E5',
                        marginVertical: Sizes.fixPadding + 5.0,
                        height: 1.0,
                    }}
                />
                {
                    popularOnAppList.map((item, index) => (
                        <View key={`${item.id}`}>
                            <View style={styles.popularOnAppWrapStyle}>
                                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                    <Image
                                        source={item.productImage}
                                        style={{
                                            width: 42.0,
                                            height: 42.0,
                                            borderRadius: 21.0,
                                        }}
                                    />
                                    <View style={{ marginLeft: Sizes.fixPadding + 5.0, }}>
                                        <Text style={{ ...Fonts.blackColor15SemiBold }}>
                                            {item.productBrand}
                                        </Text>
                                        <Text style={{ ...Fonts.lightGrayColor13Medium }}>
                                            {item.productType}
                                        </Text>
                                    </View>
                                </View>
                                <MaterialIcons
                                    name="keyboard-arrow-right"
                                    color={Colors.grayColor}
                                    size={24}
                                />
                            </View>
                            {
                                popularOnAppList.length - 1 == index
                                    ?
                                    null
                                    :
                                    <View
                                        style={{
                                            backgroundColor: '#E5E5E5',
                                            marginVertical: Sizes.fixPadding + 10.0,
                                            height: 1.0,
                                        }}
                                    />
                            }
                        </View>
                    ))
                }
            </View>
        )
    }

    function moreSearchableProduct() {
        return (
            <Image
                source={require('../../assets/images/search/search_1.jpg')}
                style={{
                    width: '100%',
                    height: 200.0,
                    marginVertical: Sizes.fixPadding,
                }}
            />
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                        name="arrow-back"
                        color={Colors.blackColor}
                        size={25}
                        onPress={() => navigation.pop()}
                    />
                    <TextInput
                        ref={textInputRef}
                        selectionColor={Colors.primaryColor}
                        placeholder="Search for Brands & Products"
                        placeholderTextColor={Colors.grayColor}
                        onFocus={() => setTextFieldFocus(true)}
                        onBlur={() => setTextFieldFocus(false)}
                        style={{ padding: 0, marginLeft: Sizes.fixPadding, flex: 1, ...Fonts.grayColor14Medium }}
                    />
                </View>
                <MaterialIcons
                    name="search"
                    color={textFieldFocus ? Colors.primaryColor : Colors.grayColor}
                    size={25}
                    onPress={() => textInputRef.current.focus()}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Sizes.fixPadding + 5.0,
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding + 5.0,
        elevation: 2.0,
        ...CommonStyles.shadow
    },
    popularOnAppWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: Sizes.fixPadding + 5.0,
    }
})

export default SearchScreen;