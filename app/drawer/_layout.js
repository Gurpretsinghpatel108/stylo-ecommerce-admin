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









import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import CustomDrawer from "../../components/drawerContent";

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={() => <CustomDrawer />}
        screenOptions={{
          headerShown: false,
          drawerType: "slide",
          swipeEdgeWidth: 100,
        }}
      >
        <Drawer.Screen name="homeScreen" />
      </Drawer>
    </GestureHandlerRootView>
  );
}
