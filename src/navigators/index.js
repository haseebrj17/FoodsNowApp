import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
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
    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                }}
                initialRouteName="Loginr"
            >
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
                <Stack.Screen name="Splash" component={SplashScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default Navigators;