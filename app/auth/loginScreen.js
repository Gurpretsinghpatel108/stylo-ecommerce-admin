// import React, { useCallback, useState } from "react";
// import { BackHandler, TouchableOpacity, ScrollView, TextInput, View, Image, StyleSheet, Text } from "react-native";
// import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
// import { MaterialIcons } from '@expo/vector-icons';
// import { useFocusEffect } from '@react-navigation/native';
// import MyStatusBar from "../../components/myStatusBar";
// import { useNavigation } from "expo-router";

// const LoginScreen = () => {

//     const navigation = useNavigation();

//     const backAction = () => {
//         backClickCount == 1 ? BackHandler.exitApp() : _spring();
//         return true;
//     };

//     useFocusEffect(
//         useCallback(() => {
//             const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
//             return () => {
//                 backHandler.remove();
//             };
//         }, [backAction])
//     );

//     function _spring() {
//         setBackClickCount(1);
//         setTimeout(() => {
//             setBackClickCount(0)
//         }, 1000)
//     }

//     const [email, setEmail] = useState(null);
//     const [emailFocus, setEmailFocus] = useState(false);
//     const [password, setPassword] = useState(null);
//     const [passwordFocus, setPasswordFocus] = useState(false);
//     const [backClickCount, setBackClickCount] = useState(0);

//     return (
//         <View style={{ flex: 1, backgroundColor: Colors.backColor }}>
//             <MyStatusBar />
//             <View style={{ flex: 1, }}>
//                 <ScrollView
//                     automaticallyAdjustKeyboardInsets={true}
//                     showsVerticalScrollIndicator={false}
//                     contentContainerStyle={{ paddingTop: Sizes.fixPadding * 10.0, }}
//                 >
//                     {appLogo()}
//                     {loginInfo()}
//                 </ScrollView>
//             </View>
//             {
//                 backClickCount == 1
//                     ?
//                     <View style={[styles.animatedView]}>
//                         <Text style={{ ...Fonts.whiteColor14SemiBold }}>
//                             Press Back Once Again to Exit
//                         </Text>
//                     </View>
//                     :
//                     null
//             }
//         </View>
//     )

//     function loginInfo() {
//         return (
//             <View style={styles.loginInfoWrapStyle}>
//                 {emailTextField()}
//                 {passwordTextField()}
//                 {forgotPasswordText()}
//                 {loginButton()}
//                 {createAccountText()}
//             </View>
//         )
//     }

//     function createAccountText() {
//         return (
//             <Text
//                 onPress={() => navigation.push('auth/createAccountScreen')}
//                 style={{ marginBottom: Sizes.fixPadding, textAlign: 'center', ...Fonts.blackColor16Bold }}
//             >
//                 CREATE ACCOUNT
//             </Text>
//         )
//     }

//     function forgotPasswordText() {
//         return (
//             <Text
//                 onPress={() => navigation.push('auth/resetPasswordScreen')}
//                 style={{
//                     marginTop: Sizes.fixPadding * 2.0,
//                     textAlign: 'center',
//                     ...Fonts.blackColor16Bold
//                 }}
//             >
//                 FORGOT PASSWORD?
//             </Text>
//         )
//     }

//     function loginButton() {
//         return (
//             <TouchableOpacity
//                 activeOpacity={0.9}
//                 onPress={() => navigation.push('auth/createAccountScreen')}
//                 style={styles.loginButtonStyle}
//             >
//                 <Text style={{ ...Fonts.whiteColor15Bold }}>
//                     LOGIN
//                 </Text>
//             </TouchableOpacity>
//         )
//     }

//     function passwordTextField() {
//         return (
//             <View style={styles.textFieldWrapStyle}>
//                 <MaterialIcons
//                     name="vpn-key"
//                     color={passwordFocus ? Colors.primaryColor : Colors.grayColor}
//                     size={24}
//                 />
//                 <TextInput
//                     secureTextEntry={true}
//                     selectionColor={Colors.primaryColor}
//                     placeholder="Password"
//                     value={password}
//                     onChangeText={(text) => setPassword(text)}
//                     onFocus={() => setPasswordFocus(true)}
//                     onBlur={() => setPasswordFocus(false)}
//                     style={styles.textFieldStyle}
//                 />
//             </View>
//         )
//     }

