import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    DataTrackingScreen,
    // DetailsScreen,
    HomeScreen,
    WelcomeScreen,
    SplashScreen,
    SreachScreen,
    AccountScreen,
    CartScreen
} from '../screens';
import Tabbar from './Tabbar';

const Tab = createBottomTabNavigator();

const BottomTabBar = () => {
    return (
        <Tab.Navigator 
            tabBar={props => <Tabbar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
            initialRouteName='Home'
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Account" component={AccountScreen} />
            <Tab.Screen name="Search" component={SreachScreen} />
            <Tab.Screen name="Cart" component={CartScreen} />
        </Tab.Navigator>
    );
}

export default BottomTabBar;
