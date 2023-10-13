import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import Animated, { Easing, withSpring, useSharedValue, useAnimatedStyle, withRepeat, withSequence } from 'react-native-reanimated';

export default function Dashboard({ navigation }) {


    const scale = useSharedValue(1); // Initial scale value
    const translateY = useSharedValue(0); // Y-translation value

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }, { translateY: translateY.value }],
        };
    });

    const startAnimation = () => {
        scale.value = withSequence(
            withSpring(1.5, { damping: 2, stiffness: 80 }),
            withSpring(1)
        );

        translateY.value = withRepeat(
            withSpring(100, { damping: 2, stiffness: 80, velocity: 1 }),
            -1, // Set to -1 to repeat indefinitely
            false // Use native driver
        );
    };


    return (
        <SafeAreaView style={{ backgroundColor: "#000000", height: "100%", alignItems: 'center' }}>
            <View style={{ flexDirection: "row", justifyContent: 'center' }}>
                <Text style={{ marginTop: 60, marginHorizontal: 20, fontSize: 30, color: "#FFFFFF", textAlign: 'left', fontWeight: '600' }}>Your Eyes, Our {'\n'}Vision, Limitless{'\n'} Possibilities. </Text>
                <Image style={{ height: 55, width: 55, marginTop: 95, marginHorizontal: 47 }} source={require('../assets/person2.png')}></Image>
            </View>
            <LinearGradient
                colors={['#4420FF', '#437FFF']}
                start={{ x: 1, y: 1 }}
                end={{ x: 0, y: 0 }}
                locations={[0, 1]}
                style={{ height: 160, width: 350, marginTop: 32, borderRadius: 20, backgroundColor: "#3066be", alignSelf: 'center' }}>

            </LinearGradient>
            <Text style={{ color: "#FFFFFF", marginTop: 48, marginHorizontal: 42, fontSize: 18, fontWeight: '600', fontSize: 18, alignSelf: 'flex-start' }}>Choose one</Text>
            <View style={{ flexDirection: "row", justifyContent: 'space-evenly', alignItems: 'center', width: '95%' }}>

                <TouchableOpacity onPress={() => { navigation.navigate("ImageCaption") }} style={{ height: 180, width: 165, backgroundColor: "#161616", marginTop: 24, borderRadius: 20, alignItems: "center" }}>
                    <Image style={{ height: 30, width: 30, marginTop: "40%", resizeMode: 'contain' }} source={require('../assets/image1icon.png')}></Image>
                    <Text style={{ marginTop: 26, color: "#656565" }}>Explain Scene</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { navigation.navigate("ImageCaption") }} style={{ height: 180, width: 165, backgroundColor: "#161616", marginTop: 24, borderRadius: 20, alignItems: "center" }}>
                    <Image style={{ height: 30, width: 30, marginTop: "40%", resizeMode: 'contain' }} source={require('../assets/image2icon.png')}></Image>
                    <Text style={{ marginTop: 26, color: "#656565" }}>Explain Scene</Text>
                </TouchableOpacity>
            </View>
            <View style={{ width: '115%', height: '35%', borderTopRightRadius: 500, borderTopLeftRadius: 500, backgroundColor: '#0c0c0c', position: 'absolute', bottom: -100 }}></View>
           <TouchableOpacity onPress={()=>{startAnimation()}}>

           
            <Animated.View style={animatedStyle}>
                <TouchableOpacity style={{ width: '100%', height: '30%', borderTopRightRadius: 500, borderTopLeftRadius: 500, backgroundColor: '#161616', position: 'absolute', bottom: -100, justifyContent: 'center', alignItems: 'center' }}>
                    <FontAwesome name="microphone" size={32} color="#4368FF" style={{ marginTop: -100 }} />
                </TouchableOpacity>
            </Animated.View>
            </TouchableOpacity>


        </SafeAreaView>
    );
}
