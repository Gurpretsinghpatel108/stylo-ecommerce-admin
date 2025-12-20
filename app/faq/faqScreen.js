import React from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const returnOrExchangeSteps = [
    'Go to My Orders',
    'Choose the item you wish to return or exchange',
    'Fill in the details',
    'Choose Request Return.'
];

const addDeliveryAddressSteps = [
    'Log into your STYLO account',
    'Go to My Account > Settings >',
    'Add details of your new address',
    'Choose \'Save Changes\'',
];

const replacementProcess = [
    {
        step: 1,
        title: 'Create a \'Return Request\'',
        steps: [
            'Login to STYLO',
            'Chosse the item you wish to return or exchange',
            'Fill in the details',
            'Choose Request Return',
            'Choose Request Return',
        ],
    },
    {
        step: 2,
        title: 'Once the return has been approved, the originally delevered item will be picked up'
    },
    {
        step: 3,
        title: 'Replacement intiated',
        description: 'In most cases, the replacement item is delivered to you at the time of pick-up.In all other cases, the replacement/refund is intiated after the originally delivered item is picked up.'
    }
];

const FaqScreen = () => {

    const navigation = useNavigation();

    return (
        <View style={{ flex: 1, backgroundColor: Colors.backColor }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {returnAndExchangeItemInfo()}
                    {addDeliveryAddressToAccountInfo()}
                    {replacementProcessForOrderInfo()}
                </ScrollView>
            </View>
        </View>
    )

    function replacementProcessForOrderInfo() {
        return (
            <View style={styles.replacementProcessForOrderInfoWrapStyle}>
                <Text style={{ ...Fonts.blackColor16SemiBold }}>
                    What is the replacement process for orders?
                </Text>
                <Text style={{ marginVertical: Sizes.fixPadding + 5.0, lineHeight: 20.0, ...Fonts.lightGrayColor12Medium }}>
                    STYLO's Replacement Guarantee depends on the product category and the seller. Products are eligible for replacement if they are Damaged, Defective or Not as Described.
                </Text>
                <Text style={{ marginBottom: Sizes.fixPadding + 5.0, lineHeight: 20.0, ...Fonts.lightGrayColor12Medium }}>
                    Here's how you can raise a return request in a few simple steps:
                </Text>
                {
                    replacementProcess.map((item, index) => (
                        <View key={`${index}`}
                            style={{ marginBottom: replacementProcess.length - 1 == index ? 0.0 : Sizes.fixPadding + 5.0, }}
                        >
                            <Text style={{ lineHeight: 20.0, ...Fonts.lightGrayColor12Medium }}>
                                {item.step}. {item.title}
                            </Text>
                            {
                                item.steps
                                    ?
                                    item.steps.map((item, index) => (
                                        <View key={`${index}`}>
                                            <Text style={{ lineHeight: 20.0, ...Fonts.lightGrayColor12Medium }}>
                                                - {item}
                                            </Text>
                                        </View>
                                    ))
                                    :
                                    item.description
                                        ?
                                        <View>
                                            <Text style={{ lineHeight: 20.0, ...Fonts.lightGrayColor12Medium }}>
                                                {item.description}
                                            </Text>
                                        </View>
                                        :
                                        null
                            }
                        </View>
                    ))
                }
            </View>
        )
    }

    function addDeliveryAddressToAccountInfo() {
        return (
            <View style={styles.addDeliveryAddressToAccountInfoWrapStyle}>
                <Text style={{ ...Fonts.blackColor16SemiBold }}>
                    How can I add a new delivery address to my STYLO account?
                </Text>
                <View
                    style={{ marginTop: Sizes.fixPadding + 5.0, }}
                >
                    <Text style={{ lineHeight: 20.0, ...Fonts.lightGrayColor12Medium }}>
                        To add new delivery address, follow these simple steps:
                    </Text>
                    {
                        addDeliveryAddressSteps.map((item, index) => (
                            <View key={`${index}`}>
                                <Text style={{ lineHeight: 20.0, ...Fonts.lightGrayColor12Medium }}>
                                    {index + 1}. {item}
                                </Text>
                            </View>
                        ))
                    }
                </View>
            </View>
        )
    }

    function returnAndExchangeItemInfo() {
        return (
            <View style={styles.returnAndExchangeItemInfoWrapStyle}>
                <Text style={{ ...Fonts.blackColor16SemiBold }}>
                    How can I return or exchange an item?
                </Text>
                <View
                    style={{ marginTop: Sizes.fixPadding + 5.0, }}
                >
                    <Text style={{ lineHeight: 20.0, ...Fonts.lightGrayColor12Medium }}>
                        To return/exchange your order, follow these simple steps:
                    </Text>
                    {
                        returnOrExchangeSteps.map((item, index) => (
                            <View key={`${index}`}>
                                <Text style={{ lineHeight: 20.0, ...Fonts.lightGrayColor12Medium }}>
                                    {index + 1}. {item}
                                </Text>
                            </View>
                        ))
                    }
                </View>
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
                    STYLO FAQ
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
    replacementProcessForOrderInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        margin: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding - 2.0,
        paddingVertical: Sizes.fixPadding,
        elevation: 3.0,
        ...CommonStyles.shadow
    },
    addDeliveryAddressToAccountInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding - 2.0,
        paddingVertical: Sizes.fixPadding,
        elevation: 3.0,
        ...CommonStyles.shadow
    },
    returnAndExchangeItemInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        margin: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding - 2.0,
        paddingVertical: Sizes.fixPadding,
        elevation: 3.0,
        ...CommonStyles.shadow
    }
})

export default FaqScreen;