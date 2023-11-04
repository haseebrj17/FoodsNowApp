import { StyleSheet, Text, View, TouchableOpacity, Dimensions, FlatList, SectionList } from 'react-native';
import React, { useEffect, useState } from 'react'
import { StorageService } from '../services';
import { Display } from '../utils';
import { Swipeable } from 'react-native-gesture-handler';
import { Button } from 'react-native-paper';
import { MaterialIcons, Ionicons, EvilIcons, Feather, SimpleLineIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserAddresses } from '../actions/UserAddressAction';
import Skeleton from '../components/Skeleton';
import { getToken } from '../Store';

const { width, height } = Dimensions.get('screen');

const AddresseButton = ({ onpress, loadingAddress }) => {
    return <Button
        name='locationButton'
        title="Sign Up"
        mode='contained'
        buttonColor={loadingAddress ? '#f1f1f1' : '#FFAF51'}
        textColor={loadingAddress ? '#696969' : '#325964'}
        disabled={loadingAddress ? true : false}
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
    >Neue Adresse hinzufügen</Button>
}

const AddressesScreen = ({ navigation }) => {

    const [isReady, setIsReady] = useState(false);
    const [address, setAddress] = useState(null)
    const [flatListAddress, setFlatListAddress] = useState(null);
    const [Id, setId] = useState(null);
    const [franchiseId, setFranchiseId] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [selectedAddressId, setSelectedAddressId] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        const FetchAddresses = async () => {
            const Data = await StorageService.getUserData();
            const { Id } = JSON.parse(Data);
            setId(Id);
            const LocationData = await StorageService.getLocation();
            const FranchiseId = LocationData.FranchiseId
            setFranchiseId(FranchiseId)
        };

        FetchAddresses();
    });

    const token = useSelector(getToken);

    useEffect(() => {
        if (Id) {
            dispatch(fetchUserAddresses(Id, token));
        } else {
            console.log("User Id not available");
        }
    }, [Id, token]);

    const { addresses, loadingAddress, error } = useSelector(
        (state) => state.addressState
    );

    useEffect(() => {
        console.log(addresses, loadingAddress, error)
    }, [addresses])

    const sectionsData = [
        { title: 'Addresses', data: addresses ? addresses : [] }
    ];

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
                >Löschen</Text>
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
                        height: Display.setHeight(12),
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                    }}
                >
                    {/* <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('LocationDetail', { addresses })
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
                                >{item?.StreetAddress} {item?.House}, Appartment {item?.UnitNumber}, Stockwerk {item?.FloorNumber}</Text>
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '600',
                                        color: '#7f7f7f'
                                    }}
                                >{item?.City?.Name}</Text>
                                <Text
                                    style={{
                                        fontSize: 12,
                                        fontWeight: '400',
                                        color: '#7f7f7f'
                                    }}
                                >{item?.Notes}</Text>
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
        <>
            {
                loadingAddress ? (
                    <View
                        style={{
                            backgroundColor: '#fff',
                            width,
                            height
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
                            >Adressen</Text>
                        </View>
                        <View
                            style={{
                                width: "100%",
                                alignItems: "center",
                                justifyContent: "center",
                            }}>
                            <View
                                style={{
                                    width: "90%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                }}>
                                <Skeleton
                                    height={Display.setHeight(10)}
                                    width={Display.setWidth(90)}
                                    style={{ margin: 10, borderRadius: 12 }}
                                />
                                <View
                                    style={{
                                        flexDirection: "row",
                                        position: "absolute",
                                        left: "5%",
                                        top: "20%",
                                    }}>
                                    <View
                                        style={{
                                            padding: 4,
                                            flexDirection: "row",
                                            width: "100%",
                                        }}>
                                        <View
                                            style={{
                                                width: "10%",
                                                alignItems: "flex-start",
                                                justifyContent: "center",
                                            }}>
                                            <Skeleton
                                                height={Display.setHeight(2.5)}
                                                width={Display.setHeight(2.5)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                width: "75%",
                                            }}>
                                            <Skeleton
                                                height={Display.setHeight(2)}
                                                width={Display.setHeight(25)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                            <Skeleton
                                                height={Display.setHeight(1)}
                                                width={Display.setHeight(10)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                            <Skeleton
                                                height={Display.setHeight(1.6)}
                                                width={Display.setHeight(12)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View
                                style={{
                                    width: "90%",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexDirection: "column",
                                }}>
                                <Skeleton
                                    height={Display.setHeight(10)}
                                    width={Display.setWidth(90)}
                                    style={{ margin: 10, borderRadius: 12 }}
                                />
                                <View
                                    style={{
                                        flexDirection: "row",
                                        position: "absolute",
                                        left: "5%",
                                        top: "20%",
                                    }}>
                                    <View
                                        style={{
                                            padding: 4,
                                            flexDirection: "row",
                                            width: "100%",
                                        }}>
                                        <View
                                            style={{
                                                width: "10%",
                                                alignItems: "flex-start",
                                                justifyContent: "center",
                                            }}>
                                            <Skeleton
                                                height={Display.setHeight(2.5)}
                                                width={Display.setHeight(2.5)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                        </View>
                                        <View
                                            style={{
                                                width: "75%",
                                            }}>
                                            <Skeleton
                                                height={Display.setHeight(2)}
                                                width={Display.setHeight(25)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                            <Skeleton
                                                height={Display.setHeight(1)}
                                                width={Display.setHeight(10)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                            <Skeleton
                                                height={Display.setHeight(1.6)}
                                                width={Display.setHeight(12)}
                                                style={{
                                                    borderRadius: 5,
                                                    marginTop: Display.setHeight(0.5),
                                                }}
                                                backgroundColor={"rgba(256, 256, 256, 1)"}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
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
                                loadingAddress={loadingAddress}
                                onpress={() => {
                                    navigation.navigate('LocationAccess')
                                }}
                            />
                        </View>
                    </View>
                ) : (
                    <View
                        style={{
                            flex: 1,
                            backgroundColor: '#fff',
                        }}
                    >
                        <View
                            style={{
                                height: Display.setHeight(12),
                                backgroundColor: '#F4E4CD',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row',
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
                            >Adressen</Text>
                        </View>
                        <SectionList
                            style={{
                                flex: 1,
                                marginBottom: Display.setHeight(15) // Adjust for the fixed footer
                            }}
                            sections={sectionsData}
                            keyExtractor={(item, index) => index.toString()}
                            renderItem={renderItem}
                        />
                        <View
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: Display.setHeight(11),
                                backgroundColor: '#fff',
                            }}
                        >
                            <View
                                style={{
                                    width: '100%',
                                    height: Display.setHeight(0.1),
                                    backgroundColor: '#f1f1f1',
                                }}
                            />
                            <AddresseButton
                                onpress={() => {
                                    navigation.navigate('LocationAccess')
                                }}
                            />
                        </View>
                    </View>

                )}
        </>
    )
}

export default AddressesScreen

const styles = StyleSheet.create({})