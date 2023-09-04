import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import * as Location from 'expo-location';
import axios from 'axios';
import { RestaurantService } from '../services';
import { clientData } from '../shared/ClientData';
import { Display } from '../utils';
import Button from '../components/Button';
import StorageService from '../services/StorageService';

const config = require('../../package.json').projectName;
const CLIENT_NAME = config.name;

const { width, height } = Dimensions.get('screen');

const LocationScreen = ({ navigation }) => {

    const [locationUser, setLocationUser] = useState(null);
    const [inPassau, setInPassau] = useState(null);
    const [franchiseLocation, setFranchiseLocation] = useState(null);
    const [fourKM, setFourKM] = useState(false);
    const [sixKM, setSixKM] = useState(false);
    const [tenKM, setTenKM] = useState(false);
    const [outOfRange, setOutOfRange] = useState(false);

    const Client = clientData.find((client) => client.name === CLIENT_NAME);
    const clientId = Client.clientId;

    const [maxDistance, setMaxDistance] = useState(Client.maxDistance)

    useEffect(() => {
        RestaurantService.getFranchises({ clientId }).then(response => {
            if (response?.status) {
                setFranchiseLocation(response?.data)
            } else {
                console.log(`${response.message} Error Status False`);
            }
        })
            .catch(error => {
                console.log(`${error} Error unexpected`);
            });
    }, []);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }
            let location = await Location.getCurrentPositionAsync({});
            let geocodeResults = await Location.reverseGeocodeAsync({ latitude: location.coords.latitude, longitude: location.coords.longitude })
            let country = geocodeResults[0].country;
            setLocationUser({
                Latitude: location.coords.latitude,
                Longitude: location.coords.longitude,
                Country: country
            });
        })();
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

        const distance = R * c * 1000;

        return distance;
    };

    useEffect(() => {
        if (locationUser && franchiseLocation) {
            let closestFranchise = null;
            let minDistance = Infinity;

            franchiseLocation.forEach((franchise) => {
                const { Latitude, Longitude, CoverageAreaInMeters } = franchise;
                const distance = haversineDistance(
                    locationUser.Latitude,
                    locationUser.Longitude,
                    Latitude,
                    Longitude
                );

                if (distance < minDistance) {
                    minDistance = distance;
                    closestFranchise = franchise;
                }
            });

            if (closestFranchise) {
                if (minDistance <= maxDistance) {
                    console.log(`Delivery available from ${closestFranchise.Title}`);
                    if (minDistance <= 4000) {
                        setFourKM({
                            Franchise: closestFranchise.Title,
                            FranchiseId: closestFranchise.Id,
                            UserDistanceFromFranchise: minDistance,
                            DeliveryParams: Client.distanceRange.fourKm,
                            Country: locationUser.Country
                        });
                        console.log('Data to store:', fourKM);
                        StorageService.setLocation(fourKM).then(
                            navigation.navigate('Main')
                        )
                    } else if (minDistance > 4000 && minDistance <= 6000) {
                        setSixKM({
                            Franchise: closestFranchise.Title,
                            FranchiseId: closestFranchise.Id,
                            UserDistanceFromFranchise: minDistance,
                            DeliveryParams: Client.distanceRange.sixKm,
                            Country: locationUser.Country
                        });
                        console.log(sixKM)
                        StorageService.setLocation(sixKM).then(
                            navigation.navigate('Main')
                        )
                    } else if (minDistance > 6000 && minDistance <= 10000) {
                        setTenKM({
                            Franchise: closestFranchise.Title,
                            FranchiseId: closestFranchise.Id,
                            UserDistanceFromFranchise: minDistance,
                            DeliveryParams: Client.distanceRange.tenKm,
                            Country: locationUser.Country
                        });
                        console.log(tenKM)
                        StorageService.setLocation(tenKM).then(
                            navigation.navigate('Main')
                        )
                    } else {
                        setOutOfRange(true);
                    }
                } else {
                    console.log('We have not reached here yet');
                    // setOutOfRange(true);
                    setTenKM({
                        Franchise: closestFranchise.Title,
                        FranchiseId: closestFranchise.Id,
                        UserDistanceFromFranchise: minDistance,
                        DeliveryParams: Client.distanceRange.tenKm,
                        Country: locationUser.Country
                    });
                    console.log(tenKM)
                    StorageService.setLocation(tenKM).then(
                        navigation.navigate('Main')
                    )
                }
            } else {
                console.log('No franchises available');
                setOutOfRange(true);
            }
        }
    }, [locationUser, franchiseLocation, maxDistance]);

    return (
        <View
            style={{
                width: width,
                height: height,
                backgroundColor: '#325964'
            }}
        >
            {
                outOfRange ? (
                    <View
                        style={{
                            width,
                            height,
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            backgroundColor: '#ffffff'
                        }}
                    >
                        <View>
                            <FontAwesome5 name="search-location" size={Display.setHeight(17)} color="#325964" />
                        </View>
                        <View>
                            <Text
                                style={{
                                    fontSize: 28,
                                    fontWeight: 'bold',
                                    color: '#000d1d',
                                    textAlign: 'center',
                                    flexWrap: 'wrap',
                                    marginTop: Display.setHeight(5)
                                }}
                            >We Haven't{'\n'}Reached Here Yet!</Text>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: '300',
                                    color: '#022937',
                                    textAlign: 'center',
                                    flexWrap: 'wrap',
                                    margin: Display.setHeight(1.5)
                                }}
                            >Hold tight, as we plan to{'\n'}serve your location very soon.</Text>
                        </View>
                    </View>
                ) : null
            }
        </View>
    )
}

export default LocationScreen

const styles = StyleSheet.create({})