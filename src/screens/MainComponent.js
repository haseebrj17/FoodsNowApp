import { Platform, View } from 'react-native';
import { Constants } from 'expo-constants';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './Home';
import DetailsScreen from './Details';

const Drawer  = createDrawerNavigator();

const screenOptions = {
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: '#5637DD' }
}

const HomeNavigator = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator screenOptions={screenOptions}>
            <Stack.Screen
                name='Home'
                component={HomeScreen}
                options={{ title: 'Home' }}
            />
        </Stack.Navigator>
    )
}

// const AboutNavigator = () => {
//     const Stack = createStackNavigator();
//     return (
//         <Stack.Navigator screenOptions={screenOptions}>
//             <Stack.Screen
//                 name='About'
//                 component={AboutScreen}
//             />
//         </Stack.Navigator>
//     )
// }

// const ContactNavigator = () => {
//     const Stack = createStackNavigator();
//     return (
//         <Stack.Navigator screenOptions={screenOptions}>
//             <Stack.Screen
//                 name='Contact'
//                 component={ContactScreen}
//                 options={
//                     {title: 'Contact Us'}
//                 }
//             />
//         </Stack.Navigator>
//     )
// }

const DirectoryNavigator = () => {
    const Stack = createStackNavigator();
    return (
        <Stack.Navigator
            initialRouteName='Directory'
            screenOptions={screenOptions}
        >
            <Stack.Screen
                name='Directory'
                component={DetailsScreen}
                options={
                    {title: 'Campsite Directory'}
                }
            />
            <Stack.Screen
                name='CampsiteInfo'
                component={DetailsScreen}
                options={
                    ({ route }) => ({ 
                        title: route.params.campsite.name
                    })
                }
            />
        </Stack.Navigator>
    )
}

const Main = () => {
    return (
        <View>
            <Drawer.Navigator 
                initialRouteName='Home' 
                drawerStyle={{
                    backgroundColor: '#CEC8FF' 
                }}
            >

                <Drawer.Screen 
                    name='Directory'
                    component={DirectoryNavigator}
                    options={{ title: 'Directory' }}
                />
            </Drawer.Navigator>
        </View>
    );
};

export default Main;