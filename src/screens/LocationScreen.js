import { StyleSheet, Text, View, Dimensions } from 'react-native'
import React, { useEffect } from 'react'
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('screen');

const LocationScreen = () => {
    useEffect(() => {
        Location.requestForegroundPermissionsAsync()
            .then((response) => {
                if (response.status !== 'granted') {
                    Alert.alert(
                        'Permission not granted',
                        'You need to give location permissions to use this app.',
                    );
                }
            })
            .catch((error) => console.log(error));
    }, []);
    return (
        <View
            style={{
                width: width,
                height: height,
            }}
        >
            
        </View>
    )
}

export default LocationScreen

const styles = StyleSheet.create({})