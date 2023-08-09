import React, { Component, useState, useEffect } from 'react';
import { AppRegistry, StyleSheet, Text, View, Dimensions } from 'react-native';
import {
    PlaceholderContainer,
    Placeholder
} from 'react-native-loading-placeholder';
import { LinearGradient } from 'expo-linear-gradient';

const Test = (props) => {
    const [loadingComponent, setLoadingComponent] = useState(null);

    useEffect(() => {
        setLoadingComponent(new Promise(resolve => {
            setTimeout(() => {
                resolve(
                    <View
                        style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Text>Resolved</Text>
                    </View>
                );
            }, 600000);
        }));
    }, []);

    return (
        <View style={styles.container}>
            <PlaceholderExample loader={loadingComponent} />
        </View>
    );
};


const Gradient = () => {
    return (
        <LinearGradient
            colors={['#eeeeee', '#dddddd', '#eeeeee']}
            start={{ x: 1.0, y: 0.0 }}
            end={{ x: 0.0, y: 0.0 }}
            style={{
                flex: 1,
                width: 120
            }}
        />
    );
};

const PlaceholderExample = ({ loader }) => {
    return (
        <PlaceholderContainer
            style={styles.placeholderContainer}
            animatedComponent={<Gradient />}
            duration={900}
            delay={10}
            loader={loader}
        >
            <View style={styles.placeholderTitle}>
                <Placeholder style={[styles.placeholderTitle__text, { width: '50%' }]} />
            </View>
            <Placeholder style={[styles.placeholder, { width: '50%' }]} />
            <Placeholder style={[styles.placeholder, { width: '80%' }]} />
            <Placeholder style={[styles.placeholder, { width: '90%' }]} />
            <Placeholder style={[styles.placeholder, { width: '50%' }]} />
            <Placeholder style={[styles.placeholder, { width: '80%' }]} />
            <Placeholder style={[styles.placeholder, { width: '90%' }]} />
            <Placeholder style={[styles.placeholder, { width: '50%' }]} />
        </PlaceholderContainer>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    placeholderContainer: {
        width: 300,
        height: 500,
    },
    
})

export default Test;
