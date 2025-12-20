// import React, { useRef, useState, useCallback, useEffect } from 'react';
// import {
//     StatusBar,
//     Dimensions,
//     TouchableOpacity,
//     Animated,
//     Text,
//     View,
//     Image,
//     StyleSheet,
//     BackHandler,
// } from 'react-native';
// import { AntDesign } from '@expo/vector-icons';
// import { Fonts, Sizes } from '../../constants/styles';
// import { useFocusEffect } from '@react-navigation/native';
// import { useNavigation } from 'expo-router';

// const { width } = Dimensions.get('window');

// const AnimatedAntDesign = Animated.createAnimatedComponent(AntDesign);

// const DURATION = 1000;
// const TEXT_DURATION = DURATION * 0.8;

// const quotes = [
//     {
//         image: require('../../assets/images/onboarding_images/onboarding_1.png'),
//         title: 'Welcome To STYLO',
//         descriptions: 'All Fashion Products at One Shop Stop',
//     },
//     {
//         image: require('../../assets/images/onboarding_images/onboarding_2.png'),
//         title: 'Beautiful UI',
//         descriptions: 'STYLO is a Beautiful and Perfect UI for Fashion Store.',
//     },
//     {
//         image: require('../../assets/images/onboarding_images/onboarding_3.png'),
//         title: 'Easy & Secure',
//         descriptions: 'Your Security Matters.',
//     },
// ];

// const Circle = ({ navigation, onPress, index, quotes, animatedValue, animatedValue2 }) => {
//     const { initialBgColor, nextBgColor, bgColor } = colors[index];
//     const inputRange = [0, 0.001, 0.5, 0.501, 1];
//     const backgroundColor = animatedValue2.interpolate({
//         inputRange,
//         outputRange: [
//             initialBgColor,
//             initialBgColor,
//             initialBgColor,
//             bgColor,
//             bgColor,
//         ],
//     });
//     const dotBgColor = animatedValue2.interpolate({
//         inputRange: [0, 0.001, 0.5, 0.501, 0.9, 1],
//         outputRange: [
//             bgColor,
//             bgColor,
//             bgColor,
//             initialBgColor,
//             initialBgColor,
//             nextBgColor,
//         ],
//     });

//     return (
//         <Animated.View
//             style={[
//                 StyleSheet.absoluteFillObject,
//                 styles.container,
//                 { backgroundColor },
//             ]}
//         >
//             {
//                 index == 2
//                     ?
//                     <Text
//                         onPress={onPress}
//                         style={styles.startAndSkipTextStyle}
//                     >
//                         Start
//                     </Text>
//                     :
//                     <Text
//                         onPress={() => navigation.push('auth/loginScreen')}
//                         style={styles.startAndSkipTextStyle}
//                     >
//                         Skip
//                     </Text>
//             }
//             <Animated.View
//                 style={[
//                     styles.circle,
//                     {
//                         backgroundColor: dotBgColor,
//                         transform: [
//                             { perspective: 200 },
//                             {
//                                 rotateY: animatedValue2.interpolate({
//                                     inputRange: [0, 0.5, 1],
//                                     outputRange: ['0deg', '-90deg', '-180deg'],
//                                 }),
//                             },
//                             {
//                                 scale: animatedValue2.interpolate({
//                                     inputRange: [0, 0.5, 1],
//                                     outputRange: [1, 6, 1],
//                                 }),
//                             },
//                             {
//                                 translateX: animatedValue2.interpolate({
//                                     inputRange: [0, 0.5, 1],
//                                     outputRange: [1, 0.5, 1],
//                                 }),
//                             },
//                         ],
//                     },
//                 ]}
//             >
//                 <TouchableOpacity
//                     onPress={index == 2 ? () => navigation.push('auth/loginScreen') : onPress}
//                 >
//                     <Animated.View
//                         style={[
//                             styles.button,
//                             {
//                                 transform: [
//                                     {
//                                         scale: animatedValue.interpolate({
//                                             inputRange: [0, 0.05, 0.5, 1],
//                                             outputRange: [1, 0, 0, 1],
//                                         }),
//                                     },
//                                     {
//                                         rotateY: animatedValue.interpolate({
//                                             inputRange: [0, 0.5, 0.9, 1],
//                                             outputRange: ['0deg', '180deg', '180deg', '180deg'],
//                                         }),
//                                     },
//                                 ],
//                                 opacity: animatedValue.interpolate({
//                                     inputRange: [0, 0.05, 0.9, 1],
//                                     outputRange: [1, 0, 0, 1],
//                                 }),
//                             },
//                         ]}
//                     >
//                         <AnimatedAntDesign name='arrowright' size={28} color={'white'} />
//                     </Animated.View>
//                 </TouchableOpacity>
//             </Animated.View>
//         </Animated.View>
//     );
// };