//     function emailTextField() {
//         return (
//             <View style={styles.textFieldWrapStyle}>
//                 <MaterialIcons
//                     name="email"
//                     color={emailFocus ? Colors.primaryColor : Colors.grayColor}
//                     size={24}
//                 />
//                 <TextInput
//                     selectionColor={Colors.primaryColor}
//                     placeholder="Email"
//                     value={email}
//                     onChangeText={(text) => setEmail(text)}
//                     onFocus={() => setEmailFocus(true)}
//                     onBlur={() => setEmailFocus(false)}
//                     style={styles.textFieldStyle}
//                     keyboardType="email-address"
//                 />
//             </View>
//         )
//     }

//     function appLogo() {
//         return (
//             <Image
//                 source={require('../../assets/images/logo/stylo_transparent.png')}
//                 style={{ width: 80.0, height: 80.0, alignSelf: 'center' }}
//                 resizeMode="contain"
//             />
//         )
//     }
// }

// const styles = StyleSheet.create({
//     headerWrapStyle: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: Colors.whiteColor,
//         paddingVertical: Sizes.fixPadding + 5.0,
//         paddingHorizontal: Sizes.fixPadding + 5.0,
//         elevation: 2.0,
//     },
//     textFieldWrapStyle: {
//         flexDirection: 'row',
//         alignItems: "center",
//         backgroundColor: '#EEEEEE',
//         borderRadius: Sizes.fixPadding * 2.0,
//         paddingVertical: Sizes.fixPadding,
//         paddingHorizontal: Sizes.fixPadding,
//         marginVertical: Sizes.fixPadding,
//     },
//     loginButtonStyle: {
//         backgroundColor: Colors.primaryColor,
//         borderRadius: Sizes.fixPadding * 2.5,
//         paddingVertical: Sizes.fixPadding + 2.0,
//         paddingHorizontal: Sizes.fixPadding * 4.0,
//         alignItems: 'center',
//         justifyContent: 'center',
//         alignSelf: 'center',
//         elevation: 10.0,
//         marginVertical: Sizes.fixPadding + 10.0,
//     },
//     loginInfoWrapStyle: {
//         backgroundColor: Colors.whiteColor,
//         elevation: 3.0,
//         borderRadius: Sizes.fixPadding,
//         paddingVertical: Sizes.fixPadding,
//         marginHorizontal: Sizes.fixPadding * 2.0,
//         paddingHorizontal: Sizes.fixPadding,
//         marginVertical: Sizes.fixPadding * 2.5,
//         ...CommonStyles.shadow,
//     },
//     animatedView: {
//         backgroundColor: "#333333",
//         position: "absolute",
//         bottom: 40,
//         alignSelf: 'center',
//         borderRadius: Sizes.fixPadding - 5.0,
//         paddingHorizontal: Sizes.fixPadding + 5.0,
//         paddingVertical: Sizes.fixPadding,
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     textFieldStyle: {
//         flex: 1,
//         marginLeft: Sizes.fixPadding,
//         ...Fonts.blackColor15Medium,
//         padding: 0
//     }
// })

// export default LoginScreen;













// import React, { useCallback, useState, useEffect } from "react";
// import {
//   BackHandler,
//   TouchableOpacity,
//   ScrollView,
//   TextInput,
//   View,
//   Image,
//   StyleSheet,
//   Text,
//   Alert,
//   DeviceEventEmitter,
// } from "react-native";
// import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
// import { MaterialIcons } from "@expo/vector-icons";
// import { useFocusEffect } from "@react-navigation/native";
// import MyStatusBar from "../../components/myStatusBar";
// import { useRouter } from "expo-router";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// // Manual JWT decode — NO jwt-decode package, NO ERROR EVER!
// const decodeJWT = (token) => {
//   try {
//     const payload = token.split(".")[1];
//     const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
//     const jsonPayload = decodeURIComponent(
//       atob(base64)
//         .split("")
//         .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
//         .join("")
//     );
//     return JSON.parse(jsonPayload);
//   } catch (e) {
//     console.log("Token decode failed:", e);
//     return {};
//   }
// };

// const API_URL = "http://10.23.168.194:5001/auth";

// const LoginScreen = () => {
//   const router = useRouter();

//   const [email, setEmail] = useState("");
//   const [emailFocus, setEmailFocus] = useState(false);
//   const [password, setPassword] = useState("");
//   const [passwordFocus, setPasswordFocus] = useState(false);
//   const [backClickCount, setBackClickCount] = useState(0);

//   // Check if already logged in
//   useEffect(() => {
//     checkAlreadyLoggedIn();
//   }, []);

//   const checkAlreadyLoggedIn = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (token) {
//         const decoded = decodeJWT(token);
//         if (decoded.id || decoded._id) {
//           router.replace("/drawer/homeScreen");
//         }
//       }
//     } catch (err) {
//       await AsyncStorage.removeItem("token");
//     }
//   };

//   const backAction = () => {
//     backClickCount === 1 ? BackHandler.exitApp() : _spring();
//     return true;
//   };

//   useFocusEffect(
//     useCallback(() => {
//       const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
//       return () => backHandler.remove();
//     }, [backClickCount])
//   );

//   const _spring = () => {
//     setBackClickCount(1);
//     setTimeout(() => setBackClickCount(0), 1500);
//   };

//   const handleLogin = async () => {
//     if (!email || !password) {
//       return Alert.alert("Error", "Email aur password daal bhai!");
//     }

//     try {
//       const res = await fetch(`${API_URL}/login`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (data.success && data.token) {
//         // Token save kar
//         await AsyncStorage.setItem("token", data.token);

//         // Manual decode — 100% working
//         const decoded = decodeJWT(data.token);
//         const userId = decoded.id || decoded._id || decoded.userId;
//         await AsyncStorage.setItem("userId", userId.toString());

//         // YE IMPORTANT HAI BHAI — USER DATA SAVE KAR RAHE HAIN 🔥
//         // Backend se agar user data aaya hai toh use save kar
//         if (data.user) {
//           const userData = {
//             name: data.user.name || data.user.fullName || "User",
//             email: data.user.email || email,
//             phone: data.user.phone || data.user.mobile || "+91 98765 43210",
//             photo: data.user.photo || data.user.profileImage || null,
//           };
//           await AsyncStorage.setItem("userData", JSON.stringify(userData));
//         } else {
//           // Agar backend se user data nahi aaya toh basic data save kar
//           const userData = {
//             name: decoded.name || decoded.fullName || "User",
//             email: decoded.email || email,
//             phone: decoded.phone || decoded.mobile || "+91 98765 43210",
//             photo: decoded.photo || null,
//           };
//           await AsyncStorage.setItem("userData", JSON.stringify(userData));
//         }

//         // Cart data save kar agar available hai
//         if (data.cart) {
//           await AsyncStorage.setItem("cart", JSON.stringify(data.cart));
//           DeviceEventEmitter.emit("cartUpdated");
//         }

//         // Wishlist data save kar agar available hai
//         if (data.wishlist) {
//           await AsyncStorage.setItem("wishlist", JSON.stringify(data.wishlist));
//           DeviceEventEmitter.emit("wishlistUpdated");
//         }

//         // Auth changed event emit kar taaki sabhi components update ho jayen
//         DeviceEventEmitter.emit("authChanged");

//         // Success message with user name
//         const userName = data.user?.name || decoded.name || "Bhai";
//         Alert.alert("Success", `Welcome back ${userName}! 🎉`, [
//           {
//             text: "OK",
//             onPress: () => {
//               // Check agar redirect URL saved hai
//               AsyncStorage.getItem("redirectAfterLogin").then((redirect) => {
//                 if (redirect) {
//                   AsyncStorage.removeItem("redirectAfterLogin");
//                   router.replace(redirect);
//                 } else {
//                   router.replace("/drawer/homeScreen");
//                 }
//               });
//             },
//           },
//         ]);
//       } else {
//         Alert.alert("Login Failed", data.message || "Invalid email or password");
//       }
//     } catch (err) {
//       console.log("Login error:", err);
//       Alert.alert("Error", "Server off hai ya network issue!");
//     }
//   };

//   return (
//     <View style={{ flex: 1, backgroundColor: Colors.backColor }}>
//       <MyStatusBar />
//       <View style={{ flex: 1 }}>
//         <ScrollView
//           automaticallyAdjustKeyboardInsets={true}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingTop: Sizes.fixPadding * 10.0 }}
//         >
//           {appLogo()}
//           {loginInfo()}
//         </ScrollView>
//       </View>

//       {backClickCount === 1 && (
//         <View style={styles.animatedView}>
//           <Text style={{ ...Fonts.whiteColor14SemiBold }}>
//             Press Back Once Again to Exit
//           </Text>
//         </View>
//       )}
//     </View>
//   );

//   function loginInfo() {
//     return (
//       <View style={styles.loginInfoWrapStyle}>
//         {emailTextField()}
//         {passwordTextField()}
//         {forgotPasswordText()}
//         {loginButton()}
//         {createAccountText()}
//       </View>
//     );
//   }

//   function createAccountText() {
//     return (
//       <Text
//         onPress={() => router.push("auth/createAccountScreen")}
//         style={{ marginBottom: Sizes.fixPadding, textAlign: "center", ...Fonts.blackColor16Bold }}
//       >
//         CREATE ACCOUNT
//       </Text>
//     );
//   }

//   function forgotPasswordText() {
//     return (
//       <Text
//         onPress={() => router.push("auth/resetPasswordScreen")}
//         style={{
//           marginTop: Sizes.fixPadding * 2.0,
//           textAlign: "center",
//           ...Fonts.blackColor16Bold,
//         }}
//       >
//         FORGOT PASSWORD?
//       </Text>
//     );
//   }

//   function loginButton() {
//     return (
//       <TouchableOpacity activeOpacity={0.9} onPress={handleLogin} style={styles.loginButtonStyle}>
//         <Text style={{ ...Fonts.whiteColor15Bold }}>LOGIN</Text>
//       </TouchableOpacity>
//     );
//   }

//   function passwordTextField() {
//     return (
//       <View style={styles.textFieldWrapStyle}>
//         <MaterialIcons
//           name="vpn-key"
//           color={passwordFocus ? Colors.primaryColor : Colors.grayColor}
//           size={24}
//         />
//         <TextInput
//           secureTextEntry={true}
//           selectionColor={Colors.primaryColor}
//           placeholder="Password"
//           value={password}
//           onChangeText={setPassword}
//           onFocus={() => setPasswordFocus(true)}
//           onBlur={() => setPasswordFocus(false)}
//           style={styles.textFieldStyle}
//         />
//       </View>
//     );
//   }

//   function emailTextField() {
//     return (
//       <View style={styles.textFieldWrapStyle}>
//         <MaterialIcons
//           name="email"
//           color={emailFocus ? Colors.primaryColor : Colors.grayColor}
//           size={24}
//         />
//         <TextInput
//           selectionColor={Colors.primaryColor}
//           placeholder="Email"
//           value={email}
//           onChangeText={setEmail}
//           onFocus={() => setEmailFocus(true)}
//           onBlur={() => setEmailFocus(false)}
//           style={styles.textFieldStyle}
//           keyboardType="email-address"
//           autoCapitalize="none"
//         />
//       </View>
//     );
//   }

//   function appLogo() {
//     return (
//       <Image
//         source={require("../../assets/images/logo/stylo_transparent.png")}
//         style={{ width: 80.0, height: 80.0, alignSelf: "center" }}
//         resizeMode="contain"
//       />
//     );
//   }
// };

// const styles = StyleSheet.create({
//   textFieldWrapStyle: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#EEEEEE",
//     borderRadius: Sizes.fixPadding * 2.0,
//     paddingVertical: Sizes.fixPadding,
//     paddingHorizontal: Sizes.fixPadding,
//     marginVertical: Sizes.fixPadding,
//   },
//   loginButtonStyle: {
//     backgroundColor: Colors.primaryColor,
//     borderRadius: Sizes.fixPadding * 2.5,
//     paddingVertical: Sizes.fixPadding + 2.0,
//     paddingHorizontal: Sizes.fixPadding * 4.0,
//     alignItems: "center",
//     justifyContent: "center",
//     alignSelf: "center",
//     elevation: 10.0,
//     marginVertical: Sizes.fixPadding + 10.0,
//   },
//   loginInfoWrapStyle: {
//     backgroundColor: Colors.whiteColor,
//     elevation: 3.0,
//     borderRadius: Sizes.fixPadding,
//     paddingVertical: Sizes.fixPadding,
//     marginHorizontal: Sizes.fixPadding * 2.0,
//     paddingHorizontal: Sizes.fixPadding,
//     marginVertical: Sizes.fixPadding * 2.5,
//     ...CommonStyles.shadow,
//   },
//   animatedView: {
//     backgroundColor: "#333333",
//     position: "absolute",
//     bottom: 40,
//     alignSelf: "center",
//     borderRadius: Sizes.fixPadding - 5.0,
//     paddingHorizontal: Sizes.fixPadding + 5.0,
//     paddingVertical: Sizes.fixPadding,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   textFieldStyle: {
//     flex: 1,
//     marginLeft: Sizes.fixPadding,
//     ...Fonts.blackColor15Medium,
//     padding: 0,
//   },
// });

// export default LoginScreen;









import React, { useCallback, useState, useEffect } from "react";
import {
  BackHandler,
  TouchableOpacity,
  ScrollView,
  TextInput,
  View,
  Image,
  StyleSheet,
  Text,
  Alert,
  DeviceEventEmitter,
} from "react-native";
import { Colors, Fonts, Sizes, CommonStyles } from "../../constants/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import MyStatusBar from "../../components/myStatusBar";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔥 Import API constant
import { LOGIN_API } from "../services/api";



// Manual JWT decode — NO jwt-decode package
const decodeJWT = (token) => {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.log("Token decode failed:", e);
    return {};
  }
};

