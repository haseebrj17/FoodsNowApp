import React, { useEffect } from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { useSelector, useDispatch } from 'react-redux';
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
import { appStart } from '../actions/GeneralAction';

const theme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: "transparent",
    },
};

const FirstTimeStack = createStackNavigator();

const FirstTimeNavigator = () => (
    <FirstTimeStack.Navigator screenOptions={{ headerShown: false }}>
        <FirstTimeStack.Screen name="Welcome" component={WelcomeScreen} />
        <FirstTimeStack.Screen name="DataTracking" component={DataTrackingScreen} />
        <FirstTimeStack.Screen name="Location" component={LocationScreen} />
    </FirstTimeStack.Navigator>
);

const MainAppStack = createStackNavigator();

const MainAppNavigator = () => (
    <MainAppStack.Navigator screenOptions={{ headerShown: false }}>
        <MainAppStack.Screen name="Main" component={BottomTabBar} />
        <Stack.Screen name="LocationDetail" component={LocationDetailScreen} />
        <Stack.Screen name="LocationAccess" component={LocationAccessScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="CodeConfirmation" component={CodeConfirmationScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name='HomeNavigator'>
            {() => (
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="Details" component={DetailsScreen} />
                </Stack.Navigator>
            )
            }
        </Stack.Screen>
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
    </MainAppStack.Navigator>
);

const Stack = createStackNavigator();

const Navigators = () => {
    const { isAppLoading, isFirstTimeUse } = useSelector(state => state?.generalState);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(appStart());
    }, []);

    if (isAppLoading) {
        return (
            <NavigationContainer theme={theme}>
                <Stack.Navigator screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="Splash" component={SplashScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer theme={theme}>
            {isFirstTimeUse ? <FirstTimeNavigator /> : <MainAppNavigator />}
        </NavigationContainer>
    );
}

export default Navigators;