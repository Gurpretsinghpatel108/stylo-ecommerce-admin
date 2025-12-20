// app/products/FAQScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function FAQScreen() {
  const router = useRouter();
  const [expanded, setExpanded] = useState(null);

  const toggleExpand = (index) => {
    setExpanded(expanded === index ? null : index);
  };

  const faqs = [
    {
      question: "Is the jewelry real gold and hallmarked?",
      answer: "Yes! All our gold jewelry is BIS hallmarked for purity (22K or 18K as mentioned). We provide a certificate of authenticity with every purchase.",
    },
    {
      question: "Do you offer certification for diamonds?",
      answer: "Absolutely. All diamonds above 0.30 carat come with IGI or GIA certification. Smaller diamonds are certified in-house for quality.",
    },
    {
      question: "What is your return and exchange policy?",
      answer: "We offer a 30-day return/exchange policy. If you're not satisfied, return the item in original condition for a full refund or exchange. Custom orders are non-returnable.",
    },
    {
      question: "How long does delivery take?",
      answer: "Standard delivery: 5-7 business days across India. Express delivery (2-3 days) available in major cities. Free shipping on orders above ₹10,000.",
    },
    {
      question: "Is the packaging secure and discreet?",
      answer: "Yes, all orders are packed in tamper-proof, branded boxes with secure sealing. No price details visible on the outer package.",
    },
    {
      question: "Do you provide cash on delivery (COD)?",
      answer: "Yes, COD is available pan-India with a small convenience fee. Maximum COD limit: ₹50,000.",
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept UPI, Credit/Debit Cards, Net Banking, Wallets, EMI options, and COD. All transactions are 100% secure.",
    },
    {
      question: "Can I customize jewelry?",
      answer: "Yes! We offer customization for rings, pendants, and more. Contact our support team for details and pricing.",
    },
    {
      question: "Is there a warranty on jewelry?",
      answer: "All jewelry comes with a 1-year warranty against manufacturing defects. Free polishing and cleaning for life!",
    },
    {
      question: "How do I check the purity of gold?",
      answer: "Every piece has BIS hallmark stamp. You can also verify online using the hallmark number provided with your certificate.",
    },
    {
      question: "What if my order is damaged or lost?",
      answer: "We offer 100% insurance on all shipments. If damaged, we'll replace it free. If lost, full refund guaranteed.",
    },
    {
      question: "Do you have try-at-home service?",
      answer: "Yes, available in select cities. Book a free try-at-home appointment via the app.",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <LinearGradient colors={["#ff6b6b", "#ff8e8e"]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={{ margin: 16 }}>
        {faqs.map((faq, index) => (
          <TouchableOpacity
            key={index}
            style={styles.faqItem}
            onPress={() => toggleExpand(index)}
            activeOpacity={0.7}
          >
            <View style={styles.questionRow}>
              <Text style={styles.question}>{faq.question}</Text>
              <Ionicons
                name={expanded === index ? "chevron-up" : "chevron-down"}
                size={24}
                color="#ff6b6b"
              />
            </View>
            {expanded === index && (
              <Text style={styles.answer}>{faq.answer}</Text>
            )}
          </TouchableOpacity>
        ))}

        <Text style={styles.footerText}>
          Still have questions? Contact our support team via WhatsApp or Call – we're here 24/7! ❤️
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
  faqItem: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3,
  },
  questionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
    marginRight: 10,
  },
  answer: {
    marginTop: 12,
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  footerText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
});