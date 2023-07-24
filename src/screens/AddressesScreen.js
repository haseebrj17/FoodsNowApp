import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react'
import { StorageService } from '../services';
import { Display } from '../utils';
import { MaterialIcons } from '@expo/vector-icons';
import AppLoading from 'expo-app-loading';

const { width, height } = Dimensions.get('screen');

const AddressesScreen = ({ navigation }) => {

    const [isReady, setIsReady] = useState(false);
    const [address, setAddress] = useState(null)

    const fetchUserAddress = async () => {
        try {
            const userAddresses = await StorageService.getAddress();

            if (userAddresses) {
                setAddress(userAddresses);
            } else {
                console.log("No addresses found in Storage Service");
            }

        } catch (error) {
            console.error(error);
        } finally {
            setIsReady(true);
        }
    };
    if (!isReady) {
        return (
            <AppLoading
                startAsync={fetchUserAddress}
                onFinish={() => setIsReady(true)}
                onError={console.warn}
            />
        );
    }

    return (
        <View
            style={{
                width,
                height,
                backgroundColor: '#fff'
            }}
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
                >Addresses</Text>
            </View>

        </View>
    )
}

export default AddressesScreen

const styles = StyleSheet.create({})