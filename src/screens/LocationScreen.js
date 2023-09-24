import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { clientData } from '../shared/ClientData';
import { Display } from '../utils';
import { RestaurantService } from '../services';
import Button from '../components/Button';
import StorageService from '../services/StorageService';
import { setIsFirstTimeUse } from '../actions/GeneralAction';
import { useDispatch } from 'react-redux';

const config = require('../../package.json').projectName;
const CLIENT_NAME = config.name;
const { width, height } = Dimensions.get('screen');

const LocationScreen = ({ navigation }) => {
    const [locationUser, setLocationUser] = useState(null);
    const [franchiseLocation, setFranchiseLocation] = useState(null);
    const [selectedLocationData, setSelectedLocationData] = useState(null);
    const [outOfRange, setOutOfRange] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const dispatch = useDispatch();

    const Client = clientData.find((client) => client.name === CLIENT_NAME);
    const clientId = Client.clientId;
    const [maxDistance, setMaxDistance] = useState(Client.maxDistance);

    useEffect(() => {
        const fetchFranchises = async () => {
            try {
                const response = await RestaurantService.getFranchises({ clientId });
                if (response?.status) {
                    setFranchiseLocation(response.data);
                } else {
                    console.error(`Error: ${response.message}`);
                }
            } catch (error) {
                console.error(`Error fetching franchises: ${error}`);
            }
        };

        fetchFranchises();
    }, []);

    useEffect(() => {
        const fetchLocation = async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            try {
                let location = await Location.getCurrentPositionAsync({});
                let geocodeResults = await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
                let country = geocodeResults[0].country;
                setLocationUser({
                    Latitude: location.coords.latitude,
                    Longitude: location.coords.longitude,
                    Country: country,
                });
            } catch (error) {
                console.error(`Error fetching user location: ${error}`);
            }
        };

        fetchLocation();
    }, []);

    const haversineDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLon = ((lon2 - lon1) * Math.PI) / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000;
    };

    useEffect(() => {
        const evaluateLocation = async () => {
            if (locationUser && franchiseLocation) {
                let closestFranchise = null;
                let minDistance = Infinity;

                franchiseLocation.forEach((franchise) => {
                    const distance = haversineDistance(
                        locationUser.Latitude,
                        locationUser.Longitude,
                        franchise.Latitude,
                        franchise.Longitude,
                    );
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestFranchise = franchise;
                    }
                });

                if (closestFranchise) {
                    let locationData;
                    if (minDistance <= 4000) {
                        locationData = {
                            Franchise: closestFranchise.Title,
                            FranchiseId: closestFranchise.Id,
                            UserDistanceFromFranchise: minDistance,
                            DeliveryParams: Client.distanceRange.fourKm,
                            Country: locationUser.Country,
                        };
                    } else if (minDistance <= 6000) {
                        locationData = {
                            Franchise: closestFranchise.Title,
                            FranchiseId: closestFranchise.Id,
                            UserDistanceFromFranchise: minDistance,
                            DeliveryParams: Client.distanceRange.sixKm,
                            Country: locationUser.Country,
                        };
                    } else if (minDistance <= 10000) {
                        locationData = {
                            Franchise: closestFranchise.Title,
                            FranchiseId: closestFranchise.Id,
                            UserDistanceFromFranchise: minDistance,
                            DeliveryParams: Client.distanceRange.tenKm,
                            Country: locationUser.Country,
                        };
                    } else {
                        setOutOfRange(true);
                    }

                    if (locationData) {
                        setSelectedLocationData(locationData);
                        try {
                            await StorageService.setLocation(locationData);
                            await StorageService.setFirstTimeUse();
                            await dispatch(setIsFirstTimeUse());
                            navigation.navigate('Main');
                        } catch (error) {
                            console.error(`Error storing location data: ${error}`);
                        }
                    }
                } else {
                    console.log('No franchises available');
                    setOutOfRange(true);
                }
            }
        };

        evaluateLocation();
    }, [locationUser, franchiseLocation, maxDistance]);

    return (
        <View style={styles.container}>
            {outOfRange ? (
                <View style={styles.outOfRangeContainer}>
                    <FontAwesome5 name="search-location" size={Display.setHeight(17)} color="#325964" />
                    <Text style={styles.outOfRangeTitle}>We Haven't{'\n'}Reached Here Yet!</Text>
                    <Text style={styles.outOfRangeSubtitle}>Hold tight, as we plan to{'\n'}serve your location very soon.</Text>
                </View>
            ) : null}
            {errorMsg ? <Text style={styles.error}>{errorMsg}</Text> : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        backgroundColor: '#325964',
    },
    outOfRangeContainer: {
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        backgroundColor: '#ffffff',
    },
    outOfRangeTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000d1d',
        textAlign: 'center',
        flexWrap: 'wrap',
        marginTop: Display.setHeight(5),
    },
    outOfRangeSubtitle: {
        fontSize: 20,
        fontWeight: '300',
        color: '#022937',
        textAlign: 'center',
        flexWrap: 'wrap',
        margin: Display.setHeight(1.5),
    },
    error: {
        color: 'red',
        fontSize: 14,
        textAlign: 'center',
        marginTop: 20,
    },
});

export default LocationScreen;
