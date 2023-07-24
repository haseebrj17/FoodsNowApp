import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react'
import { StorageService } from '../services';
import { Display } from '../utils';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('screen');

const SettingsScreen = ({ navigation }) => {
    return (
        <View
            style={{
                width,
                height,
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
                >Settings</Text>
            </View>

        </View>
    )
}

export default SettingsScreen

const styles = StyleSheet.create({})