import { Animated, FlatList, StyleSheet, View, ScrollView, Text, Image, Dimensions, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight } from "react-native";
import { AppBar, Button } from "@react-native-material/core";
import { Searchbar } from 'react-native-paper';
import { Center, Flex, Icon, Row, Box, Card, NativeBaseProvider } from "native-base";
import { SimpleLineIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 
import { SliderImage, BrandCard } from "../assets/constants/Slider";
import BrandCardsHome from "../components/BrandCardsHome";
import CustomImageCarousal from "../components/CustomImageCarousal";
import BuyGetOfferList from "../components/BuyGetOffer";
import ChefRecommendation from "../components/ChefReco";
import KidSpecialOffer from "../components/KidSpecial";
import { useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Fonts } from "../assets/constants";
import { StatusBar } from "expo-status-bar";
import Tabbar from "../navigators/Tabbar";
import { useEffect } from "react";


const { width, height } = Dimensions.get('window');

console.log(width, height)

const HomeScreen = () => {
    const [fontsLoaded] = useFonts({
        Fonts
    });
    const navigation = useNavigation();
    return (
        <ScrollView style={{height: height, backgroundColor: '#fff'}}>
            <AppBar style={styles.AppBar}>
                <TouchableOpacity onPress={() => navigation.navigate('Search')} style={{width: width * 0.9, justifyContent: 'center', alignItems: 'center'}}>
                    <View
                        style={styles.SearchBar}
                    >
                        <View style={styles.SearchBarContainer}>
                            <Ionicons name="search-sharp" size={24} color="#325962" />
                            <Text style={styles.SearchBarInput}>
                                Search for restaurants, cuisines, and more....
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={styles.Locationbar}>
                    <Button 
                        title={CustomLocationButton} 
                        contentContainerStyle={[
                            styles.ButtonLocation,
                            {
                                backgroundColor: "#F4E4CD",
                                height: "100%"
                            }
                        ]}
                        style={{
                            backgroundColor: "#F4E4CD",
                            width: "40%",
                            height: 50,
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        color="#F4E4CD"
                        disableElevation={true}
                    />
                    <Button
                        title="Sign Up"
                        color="#FFAF51"
                        uppercase={false}
                        titleStyle={{ color: "#325962" }}
                        style={{
                            position: "absolute",
                            right: "9%",
                        }}
                        contentContainerStyle={[
                            styles.ButtonSignUp,
                            {
                                shadowOffset: {
                                    width: 50,
                                    height: 50,
                                },
                                shadowColor: "rgba(0, 0, 0, 1)",
                                shadowOpacity: 1,
                                shadowRadius: 100,
                            }
                        ]}
                    />
                </View>
            </AppBar>
            <View style={styles.carouselContainer}>
                <CustomImageCarousal
                    data={SliderImage}
                    autoPlay={true}
                    pagination={true}
                />
            </View>
            <View style={{ width: "100%", height: "0.5%", backgroundColor: "#f1f1f1" }} />
            <Button
                title={customTitleDorm}
                style={styles.ButtonDorm}
                color="rgba(50, 89, 98, 0.2)"
                disableElevation={true}
                uppercase={false}
                leading
            />
            <View style={{ width: "100%", height: "0.5%", backgroundColor: "#f1f1f1", marginTop: "3%", marginBottom: 10 }}></View>
            <BrandCardsHome />
            <View style={{ width: "100%", height: "0.5%", backgroundColor: "#f1f1f1", marginTop: "3%", marginBottom: 5 }}></View>
            <View
                style={[
                    styles.Container,
                    {
                        backgroundColor: "red",
                        width: "90%",
                        height: undefined,
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                        borderRadius: 12,
                        marginBottom: 5,
                    }
                ]}
            >
                <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" borderRadius={8} onPress={() => navigation.navigate('Splash')}>
                    <Image source={require('../assets/images/10.png')} style={[styles.Image, {borderRadius: 12}]} />
                </TouchableHighlight>
            </View>
            <View style={{ width: "100%", height: "0.5%", backgroundColor: "#f1f1f1", }} />
            <View style={styles.Container}>
                <BuyGetOfferList />
            </View>
            <View style={{ width: "100%", height: "0.5%", backgroundColor: "#f1f1f1", marginTop: "3%", marginBottom: 5 }}></View>
            <View
                style={[
                    styles.Container,
                    {
                        backgroundColor: "red",
                        width: "90%",
                        height: undefined,
                        justifyContent: "center",
                        alignItems: "center",
                        alignSelf: "center",
                        borderRadius: 12,
                        marginBottom: 5,
                    }
                ]}
            >
                <TouchableHighlight onPress={() => navigation.navigate('Welcome')}   activeOpacity={0.6} underlayColor="#DDDDDD" borderRadius={8}>
                    <Image source={require('../assets/images/11.png')} style={[styles.Image, {borderRadius: 12}]} />
                </TouchableHighlight>
            </View>
            <View style={{ width: "100%", height: "0.5%", backgroundColor: "#f1f1f1" }}></View>
            <View style={styles.Container}>
                <ChefRecommendation />
            </View>
            <View style={{ width: "100%", height: "0.5%", backgroundColor: "#f1f1f1"}}></View>
            <View style={styles.Container}>
                <KidSpecialOffer />
            </View>
        </ScrollView>
    )
}

const custonTitleGeneral = () => {
    return (
        <Text
            style={{
                color: "#325962",
                fontSize: 12,
                fontWeight: "600",
                letterSpacing: 0.2,
                paddingLeft: 20,
                paddingRight: 20,
                // marginTop: 2,
            }}
        >Explore Buy 1 Get 1 Offer</Text>
    )
}

const customTitleDorm = () => {
    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            alignContent: 'center',
            width: "100%",
            height: "100%",
            top: "5%",
        }}>
            <Image source={require('../assets/icons/DormUniHome.png')} style={{width: 50, height: 50, marginTop: "2%"}} />
            <View style={{ 
                    flexDirection: "column",
                    position: "absolute",
                    top: "15%",
                    left: "18%",
                }}
            >
                <Text style={{ fontWeight: 'bold', fontSize: 12, color: "#325962" }}>Essen ins Wohnheim liefern lassen</Text>
                <Text style={{ fontSize: 9, color: "#325962", marginTop: 2, }}>Essen, das Sie lieben, direkt ans Bett geliefert</Text>
            </View>
            <SimpleLineIcons 
                name="arrow-right" 
                size={15} 
                color="#325962" 
                style={{
                    position: "absolute",
                    top: "37%",
                    right: "1%",
                }} 
            />
        </View>
    )
}

