import React, { useRef, useEffect } from 'react';
import { Button, StyleSheet, View, Dimensions, Text, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import data from '../assets/data.json'
import { Audio } from 'expo-av';
import sound from '../assets/PlaceOrderSuccess.mp3'
import { Display } from '../utils';
import { Separator } from '../components';
import { MaterialIcons } from '@expo/vector-icons'

const { width, height } = Dimensions.get('screen')

const OrderConfirmationScreen = ({ navigation }) => {
    const animation = useRef(null);
    const soundObject = new Audio.Sound();

    useEffect(() => {
        animation.current?.play();

        const playSound = async () => {
            try {
                await soundObject.loadAsync(require('../assets/PlaceOrderSuccess.mp3'));
                await soundObject.playAsync();
            } catch (error) {
                console.log('Error playing sound:', error);
            }
        };

        playSound();
        return () => {
            soundObject.unloadAsync();
        };
    }, []);

    return (
        <View
            style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'flex-start',
                backgroundColor: '#fff'
            }}
        >
            <TouchableOpacity
                onPress={() => {
                    if (navigation.canGoBack()) {
                        navigation.navigate('Main');
                    } else {
                        navigation.navigate('Cart');
                    }
                }}
                style={{
                    position: "absolute",
                    left: "1%",
                    top: "2%",
                    marginTop: Display.setHeight(3.5),
                    zIndex: 999,
                }}>
                <MaterialIcons
                    name="keyboard-arrow-left"
                    size={50}
                    color="#f1f1f1"
                />
            </TouchableOpacity>
            <LottieView
                ref={animation}
                style={{
                    width: Display.setWidth(100),
                    backgroundColor: '#325964',
                }}
                // Set loop to false to prevent continuous looping
                loop={false}
                source={data}
            />
            <Separator height={Display.setHeight(0.1)} color={'#f1f1f1'} width={width} />
            <View
                style={{
                    width,
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: Display.setHeight(3)
                }}
            >
                <Text
                    style={{
                        fontSize: Display.setHeight(2.6),
                        fontWeight: 'bold',
                        color: '#325964',
                        marginBottom: Display.setHeight(3)
                    }}
                >Order was placed successfully</Text>
                <Separator height={Display.setHeight(0.1)} color={'#f1f1f1'} width={width} />
                <View
                    style={{
                        width,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <View
                        style={{
                            width: '90%',
                            alignItems: 'flex-start',
                            justifyContent: 'flex-start'
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: '#000',
                                marginTop: Display.setHeight(2)
                            }}
                        >
                            Order Status
                        </Text>
                        <View
                            style={{
                                width: width * 0.9,
                                height: Display.setHeight(8),
                                backgroundColor: '#f1f1f1',
                                borderRadius: Display.setHeight(1.2),
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                flexDirection: 'row',
                                padding: "3%",
                                marginTop: Display.setHeight(2)
                            }}
                        >
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <MaterialIcons name="info" size={20} color="#6d6d6d" />
                            </View>
                            <View
                                style={{
                                    width: '90%',
                                    marginLeft: 5
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: Display.setHeight(1.3),
                                        fontWeight: '400'
                                    }}
                                >We will try to deliver your order as soon as possible. Our chefs are working on your order once there is a change in the order status we will notify you.</Text>
                            </View>
                        </View>
                        <Text
                            style={{

                            }}
                        >

                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default OrderConfirmationScreen