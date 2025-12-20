// app/products/ChatSupport.js
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Linking,
    ScrollView,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function ChatSupport() {
    const router = useRouter();

    // Direct WhatsApp Open (Best Method - Works on Android & iOS)
    const openWhatsApp = () => {
        const phone = "919202701080"; // Your support number without +
        const message =
            "Hello Gauri Jewellers Support Team! 👋\nI need assistance with my order or the app.";

        const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

        Linking.openURL(url).catch(() => {
            Alert.alert(
                "WhatsApp Not Installed",
                "Please install WhatsApp to contact our support team."
            );
        });
    };

    // Call Support
    const makeCall = () => {
        Linking.openURL("tel:+919202701080").catch(() => {
            Alert.alert("Unable to Make Call", "Please check your phone settings.");
        });
    };

    // Email Support
    const sendEmail = () => {
        Linking.openURL(
            "mailto:shreegaurijewellers88@gmail.com?subject=Support Needed - Gauri Jewellers App"
        ).catch(() => {
            Alert.alert("Email App Not Found", "Please set up an email app on your device.");
        });
    };

    return (
        <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
            <LinearGradient colors={["#ff6b6b", "#ff8e8e"]} style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={28} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Gauri Support Center</Text>
            </LinearGradient>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.container}>
                    <Text style={styles.welcomeText}>
                        Our support team is available 24/7 to assist you. ❤️
                    </Text>

                    {/* Live Chat - Coming Soon */}
                    <TouchableOpacity style={styles.item} activeOpacity={0.7}>
                        <Ionicons name="chatbubble-ellipses-outline" size={28} color="#ff6b6b" />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>Live Chat</Text>
                            <Text style={styles.desc}>Instant chat with support team</Text>
                        </View>
                        <View style={styles.comingSoonBadge}>
                            <Text style={styles.comingSoonText}>Coming Soon</Text>
                        </View>
                    </TouchableOpacity>

                    {/* WhatsApp Support */}
                    <TouchableOpacity style={styles.item} onPress={openWhatsApp} activeOpacity={0.7}>
                        <Ionicons name="logo-whatsapp" size={28} color="#25D366" />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>WhatsApp Support</Text>
                            <Text style={styles.desc}>Get the fastest response here</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#ccc" />
                    </TouchableOpacity>

                    {/* Call Us */}
                    <TouchableOpacity style={styles.item} onPress={makeCall} activeOpacity={0.7}>
                        <Ionicons name="call-outline" size={28} color="#ff6b6b" />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>Call Us</Text>
                            <Text style={styles.desc}>+91 92027 01080 (10 AM - 8 PM)</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#ccc" />
                    </TouchableOpacity>

                    {/* Email Us */}
                    <TouchableOpacity style={styles.item} onPress={sendEmail} activeOpacity={0.7}>
                        <Ionicons name="mail-outline" size={28} color="#ff6b6b" />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>Email Us</Text>
                            <Text style={styles.desc}>shreegaurijewellers88@gmail.com</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#ccc" />
                    </TouchableOpacity>

                    {/* FAQs */}
                    <TouchableOpacity style={styles.item} onPress={() => router.push("/products/FAQScreen")} activeOpacity={0.7}>
                        <Ionicons name="help-circle-outline" size={28} color="#ff6b6b" />
                        <View style={styles.textContainer}>
                            <Text style={styles.title}>FAQs</Text>
                            <Text style={styles.desc}>Common questions & answers</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#ccc" />
                    </TouchableOpacity>
                </View>

                <Text style={styles.footer}>
                    Don't worry — we'll get everything sorted quickly! 🚀{"\n"}
                    Your satisfaction is our priority.
                </Text>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 50,
        paddingBottom: 25,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        flexDirection: "row",
        alignItems: "center",
    },
    backBtn: { paddingLeft: 16 },
    headerTitle: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff",
        flex: 1,
        textAlign: "center",
        marginRight: 44,
    },
    container: {
        margin: 16,
        backgroundColor: "#fff",
        borderRadius: 16,
        elevation: 6,
        overflow: "hidden",
    },
    welcomeText: {
        textAlign: "center",
        padding: 20,
        fontSize: 16,
        color: "#555",
        backgroundColor: "#fff4f4",
        margin: 16,
        marginBottom: 0,
        borderRadius: 12,
    },
    item: {
        flexDirection: "row",
        alignItems: "center",
        padding: 18,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    textContainer: {
        flex: 1,
        marginLeft: 16,
    },
    title: {
        fontSize: 17,
        fontWeight: "600",
        color: "#333",
    },
    desc: {
        fontSize: 14,
        color: "#888",
        marginTop: 4,
    },
    comingSoonBadge: {
        backgroundColor: "#ff6b6b20",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 12,
    },
    comingSoonText: {
        color: "#ff6b6b",
        fontSize: 12,
        fontWeight: "bold",
    },
    footer: {
        textAlign: "center",
        margin: 30,
        fontSize: 16,
        color: "#666",
        lineHeight: 24,
    },
});