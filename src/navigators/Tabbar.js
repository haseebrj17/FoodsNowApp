import React, { useRef } from "react";
import {
    SafeAreaView, StyleSheet, Dimensions, View, Animated,
} from "react-native";
import * as shape from "d3-shape";
import Svg, { Path } from 'react-native-svg';

import StaticTabbar from "./StaticTabbar";

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const { width } = Dimensions.get("window");
const height = 64;
const tabs = [
    {
        name: "home",
        nav: "Home"  // changed from "HomeScreen"
    },
    {
        name: "user",
        nav: "Account"  // changed from "AccountScreen"
    },
    {
        name: "search",
        nav: "Search",  // changed from "SreachScreen"
    },
    {
        name: "shopping-cart",
        nav: 'Cart'  // changed from "CartScreen"
    },
];
const tabWidth = width / tabs.length;
const backgroundColor = "#F4E4CD";

const getPath = () => {
    const left = shape.line().x(d => d.x).y(d => d.y)([
        { x: 0, y: 0 },
        { x: width, y: 0 },
    ]);
    const tab = shape.line().x(d => d.x).y(d => d.y).curve(shape.curveBasis)([
        { x: width, y: 0 },
        { x: width + 5, y: 0 },
        { x: width + 10, y: 10 },
        { x: width + 15, y: height  * 0.8},
        { x: width + tabWidth - 15, y: height * 0.8 },
        { x: width + tabWidth - 10, y: 10 },
        { x: width + tabWidth - 5, y: 0 },
        { x: width + tabWidth, y: 0 },
    ]);
    const right = shape.line().x(d => d.x).y(d => d.y)([
        { x: width + tabWidth, y: 0 },
        { x: width * 2, y: 0 },
        { x: width * 2, y: height },
        { x: 0, y: height },
        { x: 0, y: 0 },
    ]);
    return `${left} ${tab} ${right}`;
};

const d = getPath();

const Tabbar = ({ navigation }) => {
    const value = useRef(new Animated.Value(0)).current;

    const translateX = value.interpolate({
        inputRange: [0, width],
        outputRange: [-width, 0],
    });

    return (
        <>
            <View style={{ height, width }}>
                <AnimatedSvg width={width * 2} style={{ height, transform: [{ translateX }] }}>
                    <Path fill={backgroundColor} d={d} />
                </AnimatedSvg>
                <View style={StyleSheet.absoluteFill}>
                    <StaticTabbar tabs={tabs} value={value} navigation={navigation} />
                </View>
            </View>
        </>
    );
};

export default Tabbar;
