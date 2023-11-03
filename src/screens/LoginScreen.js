import { StyleSheet, Text, View, Dimensions, ImageBackground, TouchableOpacity, Image, Keyboard, Alert, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
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
import { useDispatch } from 'react-redux';
import AuthenticationService from '../services/AuthenticationService';
import { setToken, setUserData } from '../actions/GeneralAction';
import { StorageService } from '../services';
import jwt_decode from "jwt-decode";
import { useNavigation } from '@react-navigation/native';
import { Display } from '../utils';

const { width, height } = Dimensions.get('screen')

const LoginScreen = () => {
    const navigation = useNavigation();

    const [inputs, setInputs] = React.useState({ email: '', password: '' });
    const [errors, setErrors] = React.useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const dispatch = useDispatch();

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
                        navigation.navigate('Main');
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
                        navigation.navigate('Main');
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
            handleError('Bitte E-Mail eingeben', 'email');
            isValid = false;
        }
        if (!inputs.password) {
            handleError('Bitte Passwort eingeben', 'password');
            isValid = false;
        }
        if (isValid) {
            Login(inputs);
        }
    };

    const Login = async (inputs) => {
        setIsLoading(true);
        let user = {
            EmailAdress: inputs.email,
            Password: inputs.password
        };
        try {
            const response = await AuthenticationService.login(user);
            setIsLoading(false);
            console.log("Response status:", response);
            if (response?.status) {
                await StorageService.setToken(response?.data?.Token);
                dispatch(setToken(response?.data?.Token));

                const decodedData = jwt_decode(response?.data?.Token);
                await StorageService.setUserData(decodedData);
                dispatch(setUserData(decodedData));
                navigation.navigate('Main');
            } else {
                setErrorMessage(response?.message);
            }
        } catch (error) {
            console.error("Login error:", error);
            setIsLoading(false);
        }
    };

    const handleOnchange = (text, input) => {
        setInputs(prevState => ({ ...prevState, [input]: text }));
    };

    const handleError = (error, input) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{
                flex: 1
            }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
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
                                        fontSize: Display.setHeight(4),
                                        fontWeight: 'bold',
                                        color: '#325962',
                                        alignSelf: 'center',
                                        margin: Display.setHeight(1),
                                        marginBottom: Display.setHeight(5)
                                    }}
                                >Anmelden</Text>
                                <NativeBaseProvider>
                                    <FormControl isRequired>
                                        <Input
                                            onChangeText={text => handleOnchange(text, 'email')}
                                            onFocus={() => handleError(null, 'email')}
                                            iconName="email-outline"
                                            label="E-Mail"
                                            placeholder="Geben Sie Ihre E-Mail Adresse ein"
                                            error={errors.email}
                                        />
                                        <Input
                                            onChangeText={text => handleOnchange(text, 'password')}
                                            onFocus={() => handleError(null, 'password')}
                                            iconName="lock-outline"
                                            label="Passwort"
                                            placeholder="Geben Sie Ihr Passwort ein"
                                            error={errors.password}
                                            password
                                        />
                                        <Button title="Anmelden" onPress={validate} />
                                    </FormControl>
                                </NativeBaseProvider>
                            </View>
                        </View>
                    </View>
                    <View
                        style={{
                            height: Display.setHeight(17),
                            backgroundColor: '#325962'
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'center',
                            }}
                        >
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-evenly',
                                    margin: Display.setHeight(1),
                                }}
                            >
                                <Text
                                    style={{
                                        fontWeight: "500",
                                        fontSize: Display.setHeight(1.8),
                                        color: '#f1f1f1'
                                    }}
                                >Anmelden mit</Text>
                            </View>
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
                                            width: Display.setHeight(5),
                                            height: Display.setHeight(5),
                                            borderRadius: Display.setHeight(2.5),
                                            backgroundColor: '#f1f1f1',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <GoogleIcon size={Display.setHeight(3)} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleAppleLogin}>
                                    <View
                                        style={{
                                            width: Display.setHeight(5),
                                            height: Display.setHeight(5),
                                            borderRadius: Display.setHeight(2.5),
                                            backgroundColor: '#f1f1f1',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <AppleIcon size={Display.setHeight(3)} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-evenly',
                                    margin: Display.setHeight(2.5),
                                }}
                            >
                                <Text
                                    style={{
                                        fontWeight: "500",
                                        fontSize: Display.setHeight(2),
                                        color: '#f1f1f1'
                                    }}
                                >Sie haben noch kein Konto? </Text>
                                <TouchableOpacity
                                    onPress={() => navigation.navigate('Registration')}
                                ><Text
                                    style={{
                                        fontWeight: "500",
                                        fontSize: Display.setHeight(2),
                                        color: '#FFAF51'
                                    }}
                                >Registrieren</Text></TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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