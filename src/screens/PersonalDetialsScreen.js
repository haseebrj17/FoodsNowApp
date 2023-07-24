import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StorageService } from '../services';
import { Display } from '../utils';
import { MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuthRequest } from 'expo-auth-session';
import * as AuthSession from 'expo-auth-session';
import GoogleIcon from '../assets/icons/Google';
import AppleIcon from '../assets/icons/Apple';

const { width, height } = Dimensions.get('screen');

const PersonalDetialsScreen = ({ navigation }) => {

    const [user, setUser] = useState(null);
    const [isGoogleConnected, setGoogleConnected] = useState(false);
    const [isAppleConnected, setAppleConnected] = useState(false);
    const [isReady, setIsReady] = useState(false);


    // useEffect(() => {
    //     StorageService.getUserData().then(userData => {
    //         setUser(JSON.parse(userData));
    //     });
    // }, []);

    // const fetchUserData = async () => {
    //     try {
    //         const userData = await StorageService.getUserData();
    //         if (userData) {
    //             setUser(JSON.parse(userData));
    //         } else {
    //             console.log("No user data found in AsyncStorage");
    //         }
    //     } catch (error) {
    //         console.log(error);
    //     } finally {
    //         setIsReady(true);
    //     }
    // };

    const fetchUserData = async () => {
        try {
            const userData = await StorageService.getUserData();
            const googleUser = await StorageService.getGoogleUser();
            const appleUser = await StorageService.getAppleUser();

            if (userData) {
                setUser(JSON.parse(userData));
            } else {
                console.log("No user data found in Storage Service");
            }

            if (googleUser === "true") setGoogleConnected(true);
            else setGoogleConnected(false);

            if (appleUser === "true") setAppleConnected(true);
            else setAppleConnected(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsReady(true);
        }
    };
    if (!isReady) {
        return (
            <AppLoading
                startAsync={fetchUserData}
                onFinish={() => setIsReady(true)}
                onError={console.warn}
            />
        );
    }

    // const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
    
    // const [requestGoogle, responseGoogle, promptAsyncGoogle] = Google.useAuthRequest({
    //     clientId: 'GOOGLE_CLIENT_ID',
    //     redirectUri,
    // });

    // React.useEffect(() => {
    //     if (responseGoogle?.type === 'success') {
    //         const { authentication } = responseGoogle;
    //         StorageService.setToken(authentication.accessToken);
    //         StorageService.setGoogleUser(authentication.user);
    //         StorageService.setGoogleUser("true");
    //         setGoogleConnected(true);
    //         fetchUserData();
    //     } else if (responseGoogle?.type === 'error') {
    //         Alert.alert(
    //             'Sign-in Failed',
    //             'Google sign-in failed. Please try again later'
    //         );
    //     }
    // }, [responseGoogle]);

    const linkWithApple = async () => {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL,
                ],
            });
            if (credential) {
                StorageService.appleUser(credential);
                await StorageService.appleUser("true");
                setAppleConnected(true);
                fetchUserData();
            }
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

    return (
        <ScrollView
            onScrollAnimationEnd={true}
            style={{
                flexGrow: 1,
                width,
                height
            }}
            scrollIndicatorInsets={1}
        >
            <View
                style={{
                    width,
                    height: Display.setHeight(12),
                    backgroundColor: '#F4E4CD',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'row'
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        if (navigation.canGoBack()) {
                            navigation.goBack();
                        } else {
                            navigation.navigate('Account');
                        }
                    }}
                    style={{
                        position: "absolute",
                        left: '1%',
                        top: "10%",
                        marginTop: 35,
                        zIndex: 999,
                    }}
                >
                    <MaterialIcons
                        name="keyboard-arrow-left"
                        size={50}
                        color="#325962"
                    />
                </TouchableOpacity>
                <Text
                    style={{
                        fontSize: 20,
                        fontWeight: 'bold',
                        marginTop: 35,
                        color: "#325962",
                    }}
                >Personal Details</Text>
            </View>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                {/* <Text>{user.fullname}</Text>
                <Text>{user.email}</Text>
                <Text>{user.password}</Text>
                <Text>{user.phone}</Text> */}
                <View
                    style={{
                        width: "90%",
                        height: Display.setHeight(10),
                        backgroundColor: '#f1f1f1',
                        marginVertical: 15,
                        borderRadius: 10,
                        shadowColor: '#325964',
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                        elevation: 10,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'column',
                            height: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                margin: Display.setHeight(1.5),
                                flexDirection: 'row'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: '#325964'
                                }}
                            >Name</Text>
                            <TouchableOpacity><MaterialIcons name="edit" size={22} color="#325964" /></TouchableOpacity>
                        </View>
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                margin: Display.setHeight(0.8),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: '500',
                                    color: '#325964',
                                }}
                            >{user.fullname}</Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        width: "90%",
                        height: Display.setHeight(10),
                        backgroundColor: '#f1f1f1',
                        marginVertical: 15,
                        borderRadius: 10,
                        shadowColor: '#325964',
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                        elevation: 10,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'column',
                            height: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                margin: Display.setHeight(1.5),
                                flexDirection: 'row'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: '#325964'
                                }}
                            >Email</Text>
                            <TouchableOpacity><MaterialIcons name="edit" size={22} color="#325964" /></TouchableOpacity>
                        </View>
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                margin: Display.setHeight(0.8),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: '500',
                                    color: '#325964',
                                }}
                            >{user.email}</Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        width: "90%",
                        height: Display.setHeight(10),
                        backgroundColor: '#f1f1f1',
                        marginVertical: 15,
                        borderRadius: 10,
                        shadowColor: '#325964',
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                        elevation: 10,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'column',
                            height: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                margin: Display.setHeight(1.5),
                                flexDirection: 'row'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: '#325964'
                                }}
                            >Password</Text>
                            <TouchableOpacity><MaterialIcons name="edit" size={22} color="#325964" /></TouchableOpacity>
                        </View>
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                margin: Display.setHeight(0.8),
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: '500',
                                    color: '#325964',
                                }}
                            >{"".padStart(user.password.length, "*")}</Text>
                        </View>
                    </View>
                </View>
                <View
                    style={{
                        width: "90%",
                        height: Display.setHeight(16),
                        backgroundColor: '#f1f1f1',
                        marginVertical: 15,
                        borderRadius: 10,
                        shadowColor: '#325964',
                        shadowOffset: {
                            width: 0,
                            height: 3,
                        },
                        shadowOpacity: 0.5,
                        shadowRadius: 2,
                        elevation: 10,
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'column',
                            height: '100%',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                margin: Display.setHeight(1.5),
                                flexDirection: 'row'
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '500',
                                    color: '#325964'
                                }}
                            >Mobile Number</Text>
                            <TouchableOpacity><MaterialIcons name="edit" size={22} color="#325964" /></TouchableOpacity>
                        </View>
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                margin: Display.setHeight(1.4),
                                marginTop: Display.setHeight(1.5)
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 18,
                                    fontWeight: '500',
                                    color: '#325964',
                                }}
                            >{user && user.phone ? "+92 " + user.phone.slice(1, 4) + " " + user.phone.slice(4) : "No phone number"}</Text>
                        </View>
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'flex-start',
                            }}
                        >
                            <View
                                style={{
                                    width: '35%',
                                    height: Display.setHeight(4),
                                    backgroundColor: '#e1e1e1',
                                    borderRadius: '50%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                    justifyContent: 'center'
                                }}
                            >
                                <MaterialIcons name='done' size={20} color="#325964" />
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: '500',
                                        color: '#325964',
                                        margin: 5
                                    }}
                                >Verified</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: 'bold',
                        marginTop: 35,
                        marginLeft: width * 0.05,
                        alignSelf: 'flex-start',
                        color: "#325962",
                    }}
                >Connected Accounts</Text>
                <View
                    style={{
                        width: "90%",
                        height: "90%",
                        alignItems: 'center',
                    }}
                >
                    <View
                        style={{
                            width: "100%",
                            height: Display.setHeight(10),
                            backgroundColor: '#f1f1f1',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginVertical: 15,
                            borderRadius: 10,
                            shadowColor: '#325964',
                            shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowOpacity: 0.5,
                            shadowRadius: 2,
                            elevation: 10,
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                width: "40%",
                                alignItems: 'center',
                                marginLeft: Display.setHeight(1.5)
                            }}
                        >
                            <GoogleIcon size={40} />
                            <Text
                                style={{
                                    marginLeft: Display.setHeight(2),
                                    fontSize: 16,
                                    fontWeight: '400',
                                    color: '#325964'
                                }}
                            >Google</Text>
                        </View>
                        <TouchableOpacity
                            // onPress={isAppleConnected ? null : linkWithGoogle}
                            style={{
                                marginRight: Display.setHeight(1.5)
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    color: '#325964'
                                }}
                            >{isGoogleConnected ? "Connected" : "Connect"}</Text>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            width: "100%",
                            height: Display.setHeight(10),
                            backgroundColor: '#f1f1f1',
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginVertical: 15,
                            borderRadius: 10,
                            shadowColor: '#325964',
                            shadowOffset: {
                                width: 0,
                                height: 3,
                            },
                            shadowOpacity: 0.5,
                            shadowRadius: 2,
                            elevation: 10,
                            marginBottom: Display.setHeight(8)
                        }}
                    >
                        <View
                            style={{
                                flexDirection: 'row',
                                width: "40%",
                                alignItems: 'center',
                                marginLeft: Display.setHeight(1.5)
                            }}
                        >
                            <AppleIcon size={40} />
                            <Text
                                style={{
                                    marginLeft: Display.setHeight(2),
                                    fontSize: 16,
                                    fontWeight: '400',
                                    color: '#325964'
                                }}
                            >Apple</Text>
                        </View>
                        <TouchableOpacity
                            onPress={isAppleConnected ? null : linkWithApple}
                            style={{
                                marginRight: Display.setHeight(1.5)
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    color: '#325964'
                                }}
                            >{isAppleConnected ? "Connected" : "Connect"}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default PersonalDetialsScreen

const styles = StyleSheet.create({})