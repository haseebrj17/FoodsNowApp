import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, FlatList, View, Text, Image, Dimensions, TouchableWithoutFeedback, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Extras, Dips, BrandCard } from '../assets/constants/Slider';
import { useFonts } from 'expo-font';
import { Button } from "@react-native-material/core";
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Display, transformImageUrl } from '../utils';
import Skeleton from '../components/Skeleton';
import { useDispatch, useSelector } from "react-redux";
import { MaterialIcons, Ionicons, EvilIcons, Feather, SimpleLineIcons } from '@expo/vector-icons';

const column = 4;

const { width, height } = Dimensions.get('screen');

const formatData = (categories, column) => {
    const numOfFullRow = Math.floor(categories.length / column)
    let numOfElementsLastRow = categories.length - (numOfFullRow * column);
    while (numOfElementsLastRow !== column && numOfElementsLastRow !== 0) {
        categories.push({ key: `balnk-${numOfElementsLastRow}`, empty: true });
        numOfElementsLastRow = numOfElementsLastRow + 1;
    }
    return categories;
}

const CategoryScreen = ({ route }) => {

    const navigation = useNavigation();

    const { category, deliveryParams } = route.params;

    const [imagesLoaded, setImagesLoaded] = useState(0);
    const [categories, setCategories] = useState(null);
    const [loading, setLoading] = useState(true);

    const handleImageLoad = () => {
        setImagesLoaded(prevCount => prevCount + 1);
        if (imagesLoaded + 1 === categories.length) {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (category) {
            console.log(category);
            setCategories(category);
            setLoading(false);
        }
    }, [category]);

    renderItem = ({ item: category }) => {
        if (category.empty === true) {
            return <View style={[styles.BrandCard, styles.itemInvisible]} />;
        }
        const thumbnailSource = category.Thumbnail;
        let imgThumbAspect = 1;
        let imgThumbHeight = 1;
        let imgThumbWidth = 1;
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
                        brand: category,
                        deliveryParams: deliveryParams
                    }
                })
                }
            >
                <View
                    style={{
                        width: Display.setWidth(18),
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 8,
                        margin: Display.setHeight(1),
                        height: Display.setWidth(18),
                        marginTop: Display.setHeight(1.8),
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            height: '100%',
                        }}
                    >
                        <Image
                            source={{ uri: transformImageUrl({ originalUrl: category.Thumbnail, size: '/tr:w-150' }) }}
                            onLoad={handleImageLoad}
                            style={{
                                aspectRatio: imgThumbAspect,
                                borderRadius: Display.setHeight(50),
                            }}
                        />
                    </View>
                    <View
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: Display.setHeight(0.5),
                        }}
                    >
                        <Text
                            style={styles.itemText}
                        >{category.Name}</Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    }

    return (
        <View>
            {loading ? (
                <View
                    style={{
                        width,
                        height,
                        backgroundColor: '#fff'
                    }}
                >
                    <View
                        style={{
                            width,
                            height: height * 0.12,
                            backgroundColor: '#F4E4CD',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                if (navigation.canGoBack()) {
                                    navigation.goBack();
                                } else {
                                    navigation.navigate('Account');
                                }
                            }}
                            style={{
                                position: "absolute",
                                left: '1%',
                                top: "10%",
                                marginTop: 35,
                                zIndex: 999,
                            }}
                        >
                            <MaterialIcons
                                name="keyboard-arrow-left"
                                size={50}
                                color="#325962"
                            />
                        </TouchableOpacity>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                marginTop: 35,
                                color: "#325962",
                            }}
                        >Categories</Text>
                    </View>
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
                            <Skeleton height={Display.setHeight(14)} width={Display.setHeight(11.5)} style={{ margin: 10, borderRadius: '50%' }} />
                            <Skeleton height={Display.setHeight(14)} width={Display.setHeight(11.5)} style={{ margin: 10, borderRadius: '50%' }} />
                            <Skeleton height={Display.setHeight(14)} width={Display.setHeight(11.5)} style={{ margin: 10, borderRadius: '50%' }} />
                        </View>
                        <View
                            style={{
                                width: '90%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row'
                            }}
                        >
                            <Skeleton height={Display.setHeight(14)} width={Display.setHeight(11.5)} style={{ margin: 10, borderRadius: '50%' }} />
                            <Skeleton height={Display.setHeight(14)} width={Display.setHeight(11.5)} style={{ margin: 10, borderRadius: '50%' }} />
                            <Skeleton height={Display.setHeight(14)} width={Display.setHeight(11.5)} style={{ margin: 10, borderRadius: '50%' }} />
                        </View>
                    </View>
                </View>
            ) : (
                <View
                    style={{
                        width,
                        height,
                        backgroundColor: '#fff'
                    }}
                >
                    <View
                        style={{
                            width,
                            height: height * 0.12,
                            backgroundColor: '#F4E4CD',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'row',
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                if (navigation.canGoBack()) {
                                    navigation.goBack();
                                } else {
                                    navigation.navigate('Account');
                                }
                            }}
                            style={{
                                position: "absolute",
                                left: '1%',
                                top: "10%",
                                marginTop: 35,
                                zIndex: 999,
                            }}
                        >
                            <MaterialIcons
                                name="keyboard-arrow-left"
                                size={50}
                                color="#325962"
                            />
                        </TouchableOpacity>
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                marginTop: 35,
                                color: "#325962",
                            }}
                        >Kategorien</Text>
                    </View>
                    <View
                        style={{
                            flex: 1,
                            justifyContent: 'center',
                            alignSelf: 'center',
                            marginBottom: 1,
                            width: width * 0.9,
                        }}
                    >
                        <FlatList
                            data={categories ? formatData(categories, column) : null}
                            renderItem={renderItem}
                            numColumns={column}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View>
            )
            }
        </View >
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
        height: Dimensions.get('window').width * 0.2,
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

export default CategoryScreen;