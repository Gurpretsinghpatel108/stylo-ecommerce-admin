

// import React, { useEffect } from "react";
// import { View, Image } from "react-native";
// import { Colors, Sizes } from "../constants/styles";
// import { Bounce } from 'react-native-animated-spinkit';
// import MyStatusBar from "../components/myStatusBar";
// import { useNavigation } from "expo-router";

// const SplashScreen = () => {

//     const navigation = useNavigation();

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             navigation.push('onboarding/onboardingScreen')
//         }, 2000);
//         return () => {
//             clearTimeout(timer);
//         }
//     }, [])

//     return (
//         <View style={{ flex: 1, backgroundColor: Colors.backColor, }}>
//             <MyStatusBar />
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                 {appLogo()}
//                 <Bounce
//                     size={48}
//                     color={Colors.primaryColor}
//                     style={{ marginTop: Sizes.fixPadding * 3.0 }}
//                 />
//             </View>
//         </View>
//     )

//     function appLogo() {
//         return (
//             <Image
//                 source={require('../assets/images/logo/stylo_transparent.png')}
//                 style={{ width: 90.0, height: 90.0, }}
//                 resizeMode="contain"
//             />
//         )
//     }
// }

// export default SplashScreen;





// import React, { useEffect } from "react";
// import { View, Image } from "react-native";
// import { Colors, Sizes } from "../constants/styles";
// import { Bounce } from 'react-native-animated-spinkit';
// import MyStatusBar from "../components/myStatusBar";
// import { useNavigation } from "expo-router";

// const SplashScreen = () => {

//     const navigation = useNavigation();

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             navigation.replace('auth/loginScreen');
//         }, 2000);
//         return () => {
//             clearTimeout(timer);
//         }
//     }, []);

//     return (
//         <View style={{ flex: 1, backgroundColor: Colors.backColor }}>
//             <MyStatusBar />
//             <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//                 {appLogo()}
//                 <Bounce
//                     size={48}
//                     color={Colors.primaryColor}
//                     style={{ marginTop: Sizes.fixPadding * 3.0 }}
//                 />
//             </View>
//         </View>
//     );

//     function appLogo() {
//         return (
//             <Image
//                 source={require('../assets/images/logo/stylo_transparent.png')}
//                 style={{ width: 90.0, height: 90.0 }}
//                 resizeMode="contain"
//             />
//         );
//     }
// }

// export default SplashScreen;









import React, { useEffect } from "react";
import { View, Image } from "react-native";
import { Colors, Sizes } from "../constants/styles";
import { Bounce } from 'react-native-animated-spinkit';
import MyStatusBar from "../components/myStatusBar";
import { useRouter } from "expo-router";

const SplashScreen = () => {

    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace("/drawer/homeScreen");   // Correct route
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: Colors.backColor }}>
            <MyStatusBar />
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image
                    source={require('../assets/images/logo/stylo_transparent.png')}
                    style={{ width: 90, height: 90 }}
                    resizeMode="contain"
                />
                <Bounce size={48} color={Colors.primaryColor} style={{ marginTop: Sizes.fixPadding * 3 }} />
            </View>
        </View>
    );
};

export default SplashScreen;
