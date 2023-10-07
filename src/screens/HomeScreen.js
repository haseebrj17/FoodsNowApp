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
import { useEffect, useState } from "react";
import { RestaurantService, StorageService } from "../services";
import { clientData } from '../shared/ClientData';
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands } from "../actions/BrandAction";
import { db } from "../SqlLiteDB";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAvatar } from '@dicebear/core';
import { adventurer, thumbs } from '@dicebear/collection';
import { SvgXml } from 'react-native-svg';
import { Display } from "../utils";

const config = require('../../package.json').projectName;
const CLIENT_NAME = config.name;

const { width, height } = Dimensions.get('window');

console.log(width, height)

const HomeScreen = () => {
    const [fontsLoaded] = useFonts({
        Fonts
    });

    const [brand, setBrand] = useState(null);
    const [deliveryParams, setDeliveryParams] = useState(null);
    const [location, setLocation] = useState(null)

    useEffect(() => {
        const fetchLocationAndDashboard = async () => {
            try {
                const location = await StorageService.getLocation();
                setLocation(location)
                console.log(location)
                const { FranchiseId, DeliveryParams } = location;
                setDeliveryParams(DeliveryParams)
                console.log(location);

                RestaurantService.getDashboard({ FranchiseId }).then(response => {
                    if (response?.status) {
                        const brandsData = response?.data?.brands;
                        setBrand(response?.data?.brands);
                    } else {
                        console.log(`${response.message} Error Status False`);
                    }
                })
                    .catch(error => {
                        console.error(`${error} Error unexpected`);
                    });
            } catch (error) {
                console.error(`Error fetching location: ${error}`);
            }
        };

        fetchLocationAndDashboard();
    }, []);

    const { token, userData, isFirstTimeUse } = useSelector(
        (state) => state.generalState
    )

    const Avatar = createAvatar(adventurer, {
        seed: userData ? userData.FullName : 'Seed',
        backgroundColor: ["b6e3f4", "c0aede", "d1d4f9", "ffd5dc", "ffdfbf"],
        backgroundType: [
            "gradientLinear",
            "solid"
        ],
        mouth: [
            "variant01",
            "variant05",
            "variant06",
            "variant12",
            "variant15",
            "variant16",
            "variant17",
            "variant18",
            "variant20",
            "variant21",
            "variant23",
            "variant24",
            "variant25",
            "variant26",
            "variant27",
            "variant28",
            "variant29",
            "variant30",
            "variant19"
        ],
        skinolor: [
            "ecad80",
            "f2d3b1",
            "9e5622"
        ],
        radius: 50
    }).toString();

    const navigation = useNavigation();
    return (
        <ScrollView style={{ height: height, backgroundColor: '#fff' }}>
            <AppBar style={styles.AppBar}>
                <TouchableOpacity onPress={() => navigation.navigate('Search')} style={{ width: width * 0.9, justifyContent: 'center', alignItems: 'center' }}>
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
                <View style={{
                    width: Display.setWidth(90),
                    height: Display.setHeight(3.5),
                    position: "absolute",
                    top: Display.setHeight(4),
                    display: "flex",
                    left: '5%',
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: 'space-between'
                }}>
                    {
                        token ? (
                            <>
                                <View
                                    style={{
                                        width: '45%',
                                        height: Display.setHeight(3.5),
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-start',
                                    }}
                                >
                                    <Button
                                        title={<CustomLocationButton location={location?.City} />}
                                        contentContainerStyle={
                                            styles.ButtonLocation
                                        }
                                        color="#F4E4CD"
                                        disableElevation={true}
                                    />
                                </View>
                                <View
                                    style={{
                                        width: '40%',
                                        height: Display.setHeight(3.5),
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'flex-end',
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: Display.setHeight(2),
                                            lineHeight: Display.setHeight(4),
                                            fontWeight: 'bold',
                                            color: '#325964'
                                        }}
                                    >{userData?.FullName}</Text>
                                    <View
                                        style={{
                                            width: Display.setHeight(4),
                                            height: Display.setHeight(4),
                                        }}
                                    >
                                        <SvgXml xml={Avatar}
                                            style={{
                                                width: Display.setHeight(4),
                                                height: Display.setHeight(4),
                                            }}
                                        />
                                    </View>
                                </View>
                            </>
                        ) : (
                            <>
                                <Button
                                    title={<CustomLocationButton location={location?.City} />}
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
                                    onPress={() => navigation.navigate('Registration')}
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
                            </>
                        )}
                </View>
            </AppBar>
            <View style={styles.carouselContainer}>
                <CustomImageCarousal
                    data={SliderImage}
                    autoPlay={true}
                    pagination={true}
                />
            </View>
            <View style={{ width: "100%", height: "0.5%", backgroundColor: "#f1f1f1", marginTop: "3%", marginBottom: 10 }}></View>
            <BrandCardsHome brand={brand} deliveryParams={deliveryParams} />
            <View style={{ width: "100%", height: "0.5%", backgroundColor: "#f1f1f1", marginTop: "3%", marginBottom: 5 }}></View>
            {/* <View
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
                <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" borderRadius={8}>
                    <Image source={require('../assets/images/10.png')} style={[styles.Image, { borderRadius: 12 }]} />
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
                <TouchableHighlight activeOpacity={0.6} underlayColor="#DDDDDD" borderRadius={8}>
                    <Image source={require('../assets/images/11.png')} style={[styles.Image, { borderRadius: 12 }]} />
                </TouchableHighlight>
            </View>
            <View style={{ width: "100%", height: "0.5%", backgroundColor: "#f1f1f1" }}></View>
            <View style={styles.Container}>
                <ChefRecommendation />
            </View>
            <View style={{ width: "100%", height: "0.5%", backgroundColor: "#f1f1f1" }}></View>
            <View style={styles.Container}>
                <KidSpecialOffer />
            </View> */}
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

const CustomLocationButton = ({ location }) => {
    return (
        <View style={{ flexDirection: "row" }}>
            <Image
                source={require('../assets/LocationPinHome.png')}
                style={{
                    height: 40,
                    width: 40,
                    marginTop: "2%",
                }} />
            <Text style={{
                fontSize: 20,
                color: "#325962",
                fontWeight: "bold",
                marginLeft: 5,
                marginTop: "8%"
            }}>{location ? location : 'Location'}</Text>
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
        height: Display.setHeight(15),
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
        height: Display.setHeight(4.5),
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
    Locationbar: {
        // width: Display.setWidth(90),
        // height: Display.setHeight(3.5),
        // position: "absolute",
        // top: Display.setHeight(4),
        // left: '5%',
        // display: "flex",
        // flexDirection: "row",
        // alignItems: "center",
        // justifyContent: 'space-between'
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
        aspectRatio: 3 / 1,
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