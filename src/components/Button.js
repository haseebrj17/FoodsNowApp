import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
const Button = ({ title, onPress = () => { } }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.7}
            style={{
                height: 55,
                width: '100%',
                backgroundColor: '#325962',
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 10,
            }}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18, letterSpacing: 1 }}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default Button;