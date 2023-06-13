import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import Home from "./src/screens/Home";
import Details from "./src/screens/Details";
import DataTracking from "./src/screens/DataTracking";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "transparent",
  },
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen  name="Home" component={Home}/>
        <Stack.Screen  name="Details" component={Details}/>
        <Stack.Screen name="DataTracking" component={DataTracking}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}