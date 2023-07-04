import { NativeBaseProvider } from "native-base";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { Animated, Text, FlatList, Image, View, StyleSheet, Dimensions } from "react-native"
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SplashScreen } from '../assets/constants/Slider';
import { bgs } from "../assets/constants";
const { width, height } = Dimensions.get('screen');

const Indicator = ({ scrollX }) => {
    return (
        <View
            style={{
                position: 'absolute',
                bottom: 100,
                flexDirection: 'row',
            }}
        >
            {SplashScreen.map((_, i) => {
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                const scale = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.8, 1.4, 0.8],
                    extrapolate: 'clamp'
                })
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.6, 1, 0.6],
                    extrapolate: 'clamp'
                })
                return <Animated.View
                    key={`indicator-${i}`}
                    style={{
                        height: 10,
                        width: 10,
                        borderRadius: 5,
                        backgroundColor: 'white',
                        opacity,
                        margin: 10,
                        transform: [
                            {
                                scale,
                            }
                        ]
                    }}
                />;
            })}
        </View>
    )
}

const Backdrop = ({ scrollX }) => {
    const backgroundColor = scrollX.interpolate({
        inputRange: bgs.map((_, i) => i * width),
        outputRange: bgs.map((bg) => bg),
    })
    return (
        <Animated.View
            style={[StyleSheet.absoluteFillObject, {
                backgroundColor

            }]}
        />
    )
}

const Square = ({ scrollX }) => {
    const YOLO  = Animated.modulo(Animated.divide(
        Animated.modulo(scrollX, width),
        new Animated.Value(width)
    ), 1);

    const rotate  = YOLO.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: ['35deg', '0deg', '35deg'],
    })
    const translateX  = YOLO.interpolate({
        inputRange: [0, 0.5, 1],
        outputRange: [0, -height, 0],
    })
    return (
        <Animated.View
            style={{ 
                width: height, 
                height: height, 
                backgroundColor: '#fff', 
                borderRadius: 86,
                position: 'absolute',
                top: -height * 0.6,
                left: -height * 0.3,
                transform: [
                    {
                        rotate,
                    },
                    {
                        translateX
                    }
                ]
            }}
        />
    )
}

const WelcomeScreen = () => {
    const scrollX = React.useRef(new Animated.Value(0)).current
    const [splash, setSplash] = useState(SplashScreen);

    const renderItem = ({ item }) => {
        return (
            <View style={{ width, alignItems: 'center', paddingBottom: 20 }}>
                <View style={{ flex: 0.7, justifyContent: 'center ' }}>
                    <Image source={item.image} style={{ width: width / 2, height: height / 2, resizeMode: 'contain' }} />
                </View>
                <View style={{ flex: 0.3 }}>
                    <Text style={{ fontWeight: '800', fontSize: 28, marginBottom: 10, color: 'white', marginTop: 30, }}>{item.title}</Text>
                    <Text style={{ fontWeight: '300', color: 'white' }}>{item.description}</Text>
                </View>
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <StatusBar hidden />
            <Backdrop scrollX={scrollX} />
            <Square scrollX={scrollX} />
            <Animated.FlatList
                data={splash}
                keyExtractor={item => item.key}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={renderItem}
                scrollEventThrottle={32}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                    { useNativeDriver: false },
                )}
                contentContainerStyle={{ paddingBottom: 100 }}
                pagingEnabled
            />
            <Indicator scrollX={scrollX} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default WelcomeScreen;