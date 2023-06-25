import React, { cloneElement } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Animated from "react-native-reanimated";
import { withTransition, withSpringTransition } from "react-native-redash";
import { DURATION, ICON_SIZE } from "./icons/Constants";

const styles = StyleSheet.create({
    icon: {
        overflow: "hidden",
    },
});

const Tab = ({ children, active, transition, index, onPress }) => {
    const isActive = Animated.eq(active, index);
    const activeTransition = withTransition(isActive, { duration: DURATION });
    const isGoingLeft = Animated.greaterThan(transition, active);
    const width = Animated.interpolate(activeTransition, {
        inputRange: [0, 1],
        outputRange: [0, ICON_SIZE],
    });
    const direction = Animated.cond(
        isActive,
        Animated.cond(isGoingLeft, "rtl", "ltr"),
        Animated.cond(isGoingLeft, "ltr", "rtl")
    );
    return (
        <TouchableWithoutFeedback {...{ onPress }}>
            <Animated.View
                style={{
                    direction,
                    width: ICON_SIZE,
                    height: ICON_SIZE,
                }}
            >
                <View style={StyleSheet.absoluteFill}>{children}</View>
                <Animated.View style={[styles.icon, { width }]}>
                    {cloneElement(children, { active: true })}
                </Animated.View>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

export default Tab;
