import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Dimensions, StyleSheet, Image, Animated, Text, TouchableOpacity } from 'react-native';
import { Divider, Searchbar } from 'react-native-paper'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import CustomLocationPin from '../assets/icons/CustomLocationPin';
import { MaterialIcons, Ionicons, EvilIcons, Feather } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { Display } from '../utils';
import { Fonts } from '../assets/constants';
import { GOOGLE_LOCATION_AUTO_COMPLETE } from '@env'
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { NativeBaseProvider } from 'native-base';
import { Input } from '@rneui/base';
import { Button } from 'react-native-paper';


const { width, height } = Dimensions.get('screen');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0024;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const LocationAccessScreen = ({ navigation }) => {

    const [fontsLoaded] = useFonts({
        Fonts
    });

    const [isOpen, setIsOpen] = useState(true)

    const [isEnabled, setIsEnabled] = useState(false);

    const bottomSheetModalRef = useRef(null);
    const snapPoints = ["50%"];

    function handlePresentModal() {
        bottomSheetModalRef.current?.present();
    }

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop {...props} onPress={closeBottomSheet} />
        ),
        [closeBottomSheet]
    );

    const closeBottomSheet = useCallback(() => {
        setIsOpen(false);
        bottomSheetModalRef.current.close();
    }, []);

    const handleSheetChanges = useCallback((index) => {
        setIsOpen(index > 0 ? true : false);
    }, []);

    const [region, setRegion] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [address, setAddress] = useState(null);
    const [addressName, setAddressName] = useState(null);
    const [city, setCity] = useState(null)
    const [disabled, setDisabled] = useState(true);
    const [addressAdded, setAddressAdded] = useState(false)

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            Address(location.coords);
            setSelectedLocation({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            })
            setRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            });
        })();
    }, []);

    const Address = async (location) => {
        const { latitude, longitude } = location;
        console.log(latitude, longitude)
        let response = await Location.reverseGeocodeAsync({
            latitude,
            longitude
        });
        if (response[0]) {
            let firstAddress = response[0];
            let formattedAddressName = `${firstAddress.name}`;
            let formattedAddressCity = `${firstAddress.city}`;
            setAddress(firstAddress)
            setAddressName(formattedAddressName);
            setCity(formattedAddressCity)
            console.log(firstAddress)
        }
    }

    const markerTop = useRef(new Animated.Value(0)).current;
    const animatedValue = useRef(new Animated.Value(0)).current;

    const mapRef = useRef();

    const [mapType, setMapType] = useState('mutedStandard');

    const toggleMapType = () => {
        setMapType(mapType === 'mutedStandard' ? 'satellite' : 'mutedStandard');
    };

    const [miniMapType, setMiniMapType] = useState('satellite');

    const toggleMiniMapType = () => {
        setMiniMapType(miniMapType === 'satellite' ? 'mutedStandard' : 'satellite');
        toggleMapType()
    };

    const animateToUserLocation = async () => {
        let location = await Location.getCurrentPositionAsync({});
        mapRef.current.animateToRegion({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        }, 500);
    };

    const onRegionChange = (selectedLocation) => {
        Animated.parallel([
            Animated.timing(animatedValue, {
                toValue: 0.5,
                duration: 50,
                useNativeDriver: true,
            }),
            Animated.timing(markerTop, {
                toValue: -5,
                duration: 50,
                useNativeDriver: true,
            })
        ]).start();
        setSelectedLocation(selectedLocation);
    };

    const onRegionChangeComplete = (selectedLocation) => {
        Animated.parallel([
            Animated.timing(animatedValue, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }),
            Animated.timing(markerTop, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            })
        ]).start();
        if ((selectedLocation.latitude.toFixed(6) !== region.latitude.toFixed(6)) || (selectedLocation.longitude.toFixed(6) !== region.longitude.toFixed(6))) {
            setSelectedLocation(selectedLocation);
            Address(selectedLocation);
            setAddressAdded(true);
            setDisabled(false);
        } else {
            setSelectedLocation(region);
            setDisabled(true);
        }
    };

    const pinStyle = {
        transform: [
            {
                scale: animatedValue.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1.3]
                })
            },
            { translateY: markerTop }
        ],
        opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.6]
        }),
    };

    const AddressButton = () => {
        return <Button
            name='locationButton'
            disabled={disabled}
            title="Sign Up"
            mode='contained'
            buttonColor='#FFAF51'
            textColor='#325964'
            uppercase={false}
            onPress={() => navigation.navigate('LocationDetail', { address, selectedLocation })}
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
        >Add Address Details</Button>
    }

    return (
        <View style={styles.container}>
            <View
                style={{
                    width,
                    height: height * 0.65,
                }}
            >
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    mapType={mapType}
                    ref={mapRef}
                    showsUserLocation
                    initialRegion={region}
                    onRegionChange={onRegionChange}
                    onRegionChangeComplete={onRegionChangeComplete}
                >
                </MapView>
                <TouchableOpacity
                    onPress={toggleMiniMapType}
                    style={styles.miniMap}
                >
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.miniMap}
                        mapType={miniMapType}
                        showsUserLocation
                        initialRegion={region}
                        onRegionChange={onRegionChange}
                        onRegionChangeComplete={onRegionChangeComplete}
                    />
                </TouchableOpacity>
                <Animated.View style={[styles.markerFixed, { transform: [{ translateY: markerTop }] }]}>
                    <Animated.View style={[styles.markerFixed, pinStyle]}>
                        <MaterialIcons name="location-pin" size={Display.setHeight(5)} color="#FFAF51" />
                    </Animated.View>
                </Animated.View>
                <TouchableOpacity
                    onPress={animateToUserLocation}
                    style={{
                        zIndex: 9999,
                        position: 'absolute',
                        bottom: '2.5%',
                        right: '5%',
                        width: Display.setHeight(6),
                        height: Display.setHeight(6),
                        borderRadius: '50%',
                        backgroundColor: '#fff',
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: '#325964',
                        shadowOffset: {
                            width: -1,
                            height: 4
                        },
                        elevation: 5,
                        shadowOpacity: 0.4,
                    }}
                >
                    <View>
                        <MaterialIcons name="my-location" size={35} color="#325964" />
                    </View>
                </TouchableOpacity>
            </View>
            {errorMsg && <Text>{errorMsg}</Text>}
            <View
                style={{
                    width,
                    height: height * 0.35,
                    alignItems: 'center',
                    borderTopLeftRadius: 35,
                    borderTopRightRadius: 35,
                    backgroundColor: "#fff",
                    shadowColor: '#325964',
                    shadowOffset: {
                        width: 0,
                        height: -2
                    },
                    elevation: 10,
                    shadowOpacity: 0.4,
                }}
            >
                {!addressAdded || disabled ? (
                    <>
                        <View
                            style={{
                                width: width * 0.9,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 22,
                                    fontWeight: 'bold',
                                    color: '#325964',
                                    marginTop: Display.setHeight(2)
                                }}
                            >Add a new address</Text>
                        </View>
                        <TouchableOpacity onPress={handlePresentModal} style={{ width: width * 0.9, justifyContent: 'center', alignItems: 'center' }}>
                            <View
                                style={styles.SearchBar}
                            >
                                <View style={styles.SearchBarContainer}>
                                    <Ionicons name="search-sharp" size={24} color="#325962" />
                                    <Text style={styles.SearchBarInput}>
                                        Enter your address
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <Divider
                            style={{
                                height: Display.setHeight(0.1),
                                backgroundColor: '#f1f1f1',
                                width: width,
                                marginTop: Display.setHeight(2)
                            }}
                        />
                        <AddressButton />
                    </>
                ) : (
                    <>
                        <View
                            style={{
                                width: width * 0.9,
                                height: Display.setHeight(6),
                                justifyContent: 'center',
                                flexDirection: 'row',
                                marginVertical: Display.setHeight(2)
                            }}
                        >
                            <View
                                style={{
                                    width: '15%',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <EvilIcons name="location" size={Display.setHeight(4)} color="#325964" />
                            </View>
                            <View
                                style={{
                                    width: '85%',
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
                                    >{addressName ? addressName : ''}</Text>
                                    <Text
                                        style={{
                                            fontSize: 14,
                                            fontWeight: '600',
                                            color: '#7f7f7f'
                                        }}
                                    >{city ? city : ''}</Text>
                                </View>
                                <TouchableOpacity
                                    onPress={handlePresentModal}
                                >
                                    <Feather name="edit-2" size={22} color="#325964" />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View
                            style={{
                                width: width * 0.9,
                                height: Display.setHeight(8),
                                borderRadius: 10,
                                backgroundColor: "#f1f1f1",
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                flexDirection: 'row',
                                padding: "3%"
                            }}
                        >
                            <View
                                style={{
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <MaterialIcons name="info" size={20} color="#6d6d6d" />
                            </View>
                            <View
                                style={{
                                    width: '90%',
                                    marginLeft: 5
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 14,
                                        fontWeight: '400'
                                    }}
                                >Your rider will deliver to the pinned location. You can edit your written address on the next page.</Text>
                            </View>
                        </View>
                        <AddressButton />
                    </>
                )}
            </View>
            <BottomSheetModalProvider>
                <NativeBaseProvider>
                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        snapPoints={snapPoints}
                        backdropComponent={renderBackdrop}
                        onAnimate={handleSheetChanges}
                        index={0}
                        enablePanDownToClose={true}
                        onClose={() => setIsOpen(false)}
                        isRowScrollable={true}
                        backgroundStyle={{
                            borderRadius: 30
                        }}
                        animateOnMount={true}
                    >
                        <View style={{
                            width: '100%',
                            height: '100%',
                            justifyContent: 'start',
                            alignItems: 'center'
                        }}>
                            <GooglePlacesAutocomplete
                                placeholder="Enter your address"
                                fetchDetails={true}
                                enableHighAccuracyLocation={true}
                                enablePoweredByContainer={false}
                                textInputProps={{
                                    InputComp: Input,
                                    leftIcon: { type: 'font-awesome', name: 'search', size: 24, color: '#325964' },
                                    errorStyle: { color: 'red' },
                                }}
                                GooglePlacesSearchQuery={{
                                    rankby: "distance"
                                }}
                                onPress={(data, details = null) => {
                                    const selectedLoc = {
                                        latitude: details.geometry.location.lat,
                                        longitude: details.geometry.location.lng,
                                    };
                                    setSelectedLocation(selectedLoc);
                                    Address(selectedLoc);
                                    setAddress(selectedLoc);
                                    setAddressAdded(true);
                                    mapRef.current.animateToRegion({
                                        latitude: selectedLoc.latitude,
                                        longitude: selectedLoc.longitude,
                                        latitudeDelta: LATITUDE_DELTA,
                                        longitudeDelta: LONGITUDE_DELTA,
                                    }, 500);
                                    bottomSheetModalRef.current.close();
                                }}
                                query={{
                                    key: GOOGLE_LOCATION_AUTO_COMPLETE,
                                    language: "de",
                                    components: "country:de",
                                    radius: 30000,
                                    GooglePlacesSearchQuery: { rankby: 'distance' },
                                    location: `${selectedLocation?.latitude}, ${selectedLocation?.longitude}`
                                }}
                                styles={{
                                    container: {
                                        flex: 0,
                                        position: "relative",
                                        width: width * 0.9,
                                        zIndex: 1,
                                        margin: 10
                                    },
                                    listView: {
                                        width: width * 0.9,
                                    },
                                    loader: {
                                        color: '#325964'
                                    },
                                    separator: {
                                        width: width * 0.90,
                                        alignSelf: 'center',
                                        backgroundColor: '#325964'
                                    },
                                    description: {
                                        fontSize: 15,
                                        fontWeight: '400',
                                        fontFamily: 'PBO'
                                    }
                                }}
                            />
                        </View>
                    </BottomSheetModal>
                </NativeBaseProvider>
            </BottomSheetModalProvider>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    markerFixed: {
        left: '44.6%',
        position: 'absolute',
        top: '47.4%',
    },
    miniMap: {
        width: Display.setHeight(9),
        height: Display.setHeight(9),
        position: 'absolute',
        bottom: '1%',
        left: '1.5%',
        borderRadius: 10,
    },
    SearchBarContainer: {
        width: '95%',
        height: "80%",
        flexDirection: 'row',
        alignItems: 'center',
    },
    SearchBar: {
        width: '100%',
        height: Display.setHeight(5),
        backgroundColor: 'white',
        borderRadius: 12,
        fontSize: 20,
        borderColor: 'rgba(50, 89, 98, 0.4)',
        borderWidth: 1,
        marginTop: 30,
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 100 },
        justifyContent: 'center',
        alignItems: 'center',
    },
    SearchBarInput: {
        fontSize: 15,
        alignSelf: "center",
        opacity: 0.6,
        marginLeft: 10
    },
    ButtonSignUp: {
        width: width * 0.9,
        height: Display.setHeight(5),
        borderWidth: 1,
        borderColor: "rgba(50, 89, 98, 0.5)",
        borderRadius: 50
    },
});

export default LocationAccessScreen;
