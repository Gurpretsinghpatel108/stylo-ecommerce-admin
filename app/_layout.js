// import { useFonts } from 'expo-font';
// import { Stack } from 'expo-router';
// import * as SplashScreen from 'expo-splash-screen';
// import { useEffect } from 'react';
// import { AppState, LogBox, StatusBar } from 'react-native';

// LogBox.ignoreAllLogs();

// SplashScreen.preventAutoHideAsync();

// export default function RootLayout() {

//   const [loaded] = useFonts({
//     Montserrat_Light: require("../assets/fonts/montserrat/Montserrat-Light.ttf"),
//     Montserrat_Regular: require("../assets/fonts/montserrat/Montserrat-Regular.ttf"),
//     Montserrat_Medium: require("../assets/fonts/montserrat/Montserrat-Medium.ttf"),
//     Montserrat_SemiBold: require("../assets/fonts/montserrat/Montserrat-SemiBold.ttf"),
//     Montserrat_Bold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
//     Alatsi_Regular: require("../assets/fonts/Alatsi-Regular.ttf")
//   });

//   useEffect(() => {
//     if (loaded) {
//       SplashScreen.hideAsync();
//     }
//     const subscription = AppState.addEventListener("change", (_) => {
//       StatusBar.setBarStyle("light-content");
//     });
//     return () => {
//       subscription.remove();
//     };
//   }, [loaded]);

//   if (!loaded) {
//     return null;
//   }

//   return (
//     <Stack screenOptions={{ headerShown: false, animation: 'ios_from_right' }}>
//       <Stack.Screen name="index" />
//       <Stack.Screen name="onboarding/onboardingScreen" options={{ gestureEnabled: false }} />
//       <Stack.Screen name="auth/loginScreen" options={{ gestureEnabled: false }} />
//       <Stack.Screen name="auth/createAccountScreen" />
//       <Stack.Screen name="auth/resetPasswordScreen" />
//       <Stack.Screen name="drawer" options={{ gestureEnabled: false }} />
//       <Stack.Screen name="search/searchScreen" />
//       <Stack.Screen name="notifications/notificationsScreen" />
//       <Stack.Screen name="wishlist/wishlistScreen" />
//       <Stack.Screen name="bag/bagScreen" />
//       <Stack.Screen name="delivery/deliveryScreen" />
//       <Stack.Screen name="payment/paymentScreen" />
//       <Stack.Screen name="categoryDetail/categoryDetailScreen" />
//       <Stack.Screen name="products/productsScreen" />
//       <Stack.Screen name="filter/filterScreen" />
//       <Stack.Screen name="productDetail/productDetailScreen" />
//       <Stack.Screen name="sizeChart/sizeChartScreen" />
//       <Stack.Screen name="orders/ordersScreen" />
//       <Stack.Screen name="account/accountScreen" />
//       <Stack.Screen name="accountSetting/accountSettingScreen" />
//       <Stack.Screen name="faq/faqScreen" />
//       <Stack.Screen name="aboutApp/aboutAppScreen" />
//     </Stack>
//   );
// }









// import React from "react";
// import { Stack } from "expo-router";
// import { deactivateKeepAwake } from "expo-keep-awake"; // ✅ Import fix

// // Disable expo keep-awake to prevent "Unable to activate keep awake" error
// deactivateKeepAwake(); // ✅ Run once globally

// export default function RootLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       {/* Drawer folder ek screen ke jaise treat hoga */}
//       <Stack.Screen name="drawer" options={{ headerShown: false }} />
//     </Stack>
//   );
// }








// // app/_layout.js
// import React from "react";
// import { Stack } from "expo-router";
// import { deactivateKeepAwake } from "expo-keep-awake";

// deactivateKeepAwake(); // prevent keep-awake error

// export default function RootLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       {/* Starting point for the app */}
//       <Stack.Screen name="index" />

//       {/* Auth Screens */}
//       <Stack.Screen name="auth/loginScreen" />

//       {/* Drawer screens */}
//       <Stack.Screen name="drawer" />
//     </Stack>
//   );
// }









// app/_layout.js
import React from "react";
import { Stack } from "expo-router";
import { deactivateKeepAwake } from "expo-keep-awake";

deactivateKeepAwake(); // prevent keep-awake error

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Starting point for the app */}
      <Stack.Screen name="index" />

      {/* Auth Screens */}
      <Stack.Screen name="auth/loginScreen" />

      {/* Drawer screens */}
      <Stack.Screen name="drawer" />
    </Stack>
  );
}
