import { StyleSheet, Text, View, Dimensions, Button, ImageBackground, TouchableOpacity, Image, Keyboard, Alert } from 'react-native'
import React, { useState } from 'react'
import { TextInput } from 'react-native-paper'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Backdrop } from 'react-native-backdrop';
import { FormControl, Stack, WarningOutlineIcon, Box, Center, NativeBaseProvider, Icon } from "native-base";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Google from '../assets/icons/Google';
import Apple from '../assets/icons/Apple';
import Input from '../components/Input';
import Loader from '../components/Loader';

const { width, height } = Dimensions.get('screen')

const LoginScreen = ({ navigation }) => {
    const [inputs, setInputs] = React.useState({ email: '', password: '' });
    const [errors, setErrors] = React.useState({});
    const [loading, setLoading] = React.useState(false);

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
                        height: width / 3,
                        backgroundColor: '#f1f1f1',
                        overflow: 'hidden',
                        borderBottomLeftRadius: 75,
                    }}
                >
                    <Image
                        source={require('../assets/images/pattern14.png')}
                        style={{
                            width: width,
                            height: width / 3,
                            aspectRatio: 1500 / 500,
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
                    source={require('../assets/images/pattern14.png')}
                    style={{
                        ...StyleSheet.absoluteFillObject,
                        width: width,
                        height: width / 3,
                        aspectRatio: 1500 / 500,
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
                                {/* <TextInput
                                    type='outlined'
                                    label='Email'
                                    mode="outlined"
                                    right={
                                        <TextInput.Icon name="chevron-down" />
                                    }
                                />
                                <TextInput
                                    right={<Icon as={showPassword ? <MaterialIcons name="visibility-off" /> : <MaterialIcons name="visibility" />}
                                        size={5}
                                        mr="2"
                                        color="muted.400"
                                        onPress={handleClickShowPassword}
                                    />}
                                    mode="outlined"
                                    label="Password"
                                    type={showPassword ? 'text' : 'password'}
                                /> */}
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
                        <TouchableOpacity>
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
                                <Google size={25} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity>
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
                                <Apple size={25} />
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-evenly',
                            margin: 20,
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