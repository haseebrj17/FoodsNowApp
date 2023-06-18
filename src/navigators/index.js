import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { 
    DataTrackingScreen,
    DetailsScreen,
    HomeScreen,
    WelcomeScreen,
    SplashScreen,
} from "../screens";
import { Connect } from "react-redux";

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
                initialRouteName="DataTracking"
            >
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Details" component={DetailsScreen} />
                <Stack.Screen name="DataTracking" component={DataTrackingScreen} />
                {/* <Stack.Screen name="SlpashScreen" component={SplashScreen}/> */}
                <Stack.Screen name="Welcome" component={WelcomeScreen} /> 
                <Stack.Screen name="Splash" component={SplashScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const mapStateToProps = state => {
    return {
        token: state.generalState.token
    };
};

export default Navigators;