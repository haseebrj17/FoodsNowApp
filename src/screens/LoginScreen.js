import { StyleSheet, Text, View, Dimensions, ImageBackground, TouchableOpacity, Image, Keyboard, Alert } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-paper'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Backdrop } from 'react-native-backdrop';
import { FormControl, Stack, WarningOutlineIcon, Box, Center, NativeBaseProvider, Icon } from "native-base";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import CryptoJS from 'react-native-crypto-js';
import GoogleIcon from '../assets/icons/Google';
import AppleIcon from '../assets/icons/Apple';
import Input from '../components/Input';
import Loader from '../components/Loader';
import Button from '../components/Button';

const { width, height } = Dimensions.get('screen')

const LoginScreen = ({ navigation }) => {
    const [inputs, setInputs] = React.useState({ email: '', password: '' });
    const [errors, setErrors] = React.useState({});
    const [loading, setLoading] = React.useState(false);

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: '<YOUR_CLIENT_ID>',
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;

            // send to the backend for verification
            fetch("https://backend.com/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id_token }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        navigation.navigate('Home');
                    } else {
                        // Handle unsuccessful login attempt
                        Alert.alert('Error', data.error);
                    }
                })
                .catch((error) => {
                    // handle error
                });
        }
    }, [response]);

    const handleGoogleLogin = async () => {
        promptAsync();
    };


    const handleAppleLogin = async () => {
        const csrf = Math.random().toString(36).substring(2, 15);
        const nonce = Math.random().toString(36).substring(2, 10);
        const hashedNonce = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            nonce
        );
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
                nonce: hashedNonce,
            });
            const { identityToken } = credential;
            // send to the backend for verification
            fetch("https://backend.com/auth/apple", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ identityToken, nonce }),
            })
                .then((response) => response.json())
                .then((data) => {
                    // If login successful, navigate to Home
                    if (data.success) {
                        navigation.navigate('Home');
                    } else {
                        // Handle unsuccessful login attempt
                        Alert.alert('Error', data.error);
                    }

                })
                .catch((error) => {
                    // handle error
                });
        } catch (e) {
            if (e.code === 'ERR_CANCELED') {
                // handle error from a canceled sign-in
            }
        }
    };



    const validate = async () => {
        Keyboard.dismiss();
        let isValid = true;
        if (!inputs.email) {
            handleError('Please input email', 'email');
            isValid = false;
        }
        if (!inputs.password) {
            handleError('Please input password', 'password');
            isValid = false;
        }
        if (isValid) {
            login();
        }
    };

    const login = () => {
        setLoading(true);
        setTimeout(async () => {
            setLoading(false);
            let userData = await AsyncStorage.getItem('userData');
            if (userData) {
                userData = JSON.parse(userData);
                if (
                    inputs.email == userData.email &&
                    inputs.password == userData.password
                ) {
                    navigation.navigate('Main');
                    AsyncStorage.setItem(
                        'userData',
                        JSON.stringify({ ...userData, loggedIn: true }),
                    );
                } else {
                    Alert.alert('Error', 'Invalid Details');
                }
            } else {
                Alert.alert('Error', 'User does not exist');
            }
        }, 3000);
    };

    const handleOnchange = (text, input) => {
        setInputs(prevState => ({ ...prevState, [input]: text }));
    };

    const handleError = (error, input) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
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
                        borderBottomLeftRadius: 75,
                    }}
                >
                    <Image
                        source={require('../assets/images/pattern15.png')}
                        style={{
                            width: width,
                            height: width / 4,
                            aspectRatio: 2000 / 500,
                            borderBottomLeftRadius: 75,
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
                        borderTopLeftRadius: 0,
                        backgroundColor: '#f1f1f1',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View
                        style={{
                            width: "80%",
                            height: width,
                            alignSelf: 'center',
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 50,
                                fontWeight: 'bold',
                                color: '#325962',
                                alignSelf: 'center',
                                margin: 20,
                                marginBottom: 50,
                            }}
                        >Login</Text>
                        <NativeBaseProvider>
                            <FormControl isRequired>
                                <Input
                                    onChangeText={text => handleOnchange(text, 'email')}
                                    onFocus={() => handleError(null, 'email')}
                                    iconName="email-outline"
                                    label="Email"
                                    placeholder="Enter your email address"
                                    error={errors.email}
                                />
                                <Input
                                    onChangeText={text => handleOnchange(text, 'password')}
                                    onFocus={() => handleError(null, 'password')}
                                    iconName="lock-outline"
                                    label="Password"
                                    placeholder="Enter your password"
                                    error={errors.password}
                                    password
                                />
                                <Button title="Log In" onPress={validate} />
                            </FormControl>
                        </NativeBaseProvider>
                    </View>
                </View>
            </View>
            <View
                style={{
                    height: 200,
                    backgroundColor: '#325962'
                }}
            >
                <View
                    style={{
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        alignSelf: 'center',
                        margin: 40,
                    }}
                >
                    <View
                        style={{
                            width: '60%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-evenly'
                        }}
                    >
                        <TouchableOpacity onPress={handleGoogleLogin}>
                            <View
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    backgroundColor: '#f1f1f1',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <GoogleIcon size={25} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleAppleLogin}>
                            <View
                                style={{
                                    width: 50,
                                    height: 50,
                                    borderRadius: '50%',
                                    backgroundColor: '#f1f1f1',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <AppleIcon size={25} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            margin: 25,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "500",
                                fontSize: 16,
                                color: '#f1f1f1'
                            }}
                        >Don't have an account? </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Registration')}
                        ><Text
                            style={{
                                fontWeight: "500",
                                fontSize: 16,
                                color: '#FFAF51'
                            }}
                        >Sign Up</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#333',
    },
    text: {
        fontSize: 30,
        color: '#fff',
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: '#fff',
        opacity: 0.3,
    },
});