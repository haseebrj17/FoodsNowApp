import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, FlatList, View, Text, Image, Dimensions, TouchableWithoutFeedback, Animated, ScrollView } from 'react-native';
import { Extras, Dips, BrandCard } from '../assets/constants/Slider';
import { useFonts } from 'expo-font';
import { Button } from "@react-native-material/core";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Display } from '../utils';
import Skeleton from './Skeleton';
import { useDispatch, useSelector } from "react-redux";
import { fetchBrands } from "../actions/BrandAction";

const column = 3;

const { width, height } = Dimensions.get('screen');

const formatData = (brands, column) => {
    const numOfFullRow = Math.floor(brands.length / column)
    let numOfElementsLastRow = brands.length - (numOfFullRow * column);
    while (numOfElementsLastRow !== column && numOfElementsLastRow !== 0) {
        brands.push({ key: `balnk-${numOfElementsLastRow}`, empty: true });
        numOfElementsLastRow = numOfElementsLastRow + 1;
    }
    return brands;
}

const BrandCardsHome = ({ brand, deliveryParams }) => {
    const [showAllBrands, setShowAllBrands] = useState(false);
    const [imagesLoaded, setImagesLoaded] = useState(0);
    // const [HEIGHT, setHEIGHT] = useState(Display.setHeight(39));
    const [scroll, setScroll] = useState(false);
    const navigation = useNavigation();
    const [brands, setBrand] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleImageLoad = () => {
        setImagesLoaded(prevCount => prevCount + 1);
        if (imagesLoaded + 1 === brands.length) {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (brand) {
            console.log(brand)
            setBrand(brand);
            setLoading(false);
        }
    }, [brand]);

    const HEIGHT = useRef(new Animated.Value(Display.setHeight(39))).current;

    const animateHeight = (toValue) => {
        Animated.timing(HEIGHT, {
            toValue: toValue,
            duration: 400,
            useNativeDriver: false,
        }).start();
    }

    const desiredHeight = 60;

    // const animatedViewRef = useRef(null);

    const ConditionalRendering = ({ brands }) => {
        if (brands.length >= 6) {
            return <Button
                onPress={() => {
                    if (brands.length <= 9) {
                        setShowAllBrands(!showAllBrands)
                        // setHEIGHT(Display.setHeight(58))
                        animateHeight(showAllBrands ? Display.setHeight(39) : Display.setHeight(58));
                        // setTimeout(() => {
                        //     console.log('Attempting to scroll to end'); // Debug log
                        //     animatedViewRef.current?.scrollToEnd({ animated: true });
                        // }, 2000);
                    } else if (brands.length > 9) {
                        navigation.navigate('Brands', { brands })
                    }
                }}
                title={custonTitle}
                style={styles.Button}
                color="rgba(50, 89, 98, 0.2)"
                disableElevation={true}
                uppercase={false}
                leading
            />
        } else {
            return null
        }
    }

    const custonTitle = () => {
        return (
            <View
                style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Text
                    style={{
                        color: "#325962",
                        fontSize: 12,
                        fontWeight: "600",
                        letterSpacing: 0.2,
                        // marginTop: 2,
                    }}
                >Explore all Restaurants</Text>
            </View>
        )
    }

    renderItem = ({ item: brand }) => {
        if (brand.empty === true) {
            return <View style={[styles.BrandCard, styles.itemInvisible]} />;
        }
        colorString = brand.Color.replace(/'/g, '\"');
        colorString = colorString.replace(/\s/g, '');
        const colors = JSON.parse(colorString);
        const imageSource = brand.Logo;
        const thumbnailSource = brand.Thumbnail;
        let imgAspect = 1;
        let imgHeight = 1;
        let imgWidth = 1;
        let imgThumbAspect = 1;
        let imgThumbHeight = 1;
        let imgThumbWidth = 1;
        Image.getSize(
            imageSource,
            (width, height) => {
                if (width && height) {
                    imgWidth = width;
                    imgHeight = height;
                    imgAspect = width / height;
                }
            },
            (error) => {
                console.error(`Couldn't get the image size, check the URI: ${error}`);
            }
        );
        Image.getSize(
            thumbnailSource,
            (width, height) => {
                if (width && height) {
                    imgThumbWidth = width;
                    imgThumbHeight = height;
                    imgThumbAspect = width / height;
                }
            },
            (error) => {
                console.error(`Couldn't get the image size, check the URI: ${error}`);
            }
        );
        return (
            <TouchableWithoutFeedback
                onPress={() => navigation.navigate('HomeNavigator', {
                    screen: 'Details',
                    params: {
                        brand: brand,
                        deliveryParams: deliveryParams
                    }
                })
                }
            >
                <View
                    style={{
                        width: width * 0.27,
                        flexDirection: "column",
                        justifyContent: "flex-start",
                        alignItems: "center",
                        borderRadius: 8,
                        backgroundColor: '#d9d9d9',
                        flex: 1,
                        margin: Display.setHeight(1),
                        height: width * 0.35,
                        marginBottom: Display.setHeight(1.3),
                    }}
                >
                    <View
                        style={{
                            overflow: 'hidden',
                            width: '100%',
                            height: '85%',
                            alignItems: 'center',
                        }}
                    >
                        <Image source={{ uri: brand.Thumbnail }}
                            onLoad={handleImageLoad}
                            style={{
                                height: '100%',
                                resizeMode: "contain",
                                aspectRatio: imgAspect,
                            }}
                        />
                    </View>
                    <View
                        style={{
                            width: '100%',
                            height: '15%',
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: "white",
                            shadowColor: '#000000',
                            shadowOffset: {
                                width: 0,
                                height: 5,
                            },
                            shadowOpacity: 0.4,
                            shadowRadius: 5,
                            elevation: 10,
                            borderBottomRightRadius: 8,
                            borderBottomLeftRadius: 8,
                        }}
                    >
                        <Text
                            style={styles.itemText}
                        >{brand.Name}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    // const translateY = useRef(new Animated.Value(0)).current;
    // const scrollToBottom = () => {
    //     Animated.timing(translateY, {
    //         toValue: -someValue, // The value to represent the end of the content
    //         duration: 800,
    //         useNativeDriver: true,
    //     }).start();
    // };

    return (
        <View>
            {loading ? (
                <View>
                    <Skeleton height={Display.setHeight(2.5)} width={Display.setHeight(35)} style={{ alignSelf: 'center', marginBottom: 5, borderRadius: 6 }} />
                    <View
                        style={{
                            width: '100%',
                            height: Display.setHeight(39),
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row'
                            }}
                        >
                            <Skeleton height={Display.setHeight(14)} width={Display.setHeight(11.5)} style={{ margin: 10, borderRadius: 12 }} />
                            <Skeleton height={Display.setHeight(14)} width={Display.setHeight(11.5)} style={{ margin: 10, borderRadius: 12 }} />
                            <Skeleton height={Display.setHeight(14)} width={Display.setHeight(11.5)} style={{ margin: 10, borderRadius: 12 }} />
                        </View>
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row'
                            }}
                        >
                            <Skeleton height={Display.setHeight(14)} width={Display.setHeight(11.5)} style={{ margin: 10, borderRadius: 12 }} />
                            <Skeleton height={Display.setHeight(14)} width={Display.setHeight(11.5)} style={{ margin: 10, borderRadius: 12 }} />
                            <Skeleton height={Display.setHeight(14)} width={Display.setHeight(11.5)} style={{ margin: 10, borderRadius: 12 }} />
                        </View>
                        <View>
                            <Skeleton height={50} width={240} style={{ margin: 10, borderRadius: 12 }} />
                        </View>
                    </View>
                </View>
            ) : (
                <View>
                    <Animated.View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignSelf: 'center',
                            marginBottom: 1,
                            width: width * 0.9,
                            height: HEIGHT,
                            // transform: [{ translateY: translateY }],
                        }}
                    >
                        <Text style={{
                            fontSize: 15,
                            color: '#325962',
                            fontWeight: "bold",
                            alignSelf: "center",
                            marginBottom: 1,
                        }}>Alles in unserem Food Court, in EINER Lieferung!</Text>
                        <FlatList
                            scrollEnabled={scroll}
                            aria-expanded="false"
                            data={brands ? formatData(brands, column) : null}
                            // data={formatData(showAllBrands ? brands : brands.slice(0, 6), column)}
                            renderItem={renderItem}
                            numColumns={column}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </Animated.View>
                    <ConditionalRendering brands={brands} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    Container: {
        flex: 1,
    },
    BrandCard: {
        width: "30%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
        margin: 40,
        height: Dimensions.get('window').width * 0.2, // approximate a square
    },
    ImageBrandCard: {
        width: 102.08,
        height: 115,
        resizeMode: "cover",
        aspectRatio: 1021 / 1151,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    itemText: {
        fontSize: 10,
        color: "#325962",
        fontWeight: "bold"
    },
    itemInvisible: {
        backgroundColor: 'transparent',
        width: width * 0.27,
        margin: Display.setHeight(1),
        height: width * 0.35,
    },
    textBox: {
        width: 102,
        height: 20,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
        shadowColor: '#000000',
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 10,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 8,
    },
    Button: {
        width: '60%',
        height: Display.setHeight(5),
        alignSelf: "center",
        marginTop: 10,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(50, 89, 98, 0.4)"
    },
})

export default BrandCardsHome;