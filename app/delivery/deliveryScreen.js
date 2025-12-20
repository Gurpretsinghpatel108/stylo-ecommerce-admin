import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput } from 'react-native-paper';
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

const DeliveryScreen = () => {

    const navigation = useNavigation();

    const [pincode, setPincode] = useState('');
    const [locality, setLocality] = useState('');
    const [city, setCity] = useState('');
    const [stateValue, setStateValue] = useState('');

    return (
        <View style={{ flex: 1, backgroundColor: Colors.backColor }}>
            <MyStatusBar />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView
                    automaticallyAdjustKeyboardInsets={true}
                    showsVerticalScrollIndicator={false}
                >
                    {title()}
                    {addressInfo()}
                    {gotoPaymentButton()}
                </ScrollView>
            </View>
        </View>
    )

    function gotoPaymentButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('payment/paymentScreen')}
                style={styles.gotoPaymentButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor14Bold }}>
                    GO TO PAYMENT
                </Text>
            </TouchableOpacity>
        )
    }

    function addressInfo() {
        return (
            <>
                {pinCodeTextField()}
                {localityTextField()}
                {cityTextField()}
                {stateTextField()}
            </>
        )
    }

    function stateTextField() {
        return (
            <TextInput
                mode="flat"
                label="State"
                value={stateValue}
                onChangeText={(text) => setStateValue(text)}
                style={styles.textFieldStyle}
                theme={{
                    colors: {
                        placeholder: Colors.lightGrayColor,
                        primary: Colors.primaryColor,
                        underlineColor: 'transparent',
                    }
                }}
            />
        )
    }

    function cityTextField() {
        return (
            <TextInput
                mode="flat"
                label="City"
                value={city}
                onChangeText={(text) => setCity(text)}
                style={styles.textFieldStyle}
                theme={{
                    colors: {
                        placeholder: Colors.lightGrayColor,
                        primary: Colors.primaryColor,
                        underlineColor: 'transparent',
                    }
                }}
            />
        )
    }

    function localityTextField() {
        return (
            <TextInput
                mode="flat"
                label="Locality"
                value={locality}
                onChangeText={(text) => setLocality(text)}
                style={styles.textFieldStyle}
                theme={{
                    colors: {
                        placeholder: Colors.lightGrayColor,
                        primary: Colors.primaryColor,
                        underlineColor: 'transparent',
                    }
                }}
            />
        )
    }

    function pinCodeTextField() {
        return (
            <TextInput
                mode="flat"
                label="Pin Code"
                keyboardType="numeric"
                value={pincode}
                onChangeText={(text) => setPincode(text)}
                style={styles.textFieldStyle}
                theme={{
                    colors: {
                        placeholder: Colors.lightGrayColor,
                        primary: Colors.primaryColor,
                        underlineColor: 'transparent',
                    }
                }}
            />
        )
    }

    function title() {
        return (
            <Text style={{ margin: Sizes.fixPadding + 5.0, textAlign: 'center', ...Fonts.lightGrayColor25Bold }}>
                Where are your Ordered Item Shipped?
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
                    DELIVERY
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
    gotoPaymentButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding * 3.0,
        paddingVertical: Sizes.fixPadding + 7.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: Sizes.fixPadding * 3.0,
        marginHorizontal: Sizes.fixPadding + 5.0,
        elevation: 10.0,
    },
    textFieldStyle: {
        marginBottom: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding + 5.0,
        ...Fonts.blackColor15SemiBold,
        backgroundColor: 'transparent'
    }
})

export default DeliveryScreen;