// const colors = [
//     {
//         initialBgColor: '#A36562',
//         bgColor: '#E57373',
//         nextBgColor: '#A36562',
//     },
//     {
//         initialBgColor: '#E91E63',
//         bgColor: '#E57373',
//         nextBgColor: '#E91E63',
//     },
//     {
//         initialBgColor: '#E57373',
//         bgColor: '#E91E63',
//         nextBgColor: '#E57373',
//     },
// ];

// const OnboardingScreen = () => {

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

//     const [backClickCount, setBackClickCount] = useState(0);
//     const animatedValue = useRef(new Animated.Value(0)).current;
//     const animatedValue2 = useRef(new Animated.Value(0)).current;
//     const sliderAnimatedValue = useRef(new Animated.Value(0)).current;
//     const inputRange = [...Array(quotes.length).keys()];
//     const [index, setIndex] = useState(0);
//     const [onCirclePress, setOnCirclePress] = useState(false);
//     const [screenAppear, setscreenAppear] = useState(false);

//     useEffect(() => {
//         const unsubscribe = navigation.addListener('focus', () => {
//             setscreenAppear(true);
//         });

//         return unsubscribe;
//     }, [navigation]);

//     useEffect(() => {
//         const unsubscribe = navigation.addListener('blur', () => {
//             setscreenAppear(false)
//         });
//         return unsubscribe;
//     }, [navigation]);

//     useEffect(() => {
//         screenAppear ? setTimeout(function () {
//             if (onCirclePress) {
//                 setTimeout(() => {
//                     setOnCirclePress(false);
//                 }, 2000);
//             }
//             else {
//                 onPress()
//             }
//         }, 5000) : null
//     }, [index, screenAppear])

//     const animate = (i) =>
//         Animated.parallel([
//             Animated.timing(sliderAnimatedValue, {
//                 toValue: i,
//                 duration: TEXT_DURATION,
//                 useNativeDriver: true,
//             }),
//             Animated.timing(animatedValue, {
//                 toValue: 1,
//                 duration: DURATION,
//                 useNativeDriver: true,
//             }),
//             Animated.timing(animatedValue2, {
//                 toValue: 1,
//                 duration: DURATION,
//                 useNativeDriver: false,
//             }),
//         ]);

//     const onPress = () => {
//         animatedValue.setValue(0);
//         animatedValue2.setValue(0);
//         animate((index + 1) % colors.length).start();
//         setIndex(index != 2 ? index + 1 : 0);
//     };

//     return (
//         <View style={{ flex: 1, justifyContent: 'center' }}>
//             <StatusBar translucent={true} backgroundColor='transparent' barStyle={'light-content'} />
//             <Circle
//                 index={index}
//                 onPress={() => {
//                     setOnCirclePress(true)
//                     onPress()
//                 }}
//                 animatedValue={animatedValue}
//                 animatedValue2={animatedValue2}
//                 navigation={navigation}
//             />
//             <Animated.View
//                 style={{
//                     flexDirection: 'row',
//                     transform: [
//                         {
//                             translateX: sliderAnimatedValue.interpolate({
//                                 inputRange,
//                                 outputRange: quotes.map((_, i) => -i * width * 2),
//                             }),
//                         },
//                     ],
//                     opacity: sliderAnimatedValue.interpolate({
//                         inputRange: [...Array(quotes.length * 2 + 1).keys()].map(
//                             (i) => i / 2
//                         ),
//                         outputRange: [...Array(quotes.length * 2 + 1).keys()].map((i) =>
//                             i % 2 === 0 ? 1 : 0
//                         ),
//                     }),
//                 }}
//             >
//                 {quotes.map(({ title, descriptions, image }, i) => {
//                     return (
//                         <View style={{ paddingRight: width, width: width * 2, }} key={i}>
//                             <Image
//                                 source={image}
//                                 style={{ alignSelf: 'center', width: 200.0, height: 200.0, }}
//                                 resizeMode="contain"
//                             />
//                             <Text style={{ margin: Sizes.fixPadding * 2.0, textAlign: 'center', ...Fonts.whiteColor25Bold }}>
//                                 {title}
//                             </Text>
//                             <Text style={styles.descriptionTextStyle}>
//                                 {descriptions}
//                             </Text>
//                             <View style={styles.pageIndicatorWrapStyle}>
//                                 {indicator({ pageIndex: 0 })}
//                                 {indicator({ pageIndex: 1 })}
//                                 {indicator({ pageIndex: 2 })}
//                             </View>
//                         </View>
//                     );
//                 })}
//             </Animated.View>
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
//     );