const CustomLocationButton = () => {
    return (
        <View style={{flexDirection: "row"}}>
            <Image 
                source={require('../assets/LocationPinHome.png')} 
                style={{
                    height: 40,
                    width: 40,
                    marginTop: "3%",
                }} />
            <Text style={{        
                fontSize: 20,
                color: "#325962",
                fontWeight: "bold",
                marginLeft: 5,
                marginTop: "8%"
            }}>Location</Text>
            <SimpleLineIcons 
                name="arrow-down" 
                size={18} 
                color="black" 
                style={{
                    marginTop: "14%",
                    marginLeft: "5%"
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    Container: {
        alignContent: "center",
        justifyContent: "center"
    },
    ContainerGold: {
        alignContent: 'center',
        justifyContent: 'center',
        backgroundColor: "#000"
    },
    AppBar: {
        backgroundColor: '#F4E4CD',
        height: 135,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    SearchBarContainer: {
        width: '95%',
        height: "80%",
        flexDirection: 'row',
        alignItems: 'center',
    },
    SearchBar: {
        width: '100%',
        height: 40,
        backgroundColor: 'white',
        borderRadius: 12,
        fontSize: 20,
        borderColor: 'rgba(50, 89, 98, 0.4)',
        borderWidth: 1,
        marginTop: 30,
        shadowColor: 'black',
        shadowOffset: { width: 10, height: 100 },
        justifyContent: 'center',
        alignItems: 'center',
    },
    SearchBarInput: {
        fontSize: 13,
        alignSelf: "center",
        opacity: 0.6,
        marginLeft: 10
    },
    // ButtonLocation: {
    //     width: "50%",
    //     height: 40,
    // },
    Locationbar: {
        width: '100%',
        height: 30,
        position: "absolute",
        top: 40,
        left: '3.5%',
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    LocationPinHome: {
        height: 40,
        width: 40,
    },
    LocationText: {
        fontSize: 20,
        color: "#325962",
        fontWeight: "bold",
        fontFamily: "Poppins-ExtraLightItalic",
        marginLeft: 5
    },
    ButtonSignUp: {
        borderWidth: 1,
        borderColor: "rgba(50, 89, 98, 0.4)",
        shadowOffset: {
            width: 50,
            height: 50,
        },
        shadowColor: "rgba(0, 0, 0, 1)",
        shadowOpacity: 1,
        shadowRadius: 100,
    },
    carouselContainer: {
        marginTop: 10,
    },
    ButtonDorm: {
        width: '90%',
        height: 45,
        alignSelf: "center",
        alignContent: "center",
        alignItems: "center",
        marginTop: 12,
        // backgroundColor: "rgba(50, 89, 98, 0.2)"
    },
    Button: {
        width: '60%',
        height: 40,
        alignSelf: "center",
        marginTop: 2,
        marginBottom: 10,
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(50, 89, 98, 0.4)"
    },
    Image: {
        width: '100%',
        height: undefined,
        aspectRatio: 3/1,
    },
    Text: {
        fontSize: 15,
        color: '#325962',
        fontWeight: "bold",
        alignSelf: "center",
        marginBottom: 5,
        marginTop: 10,
    },
})

export default HomeScreen;