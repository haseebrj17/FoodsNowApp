import React, { useEffect } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useSelector, useDispatch } from 'react-redux';
import { GeneralAction } from '../actions';
import {
    DataTrackingScreen,
    DetailsScreen,
    HomeScreen,
    WelcomeScreen,
    SplashScreen,
    SreachScreen,
    DishDetailScreen,
    LoginScreen,
    RegistrationScreen,
    VerificationScreen,
    CodeConfirmationScreen,
    LocationScreen,
    AccountScreen,
    PersonalDetialsScreen,
    AddressesScreen,
    SchedulesScreen,
    OrderReoderingScreen,
    SettingsScreen,
    MoreScreen,
    LocationAccessScreen,
    LocationDetailScreen,
    Auth,
    CartScreen,
    CheckoutScreen,
} from "../screens";
import BottomTabBar from "./BottomTabBar";

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "transparent",
    },
};

const Stack = createStackNavigator();

const Navigators = () => {
    const { isAppLoading, token, isFirstTimeUse } = useSelector(
        state => state?.generalState,
    );
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(GeneralAction.appStart());
    }, []);
    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                initialRouteName="LocationAccess"
            >
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="LocationDetail" component={LocationDetailScreen} />
                <Stack.Screen name="LocationAccess" component={LocationAccessScreen} />
                <Stack.Screen name="Location" component={LocationScreen} />
                <Stack.Screen name="Verification" component={VerificationScreen} />
                <Stack.Screen name="CodeConfirmation" component={CodeConfirmationScreen} />
                <Stack.Screen name="Registration" component={RegistrationScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Main" component={BottomTabBar} />
                <Stack.Screen name="Details" component={DetailsScreen} />
                <Stack.Screen name="DishDetail" component={DishDetailScreen} />
                <Stack.Screen name="DataTracking" component={DataTrackingScreen} />
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="AccountNavigator">
                    {() => (
                        <Stack.Navigator
                            screenOptions={{
                                headerShown: false,
                            }}
                        >
                            <Stack.Screen name="PersonalDetails" component={PersonalDetialsScreen} />
                            <Stack.Screen name="Addresses" component={AddressesScreen} />
                            <Stack.Screen name="Schedules" component={SchedulesScreen} />
                            <Stack.Screen name="OrderReordering" component={OrderReoderingScreen} />
                            <Stack.Screen name="Settings" component={SettingsScreen} />
                            <Stack.Screen name="More" component={MoreScreen} />
                        </Stack.Navigator>
                    )}
                </Stack.Screen>
                <Stack.Screen name="CartNavigator">
                    {() => (
                        <Stack.Navigator
                            screenOptions={{
                                headerShown: false,
                            }}
                        >
                            <Stack.Screen name="Checkout" component={CheckoutScreen} />
                        </Stack.Navigator>
                    )}
                </Stack.Screen>
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigators;