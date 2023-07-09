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
                backgroundColor: '#',
                marginVertical: 20,
                justifyContent: 'center',
                alignItems: 'center',
            }}>
            <Text style={{ color: COLORS.white, fontWeight: 'bold', fontSize: 18 }}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

export default Button;