//     function indicator({ pageIndex }) {
//         return (
//             index == pageIndex
//                 ?
//                 <View style={styles.activeIndicatorStyle} />
//                 :
//                 <View style={styles.inactiveIndicatorStyle} />
//         )
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         alignItems: 'flex-end',
//         padding: 8,
//     },
//     button: {
//         height: 100,
//         width: 100,
//         borderRadius: 50,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     circle: {
//         alignItems: 'flex-end',
//         backgroundColor: 'turquoise',
//         width: 100,
//         height: 100,
//         borderRadius: 50,
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
//     activeIndicatorStyle: {
//         width: 20.0,
//         height: 20.0,
//         borderRadius: 10.0,
//         borderWidth: 2.0,
//         marginHorizontal: Sizes.fixPadding - 5.0,
//         borderColor: 'rgba(255,255,255,0.5)',
//         backgroundColor: 'rgba(255,255,255,0.5)',
//     },
//     inactiveIndicatorStyle: {
//         width: 20.0,
//         height: 20.0,
//         borderRadius: 10.0,
//         borderWidth: 2.0,
//         marginHorizontal: Sizes.fixPadding - 5.0,
//         borderColor: 'rgba(255,255,255,0.5)',
//     },
//     descriptionTextStyle: {
//         fontSize: 16,
//         color: "rgba(255,255,255,0.6)",
//         textAlign: 'center',
//         fontFamily: 'Montserrat_Medium',
//     },
//     pageIndicatorWrapStyle: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginTop: Sizes.fixPadding * 3.0,
//     },
//     startAndSkipTextStyle: {
//         position: 'absolute',
//         left: 20.0,
//         bottom: 45.0,
//         ...Fonts.whiteColor15Bold,
//         zIndex: 100
//     }
// });

// export default OnboardingScreen;















import React, { useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  BackHandler,
} from "react-native";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const quotes = [
  {
    image: require("../../assets/images/onboarding_images/onboarding_1.png"),
    title: "Welcome To STYLO",
    descriptions: "All Fashion Products at One Shop Stop",
  },
  {
    image: require("../../assets/images/onboarding_images/onboarding_2.png"),
    title: "Beautiful UI",
    descriptions: "STYLO is a Beautiful and Perfect UI for Fashion Store.",
  },
  {
    image: require("../../assets/images/onboarding_images/onboarding_3.png"),
    title: "Easy & Secure",
    descriptions: "Your Security Matters.",
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const sliderAnimatedValue = useRef(new Animated.Value(0)).current;

  const onPress = () => {
    const nextIndex = (index + 1) % quotes.length;
    setIndex(nextIndex);

    Animated.timing(sliderAnimatedValue, {
      toValue: nextIndex,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);
      return () => backHandler.remove();
    }, [])
  );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <Animated.View
        style={{
          flexDirection: "row",
          width: width * quotes.length,
          transform: [
            {
              translateX: sliderAnimatedValue.interpolate({
                inputRange: [0, 1, 2],
                outputRange: [0, -width, -2 * width],
              }),
            },
          ],
        }}
      >
        {quotes.map((item, i) => (
          <View key={i} style={{ width: width, alignItems: "center", paddingTop: 60 }}>
            <Image source={item.image} style={styles.image} resizeMode="contain" />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.descriptions}</Text>
            <View style={styles.dots}>
              {quotes.map((_, dot) => (
                <View key={dot} style={[styles.dot, index === dot && styles.activeDot]} />
              ))}
            </View>
          </View>
        ))}
      </Animated.View>

      <TouchableOpacity
        style={styles.nextBtn}
        onPress={index === quotes.length - 1 ? () => router.push("/auth/loginScreen") : onPress}
      >
        <AntDesign name="arrowright" size={28} color="white" />
      </TouchableOpacity>

      {index !== quotes.length - 1 && (
        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => router.push("/auth/loginScreen")}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#E57373" },
  image: { width: 200, height: 200, alignSelf: "center" },
  title: { fontSize: 25, fontWeight: "bold", color: "white", textAlign: "center", marginTop: 30 },
  desc: { fontSize: 16, color: "rgba(255,255,255,0.8)", textAlign: "center", marginTop: 10 },
  dots: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  dot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: "rgba(255,255,255,0.5)", marginHorizontal: 5 },
  activeDot: { backgroundColor: "white" },
  nextBtn: { position: "absolute", right: 20, bottom: 50, backgroundColor: "#27ae60", width: 70, height: 70, borderRadius: 35, justifyContent: "center", alignItems: "center" },
  skipBtn: { position: "absolute", left: 20, bottom: 60 },
  skipText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
