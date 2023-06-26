import React, { useEffect, useRef } from "react";
import {
    View, StyleSheet, TouchableWithoutFeedback, Animated, Dimensions,
} from "react-native";
import { FontAwesome as Icon } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const StaticTabbar = ({ tabs, value }) => {
    const navigation = useNavigation();
    const initValues = tabs.map((tab, index) => new Animated.Value(index === 0 ? 1 : 0));
    const values = useRef(initValues).current;

    const onPress = (index) => {
        const tab = tabs[index];
        navigation.navigate(tab.nav);
        
        const tabWidth = width / tabs.length;
        Animated.sequence([
            Animated.parallel(
                values.map(v => Animated.timing(v, {
                    toValue: 0,
                    duration: 100,
                    useNativeDriver: true,
                })),
            ),
            Animated.parallel([
                Animated.spring(value, {
                    toValue: tabWidth * index,
                    useNativeDriver: true,
                }),
                Animated.spring(values[index], {
                    toValue: 1,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }

    return (
        <View style={styles.container}>
            {
                tabs.map((tab, key) => {
                    const tabWidth = width / tabs.length;
                    const cursor = tabWidth * key;
                    const opacity = value.interpolate({
                        inputRange: [cursor - tabWidth, cursor, cursor + tabWidth],
                        outputRange: [1, 0, 1],
                        extrapolate: "clamp",
                    });
                    const translateY = values[key].interpolate({
                        inputRange: [0, 1],
                        outputRange: [64, 0],
                        extrapolate: "clamp",
                    });
                    const opacity1 = values[key].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1],
                        extrapolate: "clamp",
                    });
                    return (
                        <React.Fragment key={key}>
                            <TouchableWithoutFeedback onPress={() => onPress(key)}>
                                <Animated.View style={[styles.tab, { opacity }]}>
                                    <Icon name={tab.name} color="#325962" size={25} />
                                </Animated.View>
                            </TouchableWithoutFeedback>
                            <Animated.View
                                style={{
                                    position: "absolute",
                                    top: -8,
                                    left: tabWidth * key,
                                    width: tabWidth,
                                    height: 64,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    opacity: opacity1,
                                    transform: [{ translateY }],
                                }}
                            >
                                <View style={styles.activeIcon}>
                                    <Icon name={tab.name} color="#FFAF51" size={25} />
                                </View>
                            </Animated.View>
                        </React.Fragment>
                    );
                })
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
    },
    tab: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: 64,
    },
    activeIcon: {
        backgroundColor: "#325962",
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: '#325962',
        shadowOffset: {
            width: 0,
            height: 6,
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 10,
    },
});

export default StaticTabbar;
