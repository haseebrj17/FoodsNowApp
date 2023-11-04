import { StyleSheet, Text, View, Dimensions, ImageBackground, TouchableOpacity, Image, Keyboard, Alert, Platform, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native'
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
import { Display } from '../utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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
            handleError('Bitte E-Mail eingeben', 'email');
            isValid = false;
            margin = 40
        } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
            handleError('Bitte geben Sie eine gültige E-Mail ein', 'email');
            isValid = false;
            margin = 40
        }

        if (!inputs.fullname) {
            handleError('Bitte Name und Vorname eingeben', 'fullname');
            isValid = false;
            margin = 40
        }

        if (!inputs.phone) {
            handleError('Bitte Handynummer eingeben', 'phone');
            isValid = false;
            margin = 40
        }

        if (!inputs.password) {
            handleError('Bitte Passwort eingeben', 'password');
            isValid = false;
            margin = 40
        } else if (inputs.password.length < 6) {
            handleError('Mindestpasswortlänge von 6', 'password');
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
                const userId = response?.data?.data?.Id;
                console.log(response?.data?.data?.Id)
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
                            borderBottomRightRadius: Display.setHeight(80),
                        }}
                    >
                        <Image
                            source={require('../assets/images/pattern15.png')}
                            style={{
                                width: width,
                                height: width / 4,
                                aspectRatio: 2000 / 500,
                                borderBottomRightRadius: Display.setHeight(80),
                            }}
                        />
                    </View>
                </View>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={{
                        flex: 1
                    }}>
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
                                        fontSize: Display.setHeight(4),
                                        fontWeight: 'bold',
                                        color: '#325962',
                                        alignSelf: 'center',
                                        marginBottom: Display.setHeight(1)
                                    }}
                                >Registrieren</Text>
                                <Input
                                    onChangeText={text => handleOnchange(text, 'email')}
                                    onFocus={() => handleError(null, 'email')}
                                    iconName="email-outline"
                                    label="E-Mail"
                                    placeholder="Geben Sie Ihre E-Mail Adresse ein"
                                    error={errors.email}
                                />
                                <Input
                                    onChangeText={text => handleOnchange(text, 'fullname')}
                                    onFocus={() => handleError(null, 'fullname')}
                                    iconName="account-outline"
                                    label="Voller Name"
                                    placeholder="Geben Sie Ihren vollen Namen ein"
                                    error={errors.fullname}
                                />

                                <Input
                                    keyboardType="numeric"
                                    onChangeText={text => handleOnchange(text, 'phone')}
                                    onFocus={() => handleError(null, 'phone')}
                                    iconName="phone-outline"
                                    label="Handy-Nummer"
                                    placeholder="Geben Sie Ihre Handynummer ein"
                                    error={errors.phone}
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
                                <Button title="Registrieren" onPress={validate} />
                            </View>
                        </View>
                    </View>
                </KeyboardAvoidingView>
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
                            margin: Display.setHeight(1),
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
                            >Anmeldung bei</Text>
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
                                </>
                            ) : (
                                <TouchableOpacity onPress={() => promptAsyncGoogle()}>
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
                            )}
                        </View>
                        <View
                            style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-evenly',
                                margin: Display.setHeight(1.2),
                            }}
                        >
                            <Text
                                style={{
                                    fontWeight: "500",
                                    fontSize: Display.setHeight(2),
                                    color: '#f1f1f1'
                                }}
                            >Sie haben bereits ein Konto? </Text>
                            <TouchableOpacity
                                onPress={() => navigation.navigate('Login')}
                            ><Text
                                style={{
                                    fontWeight: "500",
                                    fontSize: Display.setHeight(2),
                                    color: '#FFAF51'
                                }}
                            >Anmelden</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
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