import React, { useState } from "react";
import { View, ScrollView, Dimensions, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get('window');

const SizeChartScreen = () => {

    const navigation = useNavigation();

    const [selectedSizeTypeId, setSelectedSizeTypeId] = useState(1);

    return (
        <View style={{ flex: 1, backgroundColor: '#fafafa' }}>
            <MyStatusBar />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding + 5.0 }}
                >
                    {selectSizeType()}
                    {divider()}
                    {sizes()}
                    {measureYourSelf()}
                </ScrollView>
            </View>
        </View>
    )

    function measureYourSelf() {
        return (
            <View>
                <Text style={{ marginHorizontal: Sizes.fixPadding, marginBottom: Sizes.fixPadding - 7.0, marginTop: Sizes.fixPadding, ...Fonts.blackColor17SemiBold }}>
                    HOW TO MEASURE YOURSELF
                </Text>
                {divider()}
                <Image
                    source={require('../../assets/images/size_charts.png')}
                    style={styles.sizeChartImageStyle}
                />
            </View>
        )
    }

    function divider() {
        return (
            <View style={{
                backgroundColor: '#cccccc',
                height: 0.80,
                marginVertical: Sizes.fixPadding - 5.0,
            }} />
        )
    }

    function sizes() {
        return (
            <View >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.sizesLeftHeaderBoxStyle}>
                        <Text style={{ ...Fonts.blackColor17SemiBold }}>
                            SIZE
                        </Text>
                    </View>
                    <View style={styles.sizesRightHeaderBoxStyle}>
                        <Text style={{ ...Fonts.blackColor17SemiBold }}>
                            CHEST
                        </Text>
                    </View>
                </View>
                {sizesTypeWithValues({ sizeType: 'XS', valueInInch: '33.0', valueInCm: '83.8' })}
                {sizesTypeWithValues({ sizeType: 'S', valueInInch: '36.3', valueInCm: '92.2' })}
                {sizesTypeWithValues({ sizeType: 'M', valueInInch: '39.5', valueInCm: '100.3' })}
                {sizesTypeWithValues({ sizeType: 'L', valueInInch: '42.5', valueInCm: '108.0' })}
                {sizesTypeWithValues({ sizeType: 'XL', valueInInch: '45.5', valueInCm: '115.6' })}
                {sizesTypeWithValues({ sizeType: 'XXL', valueInInch: '48.8', valueInCm: '124.0' })}
            </View >
        )
    }

    function sizesTypeWithValues({ sizeType, valueInInch, valueInCm }) {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.sizesLeftBoxStyle}>
                    <Text style={{ ...Fonts.blackColor15Medium }}>
                        {sizeType}
                    </Text>
                </View>
                <View style={styles.sizesRightBoxStyle}>
                    <Text style={{ ...Fonts.blackColor15Medium }}>
                        {selectedSizeTypeId == 1
                            ?
                            valueInInch
                            :
                            valueInCm
                        }
                    </Text>
                </View>
            </View>
        )
    }

    function selectSizeType() {
        return (
            <View style={styles.selectSizeTypeInfoWrapStyle}>
                {sizeType({ id: 1, type: 'INCH' })}
                {sizeType({ id: 2, type: 'CM' })}
            </View>
        )
    }

    function sizeType({ id, type }) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setSelectedSizeTypeId(id)}
                style={{
                    borderColor: selectedSizeTypeId == id ? Colors.primaryColor : Colors.lightGrayColor,
                    ...styles.sizeTypeWrapStyle
                }}
            >
                <Text style={selectedSizeTypeId == id ? { ...Fonts.primaryColor15SemiBold } : { ...Fonts.blackColor15Medium }}>
                    {type}
                </Text>
            </TouchableOpacity>
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
                    SIZE CHART
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
    sizeTypeWrapStyle: {
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingVertical: Sizes.fixPadding - 4.0,
        paddingHorizontal: Sizes.fixPadding,
        marginRight: Sizes.fixPadding,
    },
    sizesLeftHeaderBoxStyle: {
        flex: 1,
        borderColor: '#cccccc',
        borderTopWidth: 1.0,
        borderBottomWidth: 1.0,
        borderRightWidth: 0.50,
        paddingVertical: Sizes.fixPadding - 3.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sizesRightHeaderBoxStyle: {
        borderColor: '#cccccc',
        borderTopWidth: 1.0,
        borderBottomWidth: 1.0,
        borderLeftWidth: 0.50,
        paddingVertical: Sizes.fixPadding - 3.0,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sizesLeftBoxStyle: {
        flex: 1,
        borderColor: '#cccccc',
        borderBottomWidth: 1.0,
        borderRightWidth: 0.50,
        paddingVertical: Sizes.fixPadding - 3.0,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sizesRightBoxStyle: {
        borderColor: '#cccccc',
        borderBottomWidth: 1.0,
        borderLeftWidth: 0.50,
        paddingVertical: Sizes.fixPadding - 3.0,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    sizeChartImageStyle: {
        height: 400.0,
        width: width - 20,
        alignSelf: 'center',
        marginTop: Sizes.fixPadding - 5.0
    },
    selectSizeTypeInfoWrapStyle: {
        flexDirection: 'row',
        marginVertical: Sizes.fixPadding,
        alignItems: 'center',
        marginLeft: Sizes.fixPadding,
    }
})

export default SizeChartScreen;