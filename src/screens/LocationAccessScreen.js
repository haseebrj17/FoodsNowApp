import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Dimensions, StyleSheet, Animated, Text, TouchableOpacity, Platform } from 'react-native';
import { Divider, Button } from 'react-native-paper'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import { MaterialIcons, Ionicons, EvilIcons, Feather } from '@expo/vector-icons';
import { Display } from '../utils';
import { GOOGLE_LOCATION_AUTO_COMPLETE_IOS, GOOGLE_LOCATION_AUTO_COMPLETE_ANDROID } from '@env'
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { NativeBaseProvider } from 'native-base';
import { Input } from '@rneui/base';

const { width, height } = Dimensions.get('screen');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0024;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const LocationAccessScreen = ({ navigation }) => {

    const bottomSheetModalRef = useRef(null);
    const snapPoints = ["50%", "70%"];

    function handlePresentModal() {
        bottomSheetModalRef?.current?.present();
    }

    const renderBackdrop = useCallback(
        (props) => (
            <BottomSheetBackdrop {...props} onPress={closeBottomSheet} />
        ),
        [closeBottomSheet]
    );

    const closeBottomSheet = useCallback(() => {
        bottomSheetModalRef?.current?.close();
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
        fetchLocation();
    }, []);

    const fetchLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            const location = await getLocationWithTimeout();
            if (location) {
                updateLocationState(location.coords);
            } else {
                setErrorMsg('Unable to fetch location');
            }
        } catch (error) {
            setErrorMsg('An error occurred while fetching the location');
            // Optionally log the error or handle it as needed
        }
    };

    const getLocationWithTimeout = () => {
        return new Promise((resolve, reject) => {
            Location.getCurrentPositionAsync({})
                .then(resolve)
                .catch(reject);

            setTimeout(() => {
                resolve(null); // Resolve with null after a timeout (e.g., 5000 ms)
            }, 5000);
        });
    };

    const updateLocationState = (coords) => {
        const updatedLocation = {
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
        };
        Address(updatedLocation);
        setSelectedLocation(updatedLocation);
        setRegion(updatedLocation);
    };

    const Address = async (location) => {
        try {
            const { latitude, longitude } = location;
            const response = await Location.reverseGeocodeAsync({ latitude, longitude });

            if (response.length === 0) {
                // Handle the case where no address is found
                setErrorMsg('No address found for the given location');
                return;
            }

            const firstAddress = response[0];
            setAddress(firstAddress);
            setAddressName(firstAddress.name || '');
            setCity(firstAddress.city || '');
        } catch (error) {
            setErrorMsg('Failed to fetch address');
        }
    };

    // Constants
    const ANIMATION_DURATION_SHORT = 10;
    const ANIMATION_DURATION_LONG = 50;
    const MARKER_JUMP_VALUE = -5;

    // Refs
    const markerTop = useRef(new Animated.Value(0)).current;
    const animatedValue = useRef(new Animated.Value(0)).current;
    const mapRef = useRef();

    // State
    const [mapType, setMapType] = useState('standard');
    const [miniMapType, setMiniMapType] = useState('satellite');

    // Animation function
    const animateMarker = (toValue, duration) => {
        Animated.parallel([
            Animated.timing(animatedValue, {
                toValue,
                duration,
                useNativeDriver: true,
            }),
            Animated.timing(markerTop, {
                toValue: toValue === 0 ? 0 : MARKER_JUMP_VALUE,
                duration,
                useNativeDriver: true,
            })
        ]).start();
    };

    // Toggle functions
    const toggleMapType = () => {
        setMapType(prevType => (prevType === 'standard' ? 'satellite' : 'standard'));
    };

    const toggleMiniMapType = () => {
        setMiniMapType(prevType => (prevType === 'satellite' ? 'standard' : 'satellite'));
        toggleMapType();
    };

    const animateToUserLocation = async () => {
        try {
            const location = await Location.getCurrentPositionAsync({});
            mapRef.current?.animateToRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            }, ANIMATION_DURATION_LONG);
        } catch (error) {
            // Handle location fetching error
        }
    };

    const onRegionChange = (selectedLocation) => {
        animateMarker(0.5, ANIMATION_DURATION_SHORT);
        setSelectedLocation(selectedLocation);
    };

    const onRegionChangeComplete = (selectedLocation) => {
        animateMarker(0, ANIMATION_DURATION_LONG);
        const hasLocationChanged = selectedLocation?.latitude?.toFixed(6) !== region?.latitude?.toFixed(6) || selectedLocation?.longitude?.toFixed(6) !== region?.longitude?.toFixed(6);
        if (hasLocationChanged) {
            setSelectedLocation(selectedLocation);
            Address(selectedLocation);
            setAddressAdded(true);
            setDisabled(false);
        } else {
            setSelectedLocation(region);
            setDisabled(true);
        }
    };

    // Pin Styles
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

    const handleLocationSelect = async (data, details = null) => {
        if (!details || !details.geometry || !details.geometry.location) {
            console.error('Location details are not available');
            return;
        }

        try {
            const selectedLoc = {
                latitude: details.geometry.location.lat,
                longitude: details.geometry.location.lng,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            };

            // Updating state based on selected location
            setSelectedLocation(selectedLoc);
            setAddressAdded(true);

            // Fetch and set address based on selected location
            await Address(selectedLoc);

            // Animate map to the selected region
            if (mapRef.current) {
                mapRef.current.animateToRegion(selectedLoc, 500);
            }

            // Close the bottom sheet modal
            if (bottomSheetModalRef.current) {
                bottomSheetModalRef.current.close();
            }
        } catch (error) {
            console.error('Failed to select location:', error);
        }
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
        >Adressdetails hinzufügen</Button>
    }

    return (
        <View style={styles.container}>
            <View
                style={{
                    width,
                    height: height * 0.70,
                    position: 'absolute',
                    top: '0%'
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
                <Animated.View style={[styles.markerFixed, { transform: [{ translateY: markerTop }] }]}>
                    <Animated.View style={[styles.markerFixed, pinStyle]}>
                        <MaterialIcons name="location-pin" size={Display.setHeight(5)} color="#FFAF51" />
                    </Animated.View>
                </Animated.View>
            </View>
            {errorMsg && <Text>{errorMsg}</Text>}
            <View
                style={{
                    position: 'absolute',
                    bottom: '0%',
                    width,
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
            >
                <View
                    style={{
                        width: Display.setWidth(100),
                        height: Display.setHeight(8),
                        marginBottom: Display.setHeight(1.5),
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <View
                        style={{
                            width: Display.setWidth(90),
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                        }}
                    >
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
                                pointerEvents="none"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={animateToUserLocation}
                            style={{
                                width: Display.setHeight(6),
                                height: Display.setHeight(6),
                                borderRadius: Display.setHeight(3),
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
                </View>
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
                                >Eine neue Adresse hinzufügen</Text>
                            </View>
                            <TouchableOpacity onPress={handlePresentModal} style={{ width: width * 0.9, justifyContent: 'center', alignItems: 'center' }}>
                                <View
                                    style={styles.SearchBar}
                                >
                                    <View style={styles.SearchBarContainer}>
                                        <Ionicons name="search-sharp" size={24} color="#325962" />
                                        <Text style={styles.SearchBarInput}>
                                            Geben Sie Ihre Adresse ein
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
                                    padding: "2%"
                                }}
                            >
                                <View
                                    style={{
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <MaterialIcons name="info" size={Display.setHeight(2.2)} color="#6d6d6d" />
                                </View>
                                <View
                                    style={{
                                        width: '90%',
                                        marginLeft: 5,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: Display.setHeight(1.5),
                                            fontWeight: '400'
                                        }}
                                    >Ihr Fahrer liefert an die angegebene Adresse. Sie können Ihre schriftliche Adresse auf der nächsten Seite bearbeiten.</Text>
                                </View>
                            </View>
                            <AddressButton />
                        </>
                    )}
                </View>
            </View>
            <BottomSheetModalProvider>
                <NativeBaseProvider>
                    <BottomSheetModal
                        ref={bottomSheetModalRef}
                        snapPoints={snapPoints}
                        backdropComponent={renderBackdrop}
                        index={0}
                        enablePanDownToClose={true}
                        isRowScrollable={true}
                        backgroundStyle={{
                            borderRadius: 30
                        }}
                        animateOnMount={true}
                    >
                        <View style={{
                            width: '100%',
                            height: '100%',
                            justifyContent: 'flex-start',
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
                                onPress={handleLocationSelect}
                                query={{
                                    key: Platform.OS === 'ios' ? GOOGLE_LOCATION_AUTO_COMPLETE_IOS : GOOGLE_LOCATION_AUTO_COMPLETE_ANDROID,
                                    language: "de",
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
        left: '50%',
        position: 'absolute',
        top: '50%',
        marginLeft: -Display.setHeight(2.5) / 2,
        marginTop: -Display.setHeight(4.5) / 2,
    },
    miniMap: {
        width: Display.setHeight(9),
        height: Display.setHeight(9),
        borderRadius: Display.setHeight(1),
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