import { StyleSheet, Text, View, Dimensions, ImageBackground, TouchableOpacity, Image, Keyboard, Alert, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { TextInput } from 'react-native-paper'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { FormControl, Stack, WarningOutlineIcon, Box, Center, NativeBaseProvider, Icon } from "native-base";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuthRequest } from 'expo-auth-session';
import * as AuthSession from 'expo-auth-session';
import GoogleIcon from '../assets/icons/Google';
import AppleIcon from '../assets/icons/Apple';
import Input from '../components/Input';
import Loader from '../components/Loader';
import Button from '../components/Button';
import { StorageService } from '../services';
import { Dispatch } from 'react';
import AuthenticationService from '../services/AuthenticationService';

const { width, height } = Dimensions.get('screen')

const RegistrationScreen = ({ navigation }) => {

    const [isLoading, setIsLoading] = React.useState(false);
    const [errors, setErrors] = React.useState({});
    const [errorMessage, setErrorMessage] = React.useState({});


    ///// Google OAuth /////
    const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });

    const [requestGoogle, responseGoogle, promptAsyncGoogle] = Google.useAuthRequest({
        clientId: 'GOOGLE_CLIENT_ID',
        redirectUri,
    });

    useEffect(() => {
        if (responseGoogle?.type === 'success') {
            const { authentication } = responseGoogle;
            StorageService.setToken(authentication.accessToken);
            StorageService.setGoogleUser(authentication.user);
            StorageService.setGoogleUser("true");
            setOAuthSignUp({
                email: authentication?.user?.email,
                name: authentication?.user?.name,
                provider: 'Google'
            })
            navigation.navigate('Verification', { oAuthSignUp });
        }
    }, [responseGoogle]);

    ///// Apple OAuth /////
    const handleAppleLogin = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });
            setOAuthSignUp({
                email: credential?.email,
                name: credential?.fullName,
                provider: 'Apple'
            })
            navigation.navigate('Verification', { oAuthSignUp });
        } catch (e) {
            if (e.code === 'ERR_CANCELED') {
                Alert.alert(
                    'Sign-in Cancelled',
                    'You cancelled the sign-in process. If this was a mistake, please try again.'
                );
            } else {
                console.error(e);
                Alert.alert(
                    'An error occurred',
                    'We encountered an error while trying to sign you in. Please try again.'
                );
            }
        }
    };

    ///// Email Registration /////

    const [inputs, setInputs] = React.useState({
        email: '',
        fullname: '',
        phone: '',
        password: '',
    });

    const initialCreds = {};

    const [oAuthSignUp, setOAuthSignUp] = useState({
        creds: initialCreds,
        provider: ''
    })

    let margin = 50;
    if (!inputs.email && !inputs.fullname && !inputs.password) {
        margin = 40
    }

    const validate = () => {
        Keyboard.dismiss();
        let isValid = true;

        if (!inputs.email) {
            handleError('Please input email', 'email');
            isValid = false;
            margin = 40
        } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
            handleError('Please input a valid email', 'email');
            isValid = false;
            margin = 40
        }

        if (!inputs.fullname) {
            handleError('Please input fullname', 'fullname');
            isValid = false;
            margin = 40
        }

        if (!inputs.phone) {
            handleError('Please input phone number', 'phone');
            isValid = false;
            margin = 40
        }

        if (!inputs.password) {
            handleError('Please input password', 'password');
            isValid = false;
            margin = 40
        } else if (inputs.password.length < 6) {
            handleError('Min password length of 6', 'password');
            isValid = false;
            margin = 40
        }

        if (isValid) {
            register();
        }
    };

    const register = async () => {
        const user = {
            FullName: inputs.fullname,
            EmailAdress: inputs.email,
            ContactNumber: inputs.phone,
            Password: inputs.password
        };

        setIsLoading(true);

        try {
            const response = await AuthenticationService.register(user);

            if (response?.status) {
                const userId = response.data.data.Id;
                console.log(response.data.data.Id)
                navigation.navigate('CodeConfirmation', { userId });
            } else {
                setErrorMessage(response?.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            setErrorMessage('An unexpected error occurred. Please try again.');
        } finally {
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
                        borderBottomRightRadius: 75,
                    }}
                >
                    <Image
                        source={require('../assets/images/pattern15.png')}
                        style={{
                            width: width,
                            height: width / 4,
                            aspectRatio: 2000 / 500,
                            borderBottomRightRadius: 75,
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
                        borderTopRightRadius: 0,
                        backgroundColor: '#f1f1f1',
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                    }}
                >
                    <View
                        style={{
                            width: "80%",
                            height: width,
                            alignSelf: 'center',
                            margin: margin,
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 36,
                                fontWeight: 'bold',
                                color: '#325962',
                                alignSelf: 'center',
                                margin: 10
                            }}
                        >Sign Up</Text>
                        <Input
                            onChangeText={text => handleOnchange(text, 'email')}
                            onFocus={() => handleError(null, 'email')}
                            iconName="email-outline"
                            label="Email"
                            placeholder="Enter your email address"
                            error={errors.email}
                        />
                        <Input
                            onChangeText={text => handleOnchange(text, 'fullname')}
                            onFocus={() => handleError(null, 'fullname')}
                            iconName="account-outline"
                            label="Full Name"
                            placeholder="Enter your full name"
                            error={errors.fullname}
                        />

                        <Input
                            keyboardType="numeric"
                            onChangeText={text => handleOnchange(text, 'phone')}
                            onFocus={() => handleError(null, 'phone')}
                            iconName="phone-outline"
                            label="Phone Number"
                            placeholder="Enter your phone no"
                            error={errors.phone}
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
                        <Button title="Register" onPress={validate} />
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
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            margin: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "500",
                                fontSize: 16,
                                color: '#f1f1f1'
                            }}
                        >Sign up with</Text>
                    </View>
                    <View
                        style={{
                            width: '60%',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-evenly'
                        }}
                    >
                        {Platform.OS === 'ios' ? (
                            <>
                                <TouchableOpacity onPress={() => promptAsyncGoogle()}>
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
                            </>
                        ) : (
                            <TouchableOpacity onPress={() => promptAsyncGoogle()}>
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
                        )}
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            margin: 10,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "500",
                                fontSize: 16,
                                color: '#f1f1f1'
                            }}
                        >Already have an account? </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                        ><Text
                            style={{
                                fontWeight: "500",
                                fontSize: 16,
                                color: '#FFAF51'
                            }}
                        >Sign In</Text></TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default RegistrationScreen

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