const LoginScreen = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [emailFocus, setEmailFocus] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordFocus, setPasswordFocus] = useState(false);
  const [backClickCount, setBackClickCount] = useState(0);

  // Check if already logged in
  useEffect(() => {
    checkAlreadyLoggedIn();
  }, []);

  const checkAlreadyLoggedIn = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decoded = decodeJWT(token);
        if (decoded.id || decoded._id) {
          router.replace("/drawer/homeScreen");
        }
      }
    } catch (err) {
      await AsyncStorage.removeItem("token");
    }
  };

  const backAction = () => {
    backClickCount === 1 ? BackHandler.exitApp() : _spring();
    return true;
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );
      return () => backHandler.remove();
    }, [backClickCount])
  );

  const _spring = () => {
    setBackClickCount(1);
    setTimeout(() => setBackClickCount(0), 1500);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert("Error", "Email aur password daal bhai!");
    }

    try {
      const res = await fetch(LOGIN_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        await AsyncStorage.setItem("token", data.token);

        const decoded = decodeJWT(data.token);
        const userId = decoded.id || decoded._id || decoded.userId;
        await AsyncStorage.setItem("userId", userId.toString());

        // Save user data
        const userData = data.user
          ? {
              name: data.user.name || data.user.fullName || "User",
              email: data.user.email || email,
              phone: data.user.phone || data.user.mobile || "+91 98765 43210",
              photo: data.user.photo || data.user.profileImage || null,
            }
          : {
              name: decoded.name || decoded.fullName || "User",
              email: decoded.email || email,
              phone: decoded.phone || decoded.mobile || "+91 98765 43210",
              photo: decoded.photo || null,
            };
        await AsyncStorage.setItem("userData", JSON.stringify(userData));

        // Save cart and wishlist if available
        if (data.cart) {
          await AsyncStorage.setItem("cart", JSON.stringify(data.cart));
          DeviceEventEmitter.emit("cartUpdated");
        }
        if (data.wishlist) {
          await AsyncStorage.setItem("wishlist", JSON.stringify(data.wishlist));
          DeviceEventEmitter.emit("wishlistUpdated");
        }

        DeviceEventEmitter.emit("authChanged");

        const userName = data.user?.name || decoded.name || "Bhai";
        Alert.alert("Success", `Welcome back ${userName}! 🎉`, [
          {
            text: "OK",
            onPress: () => {
              AsyncStorage.getItem("redirectAfterLogin").then((redirect) => {
                if (redirect) {
                  AsyncStorage.removeItem("redirectAfterLogin");
                  router.replace(redirect);
                } else {
                  router.replace("/drawer/homeScreen");
                }
              });
            },
          },
        ]);
      } else {
        Alert.alert("Login Failed", data.message || "Invalid email or password");
      }
    } catch (err) {
      console.log("Login error:", err);
      Alert.alert("Error", "Server off hai ya network issue!");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backColor }}>
      <MyStatusBar />
      <View style={{ flex: 1 }}>
        <ScrollView
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: Sizes.fixPadding * 10 }}
        >
          {appLogo()}
          {loginInfo()}
        </ScrollView>
      </View>

      {backClickCount === 1 && (
        <View style={styles.animatedView}>
          <Text style={{ ...Fonts.whiteColor14SemiBold }}>
            Press Back Once Again to Exit
          </Text>
        </View>
      )}
    </View>
  );

  function loginInfo() {
    return (
      <View style={styles.loginInfoWrapStyle}>
        {emailTextField()}
        {passwordTextField()}
        {forgotPasswordText()}
        {loginButton()}
        {createAccountText()}
      </View>
    );
  }

  function createAccountText() {
    return (
      <Text
        onPress={() => router.push("auth/createAccountScreen")}
        style={{ marginBottom: Sizes.fixPadding, textAlign: "center", ...Fonts.blackColor16Bold }}
      >
        CREATE ACCOUNT
      </Text>
    );
  }

  function forgotPasswordText() {
    return (
      <Text
        onPress={() => router.push("auth/resetPasswordScreen")}
        style={{
          marginTop: Sizes.fixPadding * 2,
          textAlign: "center",
          ...Fonts.blackColor16Bold,
        }}
      >
        FORGOT PASSWORD?
      </Text>
    );
  }

  function loginButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleLogin}
        style={styles.loginButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor15Bold }}>LOGIN</Text>
      </TouchableOpacity>
    );
  }

  function passwordTextField() {
    return (
      <View style={styles.textFieldWrapStyle}>
        <MaterialIcons
          name="vpn-key"
          color={passwordFocus ? Colors.primaryColor : Colors.grayColor}
          size={24}
        />
        <TextInput
          secureTextEntry
          selectionColor={Colors.primaryColor}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          onFocus={() => setPasswordFocus(true)}
          onBlur={() => setPasswordFocus(false)}
          style={styles.textFieldStyle}
        />
      </View>
    );
  }

  function emailTextField() {
    return (
      <View style={styles.textFieldWrapStyle}>
        <MaterialIcons
          name="email"
          color={emailFocus ? Colors.primaryColor : Colors.grayColor}
          size={24}
        />
        <TextInput
          selectionColor={Colors.primaryColor}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          onFocus={() => setEmailFocus(true)}
          onBlur={() => setEmailFocus(false)}
          style={styles.textFieldStyle}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>
    );
  }

  function appLogo() {
    return (
      <Image
        source={require("../../assets/images/logo/stylo_transparent.png")}
        style={{ width: 80, height: 80, alignSelf: "center" }}
        resizeMode="contain"
      />
    );
  }
};

const styles = StyleSheet.create({
  textFieldWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEEEEE",
    borderRadius: Sizes.fixPadding * 2,
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding,
  },
  loginButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding * 2.5,
    paddingVertical: Sizes.fixPadding + 2,
    paddingHorizontal: Sizes.fixPadding * 4,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    elevation: 10,
    marginVertical: Sizes.fixPadding + 10,
  },
  loginInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    elevation: 3,
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding * 2,
    paddingHorizontal: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding * 2.5,
    ...CommonStyles.shadow,
  },
  animatedView: {
    backgroundColor: "#333333",
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    borderRadius: Sizes.fixPadding - 5,
    paddingHorizontal: Sizes.fixPadding + 5,
    paddingVertical: Sizes.fixPadding,
    justifyContent: "center",
    alignItems: "center",
  },
  textFieldStyle: {
    flex: 1,
    marginLeft: Sizes.fixPadding,
    ...Fonts.blackColor15Medium,
    padding: 0,
  },
});

export default LoginScreen;
