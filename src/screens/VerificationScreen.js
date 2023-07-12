import React, { useState } from 'react';
import { View, Text, TextInput, Alert, StyleSheet, TouchableOpacity, Dimensions, Image, FlatList, Keyboard } from 'react-native';
import axios from 'axios';
import FlagItem from '../components/FlagItem';
import Button from '../components/Button';
import Input from '../components/Input';
import { StaticImageService } from '../services';
import { CountryCode } from '../assets/constants'
import { Display } from '../utils';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';

const getDropdownStyle = y => ({ ...styles.countryDropdown, top: y + 60 });

const { width, height } = Dimensions.get('screen');

const VerificationScreen = ({ navigation }) => {
    const [selectedCountry, setSelectedCountry] = useState(
        CountryCode.find(country => country.name === 'Germany'),
    );
    const [inputsContainerY, setInputsContainerY] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [dropdownLayout, setDropdownLayout] = useState({});
    const [phoneNumber, setPhoneNumber] = useState('');

    const closeDropdown = (pageX, pageY) => {
        if (isDropdownOpen) {
            if (
                pageX < dropdownLayout?.x ||
                pageX > dropdownLayout?.x + dropdownLayout?.width ||
                pageY < dropdownLayout?.y ||
                pageY > dropdownLayout?.y + dropdownLayout?.height
            ) {
                setIsDropdownOpen(false);
            }
        }
    };

    const [inputs, setInputs] = React.useState({
        phone: ''
    });
    const [errors, setErrors] = React.useState({});

    const handleOnchange = (text, input) => {
        setInputs(prevState => ({ ...prevState, [input]: text }));
    };
    const handleError = (error, input) => {
        setErrors(prevState => ({ ...prevState, [input]: error }));
    };

    let color = '#FFAF51';
    let reqPhone = 'Please enter your Phone number for verification';

    const validate = () => {
        Keyboard.dismiss();
        let isValid = true;

        if (!inputs.phone) {
            handleError('Please input phone number', 'phone');
            isValid = false;
        }

        if (isValid) {
            handlePhoneVerification();
            console.log('code sent')
        }
    };

    const handlePhoneVerification = async () => {
        try {
            // Send the phone number to your server
            await axios.post('https://backendapi/phone-verification', { phoneNumber });
            setVerificationMethod('phone');
            reqPhone = 'Code sent to your phone number'
            color = '#FFAF51'
        } catch (error) {
            Alert.alert('Error', 'Unable to send verification code.');
        }
    };

    return (
        <View
            style={{
                backgroundColor: '#325962',
                flex: 1
            }}
            onStartShouldSetResponder={({ nativeEvent: { pageX, pageY } }) =>
                closeDropdown(pageX, pageY)
            }
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
                        justifyContent: 'center',
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
                    >Verification</Text>
                    <View
                        flex="0.7"
                        justifyContent='flex-end'
                        alignItems='center'
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
                                source={require('../assets/icons/smartphone.png')}
                                style={{
                                    width: 80,
                                    height: 80
                                }}
                            />
                            <MaterialIcons name="done" size={30} color={color}
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
                        >{reqPhone}</Text>
                        <View
                            style={styles.inputsContainer}
                            onLayout={({
                                nativeEvent: {
                                    layout: { y },
                                },
                            }) => setInputsContainerY(y)}>
                            <TouchableOpacity
                                style={styles.countryListContainer}
                                onPress={() => setIsDropdownOpen(!isDropdownOpen)}>
                                <Image
                                    source={{ uri: StaticImageService.getFlagIcon(selectedCountry.code) }}
                                    style={styles.flatIcon}
                                />
                                <Text style={styles.countryCodeText}>
                                    {selectedCountry.dial_code}
                                </Text>
                                <MaterialIcons name="keyboard-arrow-down" size={18} />
                            </TouchableOpacity>
                            <View style={styles.phoneInputContainer}>
                                <Input
                                    keyboardType="numeric"
                                    // onChangeText={text => {
                                    //     setPhoneNumber(selectedCountry?.dial_code + text),
                                    //         handleOnchange(text, 'phone')
                                    // }
                                    // }
                                    onChangeText={text => handleOnchange(text, 'phone')}
                                    onFocus={() => {
                                        handleError(null, 'phone'),
                                            setIsDropdownOpen(false)
                                    }
                                    }
                                    style={styles.inputText}
                                    iconName="phone-outline"
                                    placeholder="Enter your phone number"
                                    error={errors.phone}
                                />
                            </View>
                        </View>
                        <View
                            width={width}
                        >
                            <TouchableOpacity
                                style={styles.signinButton}
                                activeOpacity={0.8}
                                onPress={validate}>
                                <Text style={styles.signinButtonText}>Contiue</Text>
                            </TouchableOpacity>
                        </View>
                        {isDropdownOpen && (
                            <View
                                style={getDropdownStyle(inputsContainerY)}
                                onLayout={({
                                    nativeEvent: {
                                        layout: { x, y, height, width },
                                    },
                                }) => setDropdownLayout({ x, y, height, width })}>
                                <FlatList
                                    style={{
                                        height: 50
                                    }}
                                    data={CountryCode}
                                    keyExtractor={item => item.code}
                                    renderItem={({ item }) => (
                                        <FlagItem
                                            {...item}
                                            onPress={country => {
                                                setSelectedCountry(country);
                                                setIsDropdownOpen(false);
                                            }}
                                        />
                                    )}
                                />
                            </View>
                        )}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 20,
        lineHeight: 20 * 1.4,
        width: Display.setWidth(80),
        textAlign: 'center',
    },
    title: {
        fontSize: 20,
        lineHeight: 20 * 1.4,
        marginTop: 50,
        marginBottom: 10,
        marginHorizontal: 20,
    },
    content: {
        fontSize: 20,
        marginTop: 10,
        marginBottom: 20,
        marginHorizontal: 20,
    },
    inputsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 50,
    },
    countryListContainer: {
        backgroundColor: "#f2f2f2",
        width: Display.setWidth(22),
        marginRight: 10,
        borderRadius: 8,
        height: height * 0.06,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: "#325964",
        flexDirection: 'row',
        marginTop: 12,
    },
    phoneInputContainer: {
        backgroundColor: "#f2f2f2",
        paddingHorizontal: 10,
        borderColor: "#000",
        justifyContent: 'center',
        flex: 1,
    },
    flatIcon: {
        height: 20,
        width: 20,
    },
    countryCodeText: {
        fontSize: 14,
        lineHeight: 14 * 1.4,
        color: "#000",
    },
    inputText: {
        fontSize: 14,
        textAlignVertical: 'center',
        padding: 0,
        height: Display.setHeight(6),
        color: "#000",
    },
    countryDropdown: {
        backgroundColor: "#f2f2f2",
        position: 'absolute',
        width: Display.setWidth(80),
        height: Display.setHeight(23),
        marginLeft: 20,
        borderRadius: 10,
        borderWidth: 0.5,
        borderColor: "#000",
        zIndex: 3,
    },
    signinButton: {
        backgroundColor: "#325964",
        borderRadius: 8,
        marginHorizontal: 20,
        height: Display.setHeight(6),
        justifyContent: 'center',
        alignItems: 'center',
    },
    signinButtonText: {
        fontSize: 18,
        lineHeight: 18 * 1.4,
        color: "#fff",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#325962'
    },
    input: {
        width: '100%',
        height: 40,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#000000',
        borderRadius: 5,
        marginBottom: 20,
    },
    button: {
        width: '100%',
        height: 40,
        backgroundColor: '#000000',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
    },
});



export default VerificationScreen;
