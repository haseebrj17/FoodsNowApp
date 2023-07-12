import React, { useState } from 'react';
import { View, Text, TextInput, Alert, Dimensions, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import FlagItem from '../components/FlagItem';
import Button from '../components/Button';
import Input from '../components/Input';
import { StaticImageService } from '../services';
import { CountryCode } from '../assets/constants'
import { Display } from '../utils';
import { MaterialIcons, Octicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('screen');

const CodeConfirmationScreen = ({ route }) => {
    const [code, setCode] = useState('');

    const handleConfirmCode = async () => {
        try {
            const response = await axios.post('https://backendapi/confirm-code', {
                code,
            });

            if (response.data.success) {
                Alert.alert('Success', 'Your account has been verified!');
            } else {
                Alert.alert('Error', 'Invalid verification code.');
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to verify code.');
        }
    };

    let reqCode = 'Enter the 5 digit code send to your phone'
    let codeDone = 'Verification Successfull'
    let color = '#FFAF51'

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
                    >Code Confirmation</Text>
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
                            <MaterialIcons name="done" size={40} color={color}
                                style={{
                                    position: 'absolute'
                                }}
                            />
                        </View>
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: "400",
                                color: "#000",
                                margin: 20
                            }}
                        >{reqCode}</Text>
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
                            <Button title="Confirm" onPress={handleConfirmCode} />
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
                        margin: 10,
                    }}
                >
                </View>
            </View>
        </View>
    );
};

export default CodeConfirmationScreen;
