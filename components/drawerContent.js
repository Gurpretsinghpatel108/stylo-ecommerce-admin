import { DrawerContentScrollView } from '@react-navigation/drawer';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, Modal, Dimensions, View, ScrollView, Platform } from 'react-native';
import { Colors, Fonts, Sizes } from '../constants/styles';
import { MaterialCommunityIcons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import MyStatusBar from './myStatusBar';
import { useNavigation } from 'expo-router';

const { width } = Dimensions.get('window');

const CustomDrawer = () => {

    const navigation = useNavigation();

    const [logoutDialog, setLogoutDialog] = useState(false);

    return (
        <View style={{ flex: 1, backgroundColor: '#FAFAFA', }}>
            <MyStatusBar />
            <View style={{ flex: 1 }}>
                <DrawerContentScrollView
                    contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.whiteColor, }}
                    showsVerticalScrollIndicator={false}
                >
                    {drawerContent()}
                </DrawerContentScrollView>
                {logoutInfo()}
            </View>
        </View>
    );

    function logoutInfo() {
        return (
            <Modal
                animationType="slide"
                transparent={true}
                visible={logoutDialog}
                onRequestClose={() => { setLogoutDialog(false) }}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => { setLogoutDialog(false) }}
                    style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <View style={{ justifyContent: "center", flex: 1 }}>
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => { }}
                            style={{
                                width: width - 50,
                                backgroundColor: Colors.whiteColor,
                                borderRadius: Sizes.fixPadding - 5.0,
                                alignSelf: 'center'
                            }}
                        >
                            <View style={{ ...styles.dialogWrapStyle }}>
                                <Text style={{ ...Fonts.blackColor18Bold }}>
                                    Confirm
                                </Text>
                                <Text style={{ ...Fonts.blackColor15Medium, marginVertical: Sizes.fixPadding * 2.0, }}>
                                    Are you Sure want to Logout?
                                </Text>
                                <View style={styles.closeAndLogoutTextWrapStyle}>
                                    <Text
                                        onPress={() => setLogoutDialog(false)}
                                        style={{ ...Fonts.primaryColor13SemiBold }}
                                    >
                                        Close
                                    </Text>
                                    <Text
                                        onPress={() => {
                                            setLogoutDialog(false)
                                            navigation.push('auth/loginScreen')
                                        }}
                                        style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.primaryColor13SemiBold }}
                                    >
                                        Logout
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        )
    }

    function drawerContent() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: '#FAFAFA',
                marginTop: Platform.OS == 'ios' ? -63.0 : -5
            }}>
                <View style={{ ...styles.appIconBackgroundStyle }}>
                    <Image
                        source={require('../assets/images/logo/stylo_transparent.png')}
                        style={{ width: 80.0, height: 80.0, }}
                        resizeMode="contain"
                    />
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{ marginHorizontal: Sizes.fixPadding + 5.0, }}>
                        {category({ categoryName: 'MEN' })}
                        {category({ categoryName: 'WOMEN' })}
                        {category({ categoryName: 'KIDS' })}
                        {category({ categoryName: 'HOME & LIVING' })}
                        {category({ categoryName: 'BEAUTY' })}
                    </View>
                    {drawerDivider()}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.push('orders/ordersScreen')}
                    >
                        {drawerItems({
                            icon: <MaterialCommunityIcons name="wallet" color={Colors.grayColor} size={22} />,
                            title: 'My Orders',
                        })}
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.push('bag/bagScreen')}
                    >
                        {drawerItems({
                            icon: <FontAwesome5 name="shopping-bag" size={22} color={Colors.grayColor} />,
                            title: 'My Bag',
                        })}
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.push('wishlist/wishlistScreen')}
                    >
                        {drawerItems({
                            icon: <MaterialIcons name="favorite-border" size={22} color={Colors.grayColor} />,
                            title: 'My Wishlist',
                        })}
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.push('account/accountScreen')}
                    >
                        {drawerItems({
                            icon: <MaterialIcons name="person" size={22} color={Colors.grayColor} />,
                            title: 'My Account',
                        })}
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.push('notifications/notificationsScreen')}
                    >
                        {drawerItems({
                            icon: <MaterialIcons name="notifications" size={22} color={Colors.grayColor} />,
                            title: 'My Notification',
                        })}
                    </TouchableOpacity>
                    {drawerDivider()}
                    <View style={{ marginHorizontal: Sizes.fixPadding + 5.0 }}>
                        <Text
                            onPress={() => navigation.push('faq/faqScreen')}
                            style={{ marginVertical: Sizes.fixPadding - 5.0, ...Fonts.grayColor14SemiBold }}>
                            FAQ
                        </Text>
                        <Text
                            onPress={() => navigation.push('aboutApp/aboutAppScreen')}
                            style={{ marginVertical: Sizes.fixPadding - 5.0, ...Fonts.grayColor14SemiBold }}
                        >
                            About App
                        </Text>
                        <Text
                            onPress={() => setLogoutDialog(true)}
                            style={{ marginVertical: Sizes.fixPadding - 5.0, ...Fonts.grayColor14SemiBold }}>
                            Logout
                        </Text>
                    </View>
                </ScrollView>
            </View>
        );
    };

    function category({ categoryName }) {
        return (
            <Text
                onPress={() => navigation.push('categoryDetail/categoryDetailScreen')}
                style={{ marginVertical: Sizes.fixPadding - 5.0, ...Fonts.blackColor17SemiBold }}
            >
                {categoryName}
            </Text>
        )
    }

    function drawerDivider() {
        return (
            <View style={{ backgroundColor: '#CCCCCC', marginVertical: Sizes.fixPadding, height: 1.0, }} />
        )
    }

    function drawerItems({ icon, title }) {
        return (
            <View style={{ ...styles.drawerItemWrapStyle }}>
                {icon}
                <Text style={{ marginLeft: Sizes.fixPadding + 2.0, ...Fonts.grayColor14SemiBold }}>
                    {title}
                </Text>
            </View>
        )
    }

};

const styles = StyleSheet.create({
    logoutTextStyle: {
        marginTop: Sizes.fixPadding - 7.0,
        lineHeight: 18.0,
        textAlign: 'center',
        ...Fonts.blackColor16SemiBold
    },
    dialogWrapStyle: {
        width: width - 50,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingTop: Sizes.fixPadding * 4.0,
        paddingBottom: Sizes.fixPadding * 2.0
    },
    closeAndLogoutTextWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginTop: Sizes.fixPadding * 3.0
    },
    appIconBackgroundStyle: {
        backgroundColor: Colors.whiteColor,
        alignItems: 'center',
        justifyContent: 'center',
        height: 200.0,
        marginBottom: Sizes.fixPadding - 5.0,
    },
    drawerItemWrapStyle: {
        marginVertical: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding + 5.0,
        flexDirection: 'row',
        alignItems: 'center',
    }
})

export default CustomDrawer;