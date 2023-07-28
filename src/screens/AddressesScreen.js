import { StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react'
import { StorageService } from '../services';
import { Display } from '../utils';
import AppLoading from 'expo-app-loading';
import { Swipeable } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { MaterialIcons, Ionicons, EvilIcons, Feather, SimpleLineIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('screen');

const AddresseButton = ({ onpress }) => {
    return <Button
        name='locationButton'
        title="Sign Up"
        mode='contained'
        buttonColor='#FFAF51'
        textColor='#325964'
        uppercase={false}
        onPress={onpress}
        style={{
            width: width * 0.9,
            height: Display.setHeight(6),
            borderRadius: 12,
            margin: Display.setHeight(2)
        }}
        contentStyle={{
            width: '100%',
            height: '100%',
        }}
        labelStyle={{
            fontSize: 16,
            fontWeight: '700',
            letterSpacing: 1,
        }}
    >Add New Addresse</Button>
}

const AddressesScreen = ({ navigation }) => {

    const [isReady, setIsReady] = useState(false);
    const [address, setAddress] = useState(null)
    const [flatListAddress, setFlatListAddress] = useState(null);

    const fetchUserAddress = async () => {
        try {
            const userAddresses = await StorageService.getAddress();

            if (userAddresses) {
                setAddress(userAddresses)
                setFlatListAddress([userAddresses]);
            } else {
                console.log("No addresses found in Storage Service");
            }

        } catch (error) {
            console.error(error);
        } finally {
            setIsReady(true);
        }
    };

    console.log(address)
    console.log(flatListAddress)

    if (!isReady) {
        return (
            <AppLoading
                startAsync={fetchUserAddress}
                onFinish={() => setIsReady(true)}
                onError={console.warn}
            />
        );
    }

    const rightSwipe = () => {
        return <TouchableOpacity
            style={{
                width: Display.setHeight(8),
                height: '100%'
            }}
        >
            <View
                style={{
                    width: Display.setHeight(8),
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#FFAF51',
                }}
            >
                <MaterialIcons name="delete-outline" size={35} color="#325964" />
                <Text
                    style={{
                        fontSize: 14,
                        fontWeight: 'bold',
                        color: '#325964',
                        marginTop: 3
                    }}
                >Delete</Text>
            </View>
        </TouchableOpacity>
    }

    const renderItem = ({ item }) => {
        return (
            <Swipeable
                renderRightActions={rightSwipe}
            >
                <View
                    style={{
                        width,
                        height: Display.setHeight(11),
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                    }}
                >
                    {/* <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('LocationDetail', {address})
                        }}
                    > */}
                    <View
                        style={{
                            width,
                            height: Display.setHeight(11),
                            backgroundColor: '#fff',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                        }}
                    >
                        <View
                            style={{
                                width: '10%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: Display.setHeight(1)
                            }}
                        >
                            <EvilIcons name="location" size={Display.setHeight(4)} color="#325964" />
                        </View>
                        <View
                            style={{
                                width: '75%',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                flexDirection: 'row',
                            }}
                        >
                            <View>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "bold",
                                        marginVertical: Display.setHeight(0.5)
                                    }}
                                >{item.addressJson.name ? item.addressJson.name : ''}, {item.unitNumber ? `Appartment ${item.unitNumber}` : ''}, {item.floorNumber ? `Floor ${item.floorNumber}` : ''}</Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: '#7f7f7f'
                                    }}
                                >{item.addressJson.city ? item.addressJson.city : ''}</Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontWeight: '400',
                                        color: '#7f7f7f'
                                    }}
                                >{item.notes ? item.notes : ''}</Text>
                            </View>
                        </View>
                        <View
                            style={{
                                width: '15%',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Feather name="edit-2" size={22} color="#325964" style={{ margin: Display.setHeight(2) }} />
                        </View>
                    </View>
                    {/* </TouchableOpacity> */}
                    <View
                        style={{
                            width: width * 0.9,
                            height: Display.setHeight(0.1),
                            alignSelf: 'center',
                            backgroundColor: '#D6DEE0'
                        }}
                    />
                </View>
            </Swipeable >
        )
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
                    height: height * 0.12,
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
            <View
                style={{
                    width,
                    height: height * (0.88)
                }}
            >
                <FlatList
                    data={flatListAddress}
                    keyExtractor={(item, index) => item._id + ''}
                    renderItem={renderItem}
                />
            </View>
            <View
                style={{
                    height: Display.setHeight(15),
                    width,
                    backgroundColor: '#fff',
                    position: 'absolute',
                    bottom: '0%'
                }}
            >
                <View
                    style={{
                        width,
                        height: Display.setHeight(0.1),
                        backgroundColor: '#f1f1f1',
                    }}
                />
                <AddresseButton
                    onpress={() => {
                        navigation.navigate('Main')
                    }}
                />
            </View>
        </View>
    )
}

export default AddressesScreen

const styles = StyleSheet.create({})