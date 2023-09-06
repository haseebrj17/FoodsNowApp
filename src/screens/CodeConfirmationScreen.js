import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Alert, Dimensions, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import FlagItem from '../components/FlagItem';
import Button from '../components/Button';
import Input from '../components/Input';
import AuthenticationService from '../services/AuthenticationService';
import { CountryCode } from '../assets/constants'
import { Display } from '../utils';
import { MaterialIcons, Entypo, Octicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('screen');

const CodeConfirmationScreen = ({ navigation, route }) => {
    const { userId } = route.params;
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [codeData, setCodeDate] = useState(null)
    useEffect(() => {
        setCodeDate({
            id: userId,
            code: code,
        })
    }, [code])

    const [animationData, setAnimationData] = useState({
        reqCode: 'Enter the 5 digit code send to your phone',
        codeDone: 'Code Confirmation',
        color: '#325964',
        name: 'cross',
    })

    const handleConfirmCode = async () => {
        try {
            const response = await AuthenticationService.phoneVerification(codeData);
            console.log(codeData, response)
            setIsLoading(false);

            if (response?.isSuccess) {
                setAnimationData({
                    reqCode: 'Phone number successfully verified',
                    codeDone: 'Verified',
                    color: '#FFAF51',
                    name: 'check',
                });
                setTimeout(() => {
                    navigation.navigate('Main')
                }, 5000);
                // Alert.alert('Success', 'Your account has been verified!');
            } else {
                Alert.alert('Error', response?.message || 'Invalid verification code.');
            }

        } catch (error) {
            console.log('Verification error:', error);
            Alert.alert('Error', 'Unable to verify code.');
        }
    };


    return (
        <View
            style={{
                backgroundColor: '#325962',
                flex: 1
            }}
        >
            <View
                style={{
                    backgroundColor: '#f1f1f1'
                }}
            >
                <View
                    style={{
                        width: width,
                        height: width / 4,
                        backgroundColor: '#f1f1f1',
                        overflow: 'hidden',

                    }}
                >
                    <Image
                        source={require('../assets/images/pattern15.png')}
                        style={{
                            width: width,
                            height: width / 4,
                            aspectRatio: 2000 / 500,
                        }}
                    />
                </View>
            </View>
            <View
                style={{
                    flex: 1,
                    overflow: 'hidden'
                }}
            >
                <Image
                    source={require('../assets/images/pattern15.png')}
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        width: width,
                        height: width / 4,
                        aspectRatio: 2000 / 500,
                    }}
                />
                <View
                    style={{
                        borderRadius: 75,
                        backgroundColor: '#f1f1f1',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }}
                >
                    <Text
                        style={{
                            fontSize: 36,
                            fontWeight: 'bold',
                            color: '#325962',
                            alignSelf: 'center',
                            margin: 20,
                            position: 'absolute',
                            top: "0%",
                        }}
                    >{animationData.codeDone}</Text>
                    <View
                        flex="0.7"
                        justifyContent='flex-end'
                        alignItems='center'
                        style={{
                            marginTop: 150
                        }}
                    >
                        <View
                            style={{
                                width: 110,
                                height: 110,
                                backgroundColor: '#325964',
                                borderRadius: "100%",
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Image
                                source={require('../assets/icons/shield.png')}
                                style={{
                                    width: 80,
                                    height: 80
                                }}
                            />
                            <Entypo name={animationData.name} size={40} color={animationData.color}
                                style={{
                                    position: 'absolute'
                                }}
                            />
                        </View>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "600",
                                color: "#6b7280",
                                margin: 20
                            }}
                        >{animationData.reqCode}</Text>
                        <View
                            width={width * 0.9}
                            height='50%'
                            justifyContent='flex-end'
                        >
                            <Input
                                iconName='lock-outline'
                                value={code}
                                onChangeText={setCode}
                                placeholder="Verification Code"
                                keyboardType="numeric"
                            />
                            <Button title='Confirm' onPress={handleConfirmCode} />
                        </View>
                    </View>
                </View>
            </View>
            <View
                style={{
                    height: 170,
                    backgroundColor: '#325962'
                }}
            >
                <View
                    style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        margin: Display.setHeight(7),
                    }}
                >
                    <Text
                        style={{
                            fontSize: Display.setHeight(2),
                            color: '#FFAF51',
                        }}
                    >Terms and Coditions are applied</Text>
                </View>
            </View>
        </View>
    );
};

export default CodeConfirmationScreen;
