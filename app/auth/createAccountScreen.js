

import React, { useState } from "react";
import {
  ScrollView,
  TextInput,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Text,
  Alert,
} from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import MyStatusBar from "../../components/myStatusBar";
import { useNavigation } from "expo-router";

// 🟢 API Import
// import { REGISTER_API } from "../../api/api";
import { REGISTER_API } from "../services/api";

const CreateAccountScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (!username || !email || !password || !repeatPassword) {
      return Alert.alert("Error", "All fields are required!");
    }
    if (password !== repeatPassword) {
      return Alert.alert("Error", "Passwords do not match!");
    }

    setLoading(true);
    try {
      const response = await fetch(REGISTER_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: username, email, password }),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        setLoading(false);
        Alert.alert("Server Error", text);
        return;
      }

      setLoading(false);

      if (data.success) {
        Alert.alert("Success", "Account created successfully!", [
          { text: "OK", onPress: () => navigation.replace("auth/loginScreen") }
        ]);
      } else {
        Alert.alert("Error", data.message || "Something went wrong!");
      }
    } catch (err) {
      setLoading(false);
      console.log("Create account error:", err);
      Alert.alert("Error", "Network ya server issue!");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backColor }}>
      <MyStatusBar />
      <ScrollView
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: Sizes.fixPadding * 10 }}
      >
        <Image
          source={require("../../assets/images/logo/stylo_transparent.png")}
          style={{ width: 80, height: 80, alignSelf: "center" }}
          resizeMode="contain"
        />
        <View style={styles.createAccountInfoWrapStyle}>

          <View style={styles.textFieldWrapStyle}>
            <MaterialIcons name="person" size={24} color={Colors.grayColor} />
            <TextInput
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              style={styles.textFieldStyle}
            />
          </View>

          <View style={styles.textFieldWrapStyle}>
            <MaterialIcons name="email" size={24} color={Colors.grayColor} />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              style={styles.textFieldStyle}
            />
          </View>

          <View style={styles.textFieldWrapStyle}>
            <MaterialIcons name="vpn-key" size={24} color={Colors.grayColor} />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.textFieldStyle}
            />
          </View>

          <View style={styles.textFieldWrapStyle}>
            <MaterialCommunityIcons name="shield-check" size={24} color={Colors.grayColor} />
            <TextInput
              placeholder="Repeat Password"
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              secureTextEntry
              style={styles.textFieldStyle}
            />
          </View>

          <TouchableOpacity
            activeOpacity={0.9}
            onPress={handleCreateAccount}
            style={styles.createAccountButtonStyle}
          >
            <Text style={{ ...Fonts.whiteColor15Bold }}>
              {loading ? "Please wait..." : "CREATE ACCOUNT"}
            </Text>
          </TouchableOpacity>

          <Text
            onPress={() => navigation.replace("auth/loginScreen")}
            style={{ marginTop: 20, textAlign: "center", ...Fonts.blackColor16Bold }}
          >
            LOGIN
          </Text>

        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  textFieldWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEEEEE",
    borderRadius: Sizes.fixPadding * 2,
    paddingHorizontal: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding,
  },
  textFieldStyle: {
    flex: 1,
    marginLeft: Sizes.fixPadding,
    ...Fonts.blackColor15Medium,
  },
  createAccountInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    elevation: 3,
    borderRadius: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2,
    padding: Sizes.fixPadding * 2,
    marginTop: Sizes.fixPadding * 4,
    ...CommonStyles.shadow,
  },
  createAccountButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding * 2.5,
    paddingVertical: Sizes.fixPadding + 5,
    alignItems: "center",
    marginTop: Sizes.fixPadding * 2,
    elevation: 10,
  },
});

export default CreateAccountScreen;
