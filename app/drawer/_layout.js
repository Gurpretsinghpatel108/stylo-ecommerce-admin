// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { Drawer } from 'expo-router/drawer';
// import CustomDrawer from '../../components/drawerContent';
// import MyStatusBar from '../../components/myStatusBar';

// export default function Layout() {
//     return (
//         <GestureHandlerRootView style={{ flex: 1 }}>
//             <Drawer
//                 drawerContent={() => <CustomDrawer />}
//                 screenOptions={{
//                     headerShown: false,
//                     drawerType: 'front',
//                 }}
//             >
//                 <Drawer.Screen name="homeScreen" />
//             </Drawer>
//         </GestureHandlerRootView>
//     );
// }









// import React from "react";
// import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { Drawer } from "expo-router/drawer";
// import CustomDrawer from "../../components/drawerContent";

// export default function DrawerLayout() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Drawer
//         drawerContent={() => <CustomDrawer />}
//         screenOptions={{
//           headerShown: false,
//           drawerType: "slide",
//           swipeEdgeWidth: 100,
//         }}
//       >
//         <Drawer.Screen name="homeScreen" />
//       </Drawer>
//     </GestureHandlerRootView>
//   );
// }





// app/drawer/_layout.js (or .tsx)
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomDrawer from "../../components/drawerContent"; // adjust path if needed

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <CustomDrawer {...props} />} // ← Props spread karna MUST hai!
        screenOptions={{
          headerShown: false,
          drawerType: "slide",           // slide, front, back, permanent
          swipeEdgeWidth: 100,
          drawerStyle: {
            width: 280,                 // recommended width for better UX
            backgroundColor: "#fff",    // customize agar chaho
          },
          sceneContainerStyle: {
            backgroundColor: "#f8f8f8", // optional
          },
        }}
      >
        {/* Home screen – name file ke hisab se exact match karo */}
        <Drawer.Screen
          name="homeScreen"
          options={{
            drawerLabel: "Home",
            title: "Home",
            // drawerIcon: ({ color, size }) => (
            //   <Icon name="home" size={size} color={color} />
            // ),
          }}
        />

        {/* Agar aur screens hain drawer folder mein, unko yahan add karo */}
        {/* Example: */}
        {/* <Drawer.Screen name="profile" options={{ drawerLabel: "Profile" }} /> */}
        {/* <Drawer.Screen name="orders" options={{ drawerLabel: "Orders" }} /> */}
        {/* <Drawer.Screen name="wishlist" options={{ drawerLabel: "Wishlist" }} /> */}

      </Drawer>
    </GestureHandlerRootView>
  );
}