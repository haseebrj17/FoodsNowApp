import { View, Image, Text, Dimensions } from "react-native";
import { Splash } from "../assets/constants/Slider";
import { Fonts } from "../assets/constants";
import { NativeBaseProvider } from "native-base";
import { useState } from "react";

const { width, height } = Dimensions.get('window');

const SplashScreen  = () => {
    return (
        <View
            style={{
                width,
                height,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#325963'
            }}
        >
            <Image source={require('../assets/SplashGreen.gif')} 
                style={{
                    resizeMode: 'contain',
                    width: width,
                }}
            />
        </View>
    )
}

export default SplashScreen;