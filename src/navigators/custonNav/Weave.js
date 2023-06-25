import React from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { mix, withTransition } from "react-native-redash";
import { Colors, ICON_SIZE, PADDING } from "./icons/Constants";

const SIZE = ICON_SIZE + PADDING * 2;
const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
    },
    weave: {
        borderRadius: SIZE / 2,
        width: SIZE,
        height: SIZE,
        borderWidth: 4,
        borderColor: Colors.primary,
    },
});

export default function Weave({ active, index }) {
    const isActive = Animated.eq(active, index);
    const activeTransition = withTransition(isActive, { duration: 250 });
    // scale=0 doesn't work on Android
    const scale = mix(activeTransition, 0.1, 1.5);
    // Because scale=0 doesn't work we need this interpolation
    const opacity = Animated.interpolate(activeTransition, {
        inputRange: [0, 0.5, 1],
        outputRange: [0, 1, 0],
    });
    return (
        <View style={styles.container}>
            <Animated.View
                style={[styles.weave, { opacity, transform: [{ scale }] }]}
            />
        </View>
    );
};
