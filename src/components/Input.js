import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const Input = ({
    label,
    iconName,
    error,
    password,
    onFocus = () => { },
    ...props
}) => {
    const [hidePassword, setHidePassword] = useState(password);
    const [isFocused, setIsFocused] = useState(false);
    return (
        <View style={{ marginBottom: 20 }}>
            <Text style={style.label}>{label}</Text>
            <View
                style={[
                    style.inputContainer,
                    {
                        borderColor: error
                            ? 'red'
                            : isFocused
                                ? '#325962'
                                : '#A6B5C',
                        alignItems: 'center',
                    },
                ]}>
                <Icon
                    name={iconName}
                    style={{ color: "#325964", fontSize: 22, marginRight: 10 }}
                />
                <TextInput
                    autoCorrect={false}
                    onFocus={() => {
                        onFocus();
                        setIsFocused(true);
                    }}
                    onBlur={() => setIsFocused(false)}
                    secureTextEntry={hidePassword}
                    style={{ color: "#325964", flex: 1 }}
                    {...props}
                />
                {password && (
                    <Icon
                        onPress={() => setHidePassword(!hidePassword)}
                        name={hidePassword ? 'eye-outline' : 'eye-off-outline'}
                        style={{ color: "#325964", fontSize: 22 }}
                    />
                )}
            </View>
            {error && (
                <Text style={{ marginTop: 7, color: "red", fontSize: 12 }}>
                    {error}
                </Text>
            )}
        </View>
    );
};

const style = StyleSheet.create({
    label: {
        marginVertical: 5,
        fontSize: 14,
        color: "grey",
    },
    inputContainer: {
        height: 55,
        backgroundColor: '#f1f1f1',
        flexDirection: 'row',
        paddingHorizontal: 15,
        borderWidth: 0.5,
        borderRadius: 8,
    },
});

export default Input;
