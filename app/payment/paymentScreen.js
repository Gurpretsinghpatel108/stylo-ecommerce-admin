import React, { useState } from "react";
import { View, Dimensions, ScrollView, Image, Modal, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const { width } = Dimensions.get('window');

const paymentOptionsList = [
    {
        id: '1',
        paymentOption: 'Credit / Debit Card',
        paymentOptionImage: require('../../assets/images/payment_icon/card.png')
    },
    {
        id: '2',
        paymentOption: 'Cash On Delivery',
        paymentOptionImage: require('../../assets/images/payment_icon/cash_on_delivery.png')
    },
    {
        id: '3',
        paymentOption: 'PayPal',
        paymentOptionImage: require('../../assets/images/payment_icon/paypal.png')
    },
    {
        id: '4',
        paymentOption: 'Google Wallet',
        paymentOptionImage: require('../../assets/images/payment_icon/google_wallet.png')
    },
];

const PaymentScreen = () => {

    const navigation = useNavigation();

    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(null);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.backColor }}>
            <MyStatusBar />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {title()}
                    {paymentOptions()}
                    {payButton()}
                </ScrollView>
            </View>
            {successDialog()}
        </View>
    )

    function successDialog() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={showSuccessDialog}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                            style={{ ...styles.dialogWrapStyle, alignSelf: 'center' }}
                        >
                            <View style={{ backgroundColor: Colors.whiteColor, alignItems: 'center' }}>
                                <View style={styles.successIconWrapStyle}>
                                    <MaterialIcons
                                        name="done"
                                        size={50}
                                        color={Colors.blackColor}
                                    />
                                </View>
                                <Text style={{
                                    ...Fonts.blackColor18Bold,
                                    marginTop: Sizes.fixPadding + 15.0,
                                    marginBottom: Sizes.fixPadding + 10.0
                                }}>
                                    YUPPY !!
                                </Text>
                                <Text style={{ ...Fonts.lightGrayColor16SemiBold }}>
                                    Your Payment Received.
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    function payButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    setShowSuccessDialog(true);
                    setTimeout(() => {
                        setShowSuccessDialog(false);
                        navigation.push('drawer');
                    }, 2000);
                }}
                style={styles.payButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor14Bold }}>
                    PAY
                </Text>
            </TouchableOpacity>
        )
    }

    function paymentOptions() {
        return (
            paymentOptionsList.map((item, index) => (
                <View key={`${item.id}`}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => setSelectedPaymentMethodId(item.id)}
                        style={{ marginHorizontal: Sizes.fixPadding + 5.0 }}
                    >
                        <View style={styles.paymentOptionsWrapStyle}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{
                                    ...styles.radioButtonOuterStyle,
                                    borderColor: selectedPaymentMethodId == item.id ? Colors.primaryColor : Colors.lightGrayColor,
                                }}>
                                    {
                                        selectedPaymentMethodId == item.id
                                            ?
                                            <View style={styles.radioButtonInnerStyle} />
                                            :
                                            null
                                    }
                                </View>
                                <Text style={{ marginLeft: Sizes.fixPadding + 5.0, ...Fonts.blackColor16SemiBold }}>
                                    {item.paymentOption}
                                </Text>
                            </View>
                            <Image
                                source={item.paymentOptionImage}
                                style={{ width: 40.0, height: 40.0 }}
                                resizeMode="contain"
                            />
                        </View>
                        {
                            paymentOptionsList.length - 1 == index
                                ?
                                null :
                                <View
                                    style={{
                                        backgroundColor: '#e0e0e0',
                                        height: 1.0,
                                        marginVertical: Sizes.fixPadding + 10.0,
                                    }}
                                />
                        }
                    </TouchableOpacity>
                </View>
            ))
        )
    }

    function title() {
        return (
            <Text style={styles.titleStyle}>
                Choose your payment method
            </Text>
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
                    PAYMENT
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
    titleStyle: {
        marginTop: Sizes.fixPadding + 5.0,
        marginBottom: Sizes.fixPadding * 4.0,
        marginHorizontal: Sizes.fixPadding + 5.0,
        textAlign: 'center',
        ...Fonts.lightGrayColor25Bold
    },
    radioButtonOuterStyle: {
        width: 18.0,
        height: 18.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9.0,
        borderWidth: 2.0,
    },
    radioButtonInnerStyle: {
        backgroundColor: Colors.primaryColor,
        width: 10.0,
        height: 10.0,
        borderRadius: 5.0
    },
    paymentOptionsWrapStyle: {
        marginHorizontal: Sizes.fixPadding * 2.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    payButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding * 3.0,
        paddingVertical: Sizes.fixPadding + 7.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: Sizes.fixPadding * 6.0,
        marginHorizontal: Sizes.fixPadding + 5.0,
        elevation: 10.0,
    },
    dialogWrapStyle: {
        borderRadius: Sizes.fixPadding - 5.0,
        width: width - 60,
        backgroundColor: Colors.whiteColor,
        paddingTop: Sizes.fixPadding + 5.0,
        alignItems: 'center',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingBottom: Sizes.fixPadding * 3.0,
    },
    successIconWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.primaryColor,
        borderWidth: 5.0,
        width: 100.0,
        height: 100.0,
        borderRadius: 50.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Sizes.fixPadding + 5.0,
    },
})

export default PaymentScreen;